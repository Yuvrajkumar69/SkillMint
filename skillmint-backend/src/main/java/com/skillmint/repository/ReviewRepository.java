package com.skillmint.repository;

import com.skillmint.entity.Course;
import com.skillmint.entity.Review;
import com.skillmint.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourseId(Long courseId);
    Page<Review> findByCourseId(Long courseId, Pageable pageable);
    Optional<Review> findByUserAndCourse(User user, Course course);
    boolean existsByUserAndCourse(User user, Course course);
    long countByCourseId(Long courseId);
}
