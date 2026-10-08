package com.skillmint.service;

import com.skillmint.dto.payment.CreateOrderRequest;
import com.skillmint.dto.payment.VerifyPaymentRequest;
import com.skillmint.entity.*;
import com.skillmint.exception.BadRequestException;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    @Value("${razorpay.key_id:}")
    private String keyId;

    @Value("${razorpay.key_secret:}")
    private String keySecret;

    @Value("${razorpay.webhook_secret:secret_webhook_key_123}")
    private String webhookSecret;

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final CartRepository cartRepository;
    private final EnrollmentService enrollmentService;
    private final EmailService emailService;

    @Transactional
    public Map<String, Object> createOrder(User user, CreateOrderRequest request) throws RazorpayException {
        if (user == null) {
            throw new BadRequestException("User authentication required");
        }
        if (request == null || request.getCourseIds() == null || request.getCourseIds().isEmpty()) {
            throw new BadRequestException("Course list cannot be empty");
        }

        List<Course> courses = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        Set<Long> processedCourseIds = new HashSet<>();

        for (Long courseId : request.getCourseIds()) {
            if (courseId == null) continue;
            if (!processedCourseIds.add(courseId)) {
                continue; // Prevent duplicate entries in same order
            }

            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

            if (!course.isActive()) {
                throw new BadRequestException("Course is not active: " + course.getTitle());
            }

            if (enrollmentService.isEnrolled(user, courseId)) {
                throw new BadRequestException("You are already enrolled in course: " + course.getTitle());
            }

            courses.add(course);
            BigDecimal price = course.getDiscountedPrice() != null && course.getDiscountedPrice().compareTo(BigDecimal.ZERO) > 0
                    ? course.getDiscountedPrice() : course.getOriginalPrice();
            totalAmount = totalAmount.add(price);
        }

        if (courses.isEmpty()) {
            throw new BadRequestException("No valid courses selected for order");
        }

        // Create internal order
        String orderNumber = "SM-" + System.currentTimeMillis();
        Order order = Order.builder()
                .user(user)
                .orderNumber(orderNumber)
                .totalAmount(totalAmount)
                .status(Order.OrderStatus.PENDING)
                .build();

        List<OrderItem> items = new ArrayList<>();
        for (Course course : courses) {
            BigDecimal price = course.getDiscountedPrice() != null && course.getDiscountedPrice().compareTo(BigDecimal.ZERO) > 0
                    ? course.getDiscountedPrice() : course.getOriginalPrice();
            items.add(OrderItem.builder().order(order).course(course).price(price).build());
        }
        order.setItems(items);
        orderRepository.save(order);

        // Create Razorpay order (amount in paise = totalAmount * 100)
        long amountInPaise = totalAmount.multiply(new BigDecimal("100")).longValue();
        if (amountInPaise < 100) {
            throw new BadRequestException("Order amount must be at least ₹1.00");
        }

        if (keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
            throw new BadRequestException("Razorpay payment gateway credentials are not configured");
        }

        log.info("Creating Razorpay order for user: {}, amount: {} paise, orderNumber: {}", user.getEmail(), amountInPaise, orderNumber);

        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", orderNumber);

        com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
        String razorpayOrderId = razorpayOrder.get("id");

        // Create payment record
        Payment payment = Payment.builder()
                .order(order)
                .razorpayOrderId(razorpayOrderId)
                .amount(totalAmount)
                .status(Payment.PaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", razorpayOrderId);
        response.put("orderNumber", orderNumber);
        response.put("amount", amountInPaise);
        response.put("currency", "INR");
        response.put("keyId", keyId);
        return response;
    }

    @Transactional
    public void verifyPayment(User user, VerifyPaymentRequest request) {
        if (request == null || request.getRazorpayOrderId() == null || request.getRazorpayPaymentId() == null || request.getRazorpaySignature() == null) {
            throw new BadRequestException("Invalid payment verification request payload");
        }

        // Verify Razorpay signature
        if (!verifySignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature())) {
            throw new BadRequestException("Payment verification failed: Invalid signature");
        }

        Order order = orderRepository.findByOrderNumber(request.getOrderNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + request.getOrderNumber()));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to order");
        }

        // Idempotency check: if order is already COMPLETED, return early
        if (order.getStatus() == Order.OrderStatus.COMPLETED) {
            log.info("Order {} is already completed. Skipping idempotent payment verification.", order.getOrderNumber());
            return;
        }

        fulfillOrder(order, request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());
    }

    @Transactional
    public void processWebhook(String payload, String signature) {
        if (payload == null || signature == null || !verifyHmacSha256(payload, signature, webhookSecret)) {
            throw new BadRequestException("Invalid webhook signature");
        }

        JSONObject json = new JSONObject(payload);
        String event = json.optString("event");
        log.info("Processing Razorpay Webhook Event: {}", event);

        if ("payment.captured".equals(event) || "order.paid".equals(event)) {
            JSONObject paymentEntity = json.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
            String razorpayOrderId = paymentEntity.optString("order_id");
            String razorpayPaymentId = paymentEntity.optString("id");

            Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElse(null);
            if (payment != null) {
                Order order = payment.getOrder();
                if (order.getStatus() != Order.OrderStatus.COMPLETED) {
                    fulfillOrder(order, razorpayOrderId, razorpayPaymentId, "WEBHOOK");
                } else {
                    log.info("Order {} already completed. Webhook skipped.", order.getOrderNumber());
                }
            }
        } else if ("payment.failed".equals(event)) {
            JSONObject paymentEntity = json.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
            String razorpayOrderId = paymentEntity.optString("order_id");

            Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElse(null);
            if (payment != null) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                if (order.getStatus() == Order.OrderStatus.PENDING) {
                    order.setStatus(Order.OrderStatus.CANCELLED);
                    orderRepository.save(order);
                }
            }
        }
    }

    private void fulfillOrder(Order order, String razorpayOrderId, String razorpayPaymentId, String signature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for Razorpay Order: " + razorpayOrderId));

        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus(Payment.PaymentStatus.CAPTURED);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        order.setStatus(Order.OrderStatus.COMPLETED);
        orderRepository.save(order);

        List<Course> purchasedCourses = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
            enrollmentService.createEnrollment(order.getUser(), item.getCourse(), order);
            purchasedCourses.add(item.getCourse());
        }

        // Clean only purchased courses from cart
        if (!purchasedCourses.isEmpty()) {
            cartRepository.deleteByUserAndCourseIn(order.getUser(), purchasedCourses);
        }

        // Send confirmation email asynchronously / safely
        try {
            List<String> courseNames = purchasedCourses.stream()
                    .map(Course::getTitle)
                    .toList();
            emailService.sendPaymentConfirmationEmail(
                    order.getUser().getEmail(), order.getUser().getFullName(),
                    courseNames, order.getTotalAmount(), order.getOrderNumber()
            );
        } catch (Exception e) {
            log.error("Failed to send payment confirmation email for order {}: {}", order.getOrderNumber(), e.getMessage());
        }
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        return verifyHmacSha256(orderId + "|" + paymentId, signature, keySecret);
    }

    private boolean verifyHmacSha256(String data, String expectedSignature, String secret) {
        try {
            if (secret == null || secret.isBlank()) return false;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString().equals(expectedSignature);
        } catch (Exception e) {
            log.error("HMAC verification error: {}", e.getMessage());
            return false;
        }
    }
}
