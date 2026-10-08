package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.dto.course.CourseCardDTO;
import com.skillmint.dto.course.CourseDTO;
import com.skillmint.dto.course.CourseProgressDTO;
import com.skillmint.entity.User;
import com.skillmint.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse> getCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String q) {

        Page<CourseCardDTO> courses = courseService.getCourses(page, size, sort, type, categoryId, level, minPrice, maxPrice, q);
        return ResponseEntity.ok(ApiResponse.success("Courses fetched", courses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCourse(@PathVariable Long id) {
        CourseDTO course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success("Course fetched", course));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse> getCourseBySlug(@PathVariable String slug) {
        CourseDTO course = courseService.getCourseBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Course fetched", course));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse> getFeatured() {
        List<CourseCardDTO> courses = courseService.getFeaturedCourses();
        return ResponseEntity.ok(ApiResponse.success("Featured courses fetched", courses));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse> getTrending() {
        List<CourseCardDTO> courses = courseService.getTrendingCourses();
        return ResponseEntity.ok(ApiResponse.success("Trending courses fetched", courses));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse> getCoursesByType(@PathVariable String type) {
        List<CourseCardDTO> courses = courseService.getCoursesByType(type);
        return ResponseEntity.ok(ApiResponse.success("Courses by type fetched", courses));
    }

    @GetMapping("/{courseId}/progress")
    public ResponseEntity<ApiResponse> getCourseProgress(
            @AuthenticationPrincipal User user,
            @PathVariable Long courseId) {
        CourseProgressDTO progress = courseService.getCourseProgress(user, courseId);
        return ResponseEntity.ok(ApiResponse.success("Course progress fetched", progress));
    }

    @PostMapping("/{courseId}/lessons/{lessonId}/complete")
    public ResponseEntity<ApiResponse> toggleLessonCompletion(
            @AuthenticationPrincipal User user,
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {
        CourseProgressDTO progress = courseService.toggleLessonCompletion(user, courseId, lessonId);
        return ResponseEntity.ok(ApiResponse.success("Lesson progress updated", progress));
    }
}
