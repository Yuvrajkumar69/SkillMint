package com.skillmint.service;

import com.skillmint.dto.course.CourseCardDTO;
import com.skillmint.entity.*;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CourseRepository courseRepository;
    private final CourseService courseService;

    @Transactional(readOnly = true)
    public List<CourseCardDTO> getWishlist(User user) {
        if (user == null || user.getId() == null) return List.of();
        return wishlistRepository.findByUserIdWithCourseDetails(user.getId())
                .stream()
                .filter(item -> item != null && item.getCourse() != null)
                .map(item -> courseService.toCardDTO(item.getCourse()))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleWishlist(User user, Long courseId) {
        if (user == null || user.getId() == null) return false;
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (wishlistRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            wishlistRepository.deleteByUserIdAndCourseId(user.getId(), courseId);
            return false; // removed
        } else {
            WishlistItem item = WishlistItem.builder()
                    .user(user)
                    .course(course)
                    .build();
            wishlistRepository.save(item);
            return true; // added
        }
    }

    @Transactional(readOnly = true)
    public boolean isWishlisted(User user, Long courseId) {
        if (user == null || user.getId() == null) return false;
        return wishlistRepository.existsByUserIdAndCourseId(user.getId(), courseId);
    }
}
