package com.skillmint.repository;

import com.skillmint.entity.Enrollment;
import com.skillmint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserOrderByEnrolledAtDesc(User user);
    Optional<Enrollment> findByUserAndCourseId(User user, Long courseId);
    boolean existsByUserAndCourseId(User user, Long courseId);
    boolean existsByUserAndCourse(User user, com.skillmint.entity.Course course);
}
