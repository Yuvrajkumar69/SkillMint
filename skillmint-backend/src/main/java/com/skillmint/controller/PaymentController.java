package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.dto.payment.CreateOrderRequest;
import com.skillmint.dto.payment.VerifyPaymentRequest;
import com.skillmint.entity.User;
import com.skillmint.service.PaymentService;
import com.razorpay.RazorpayException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateOrderRequest request) throws RazorpayException {
        var result = paymentService.createOrder(user, request);
        return ResponseEntity.ok(ApiResponse.success("Order created", result));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyPayment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody VerifyPaymentRequest request) {
        paymentService.verifyPayment(user, request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and enrollment created successfully"));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        paymentService.processWebhook(payload, signature);
        return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully"));
    }
}
