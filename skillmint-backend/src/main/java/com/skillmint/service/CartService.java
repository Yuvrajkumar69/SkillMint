package com.skillmint.service;

import com.skillmint.dto.course.CourseCardDTO;
import com.skillmint.entity.*;
import com.skillmint.exception.BadRequestException;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;

    @Transactional(readOnly = true)
    public List<CourseCardDTO> getCart(User user) {
        if (user == null || user.getId() == null) return List.of();
        return cartRepository.findByUserIdWithCourseDetails(user.getId())
                .stream()
                .filter(item -> item != null && item.getCourse() != null)
                .map(item -> courseService.toCardDTO(item.getCourse()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToCart(User user, Long courseId) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("User must be authenticated");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (cartRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new BadRequestException("Course is already in your cart");
        }

        if (enrollmentRepository.existsByUserAndCourseId(user, courseId)) {
            throw new BadRequestException("You are already enrolled in this course");
        }

        CartItem item = CartItem.builder()
                .user(user)
                .course(course)
                .build();
        cartRepository.save(item);
    }

    @Transactional
    public void removeFromCart(User user, Long courseId) {
        if (user == null || user.getId() == null) return;
        cartRepository.deleteByUserIdAndCourseId(user.getId(), courseId);
    }

    @Transactional
    public void clearCart(User user) {
        if (user == null || user.getId() == null) return;
        cartRepository.deleteAllByUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public boolean isInCart(User user, Long courseId) {
        if (user == null || user.getId() == null) return false;
        return cartRepository.existsByUserIdAndCourseId(user.getId(), courseId);
    }
}
