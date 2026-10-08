package com.skillmint.service;

import com.skillmint.dto.course.CreateReviewRequest;
import com.skillmint.dto.course.ReviewDTO;
import com.skillmint.entity.Course;
import com.skillmint.entity.Review;
import com.skillmint.entity.User;
import com.skillmint.exception.BadRequestException;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.CourseRepository;
import com.skillmint.repository.EnrollmentRepository;
import com.skillmint.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public List<ReviewDTO> getCourseReviews(Long courseId) {
        return reviewRepository.findByCourseId(courseId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<ReviewDTO> getCourseReviewsPaged(Long courseId, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviewRepository.findByCourseId(courseId, pageable)
                .map(this::mapToDTO);
    }

    @Transactional
    public ReviewDTO createReview(User user, Long courseId, CreateReviewRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        // Enforce constraint: Only enrolled users can review
        if (!enrollmentRepository.existsByUserAndCourse(user, course)) {
            throw new BadRequestException("Only enrolled users can review this course.");
        }

        // Prevent duplicate reviews
        if (reviewRepository.existsByUserAndCourse(user, course)) {
            throw new BadRequestException("You have already reviewed this course. You can update your existing review.");
        }

        Review review = Review.builder()
                .user(user)
                .course(course)
                .rating(request.getRating())
                .comment(request.getComment().trim())
                .build();

        review = reviewRepository.save(review);
        updateCourseRating(course);

        return mapToDTO(review);
    }

    @Transactional
    public ReviewDTO updateReview(User user, Long reviewId, CreateReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        if (!review.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Unauthorized access to update review.");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        review = reviewRepository.save(review);

        updateCourseRating(review.getCourse());

        return mapToDTO(review);
    }

    @Transactional
    public void deleteReview(User user, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        if (!review.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Unauthorized access to delete review.");
        }

        Course course = review.getCourse();
        reviewRepository.delete(review);
        updateCourseRating(course);
    }

    private void updateCourseRating(Course course) {
        List<Review> reviews = reviewRepository.findByCourseId(course.getId());
        if (reviews.isEmpty()) {
            course.setRating(0.0);
            course.setTotalReviews(0);
        } else {
            double avg = reviews.stream().mapToDouble(Review::getRating).average().orElse(0.0);
            course.setRating(Math.round(avg * 10.0) / 10.0);
            course.setTotalReviews(reviews.size());
        }
        courseRepository.save(course);
    }

    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .userAvatar(review.getUser().getProfilePictureUrl())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
