package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.dto.order.OrderResponse;
import com.skillmint.entity.*;
import com.skillmint.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin stats fetched", stats));
    }

    // --- COURSES ---
    @PostMapping("/courses")
    public ResponseEntity<ApiResponse> createCourse(@RequestBody Course course) {
        Course saved = adminService.createCourse(course);
        return ResponseEntity.ok(ApiResponse.success("Course created", saved));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<ApiResponse> updateCourse(@PathVariable Long id, @RequestBody Course details) {
        Course updated = adminService.updateCourse(id, details);
        return ResponseEntity.ok(ApiResponse.success("Course updated", updated));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse> deleteCourse(@PathVariable Long id) {
        adminService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted"));
    }

    // --- CATEGORIES ---
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse> createCategory(@RequestBody Category category) {
        Category saved = adminService.createCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Category created", saved));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long id, @RequestBody Category details) {
        Category updated = adminService.updateCategory(id, details);
        return ResponseEntity.ok(ApiResponse.success("Category updated", updated));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted"));
    }

    // --- INSTRUCTORS ---
    @PostMapping("/instructors")
    public ResponseEntity<ApiResponse> createInstructor(@RequestBody Instructor instructor) {
        Instructor saved = adminService.createInstructor(instructor);
        return ResponseEntity.ok(ApiResponse.success("Instructor created", saved));
    }

    @PutMapping("/instructors/{id}")
    public ResponseEntity<ApiResponse> updateInstructor(@PathVariable Long id, @RequestBody Instructor details) {
        Instructor updated = adminService.updateInstructor(id, details);
        return ResponseEntity.ok(ApiResponse.success("Instructor updated", updated));
    }

    @DeleteMapping("/instructors/{id}")
    public ResponseEntity<ApiResponse> deleteInstructor(@PathVariable Long id) {
        adminService.deleteInstructor(id);
        return ResponseEntity.ok(ApiResponse.success("Instructor deleted"));
    }

    // --- LESSONS ---
    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<ApiResponse> addLesson(@PathVariable Long courseId, @RequestBody CourseLesson lesson) {
        CourseLesson saved = adminService.addLesson(courseId, lesson);
        return ResponseEntity.ok(ApiResponse.success("Lesson added", saved));
    }

    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse> updateLesson(@PathVariable Long lessonId, @RequestBody CourseLesson details) {
        CourseLesson updated = adminService.updateLesson(lessonId, details);
        return ResponseEntity.ok(ApiResponse.success("Lesson updated", updated));
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse> deleteLesson(@PathVariable Long lessonId) {
        adminService.deleteLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted"));
    }

    // --- USERS ---
    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<User> users = adminService.getUsers(page, size);
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse> toggleUserStatus(@PathVariable Long userId) {
        User user = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("User status updated", user));
    }

    // --- ORDERS & PAYMENTS ---
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<OrderResponse> orders = adminService.getOrders(page, size);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched", orders));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse> getPayments() {
        List<Payment> payments = adminService.getPayments();
        return ResponseEntity.ok(ApiResponse.success("Payments fetched", payments));
    }
}
