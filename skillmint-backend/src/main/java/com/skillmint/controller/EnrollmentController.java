package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.entity.User;
import com.skillmint.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/my-courses")
    public ResponseEntity<ApiResponse> getMyCourses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("My courses fetched", enrollmentService.getMyEnrollments(user)));
    }

    @GetMapping("/check/{courseId}")
    public ResponseEntity<ApiResponse> checkEnrollment(
            @AuthenticationPrincipal User user,
            @PathVariable Long courseId) {
        boolean enrolled = enrollmentService.isEnrolled(user, courseId);
        return ResponseEntity.ok(ApiResponse.success("Checked", Map.of("enrolled", enrolled)));
    }
}
