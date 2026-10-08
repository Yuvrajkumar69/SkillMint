package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.entity.User;
import com.skillmint.exception.BadRequestException;
import com.skillmint.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Wishlist fetched", wishlistService.getWishlist(user)));
    }

    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse> toggle(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        if (body == null || !body.containsKey("courseId") || body.get("courseId") == null) {
            throw new BadRequestException("courseId is required");
        }
        Long courseId = ((Number) body.get("courseId")).longValue();
        boolean added = wishlistService.toggleWishlist(user, courseId);
        String msg = added ? "Added to wishlist" : "Removed from wishlist";
        return ResponseEntity.ok(ApiResponse.success(msg, Map.of("added", added)));
    }

    @GetMapping("/check/{courseId}")
    public ResponseEntity<ApiResponse> check(
            @AuthenticationPrincipal User user,
            @PathVariable Long courseId) {
        boolean wishlisted = wishlistService.isWishlisted(user, courseId);
        return ResponseEntity.ok(ApiResponse.success("Checked", Map.of("wishlisted", wishlisted)));
    }
}
