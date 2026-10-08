package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.dto.course.CreateReviewRequest;
import com.skillmint.dto.course.ReviewDTO;
import com.skillmint.entity.User;
import com.skillmint.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/courses/{courseId}/reviews")
    public ResponseEntity<ApiResponse> getCourseReviews(@PathVariable Long courseId) {
        List<ReviewDTO> reviews = reviewService.getCourseReviews(courseId);
        return ResponseEntity.ok(ApiResponse.success("Course reviews fetched", reviews));
    }

    @PostMapping("/courses/{courseId}/reviews")
    public ResponseEntity<ApiResponse> createReview(
            @AuthenticationPrincipal User user,
            @PathVariable Long courseId,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewDTO review = reviewService.createReview(user, courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", review));
    }

    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> updateReview(
            @AuthenticationPrincipal User user,
            @PathVariable Long reviewId,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewDTO review = reviewService.updateReview(user, reviewId, request);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", review));
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @AuthenticationPrincipal User user,
            @PathVariable Long reviewId) {
        reviewService.deleteReview(user, reviewId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
    }
}
