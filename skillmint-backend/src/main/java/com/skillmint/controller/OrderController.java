package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.dto.order.OrderResponse;
import com.skillmint.entity.User;
import com.skillmint.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse> getOrders(@AuthenticationPrincipal User user) {
        List<OrderResponse> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Order fetched", order));
    }
}
