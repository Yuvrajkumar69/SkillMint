package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.entity.User;
import com.skillmint.exception.BadRequestException;
import com.skillmint.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Cart fetched", cartService.getCart(user)));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToCart(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        if (body == null || !body.containsKey("courseId") || body.get("courseId") == null) {
            throw new BadRequestException("courseId is required");
        }
        Long courseId = ((Number) body.get("courseId")).longValue();
        cartService.addToCart(user, courseId);
        return ResponseEntity.ok(ApiResponse.success("Added to cart"));
    }

    @DeleteMapping("/remove/{courseId}")
    public ResponseEntity<ApiResponse> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long courseId) {
        cartService.removeFromCart(user, courseId);
        return ResponseEntity.ok(ApiResponse.success("Removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }
}
