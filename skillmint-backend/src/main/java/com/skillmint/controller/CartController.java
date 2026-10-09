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
            @RequestBody(required = false) Map<String, Object> body) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("User authentication required");
        }

        Long courseId = extractCourseId(body);
        if (courseId == null) {
            throw new BadRequestException("courseId is required");
        }

        cartService.addToCart(user, courseId);
        return ResponseEntity.ok(ApiResponse.success("Added to cart"));
    }

    private Long extractCourseId(Map<String, Object> body) {
        if (body == null || body.isEmpty()) {
            return null;
        }
        Object rawId = body.get("courseId");
        if (rawId == null) {
            rawId = body.get("course_id");
        }
        if (rawId == null) {
            rawId = body.get("id");
        }
        if (rawId == null) {
            return null;
        }
        if (rawId instanceof Number number) {
            return number.longValue();
        }
        try {
            return Long.parseLong(rawId.toString().trim());
        } catch (NumberFormatException e) {
            return null;
        }
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
