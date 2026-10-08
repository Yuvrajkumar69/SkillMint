package com.skillmint.service;

import com.skillmint.dto.order.OrderResponse;
import com.skillmint.entity.Order;
import com.skillmint.entity.User;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CourseService courseService;

    public List<OrderResponse> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id, User user) {
        Order order = orderRepository.findByIdWithDetails(id)
                .or(() -> orderRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }
        return toResponse(order);
    }

    public OrderResponse toResponse(Order order) {
        if (order == null) return null;

        OrderResponse.UserSummary userSummary = null;
        if (order.getUser() != null) {
            userSummary = OrderResponse.UserSummary.builder()
                    .id(order.getUser().getId())
                    .fullName(order.getUser().getFullName())
                    .email(order.getUser().getEmail())
                    .build();
        }

        List<OrderResponse.OrderItemResponse> itemResponses = null;
        if (order.getItems() != null) {
            itemResponses = order.getItems().stream()
                    .map(item -> OrderResponse.OrderItemResponse.builder()
                            .id(item.getId())
                            .price(item.getPrice())
                            .course(item.getCourse() != null ? courseService.toCardDTO(item.getCourse()) : null)
                            .build())
                    .collect(Collectors.toList());
        }

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .user(userSummary)
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
