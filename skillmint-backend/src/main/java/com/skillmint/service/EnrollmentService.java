package com.skillmint.service;

import com.skillmint.dto.course.CourseCardDTO;
import com.skillmint.entity.*;
import com.skillmint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;

    public List<CourseCardDTO> getMyEnrollments(User user) {
        return enrollmentRepository.findByUserOrderByEnrolledAtDesc(user)
                .stream()
                .map(e -> courseService.toCardDTO(e.getCourse()))
                .collect(Collectors.toList());
    }

    public boolean isEnrolled(User user, Long courseId) {
        return enrollmentRepository.existsByUserAndCourseId(user, courseId);
    }

    @Transactional
    public void createEnrollment(User user, Course course, Order order) {
        if (!enrollmentRepository.existsByUserAndCourseId(user, course.getId())) {
            Enrollment enrollment = Enrollment.builder()
                    .user(user)
                    .course(course)
                    .order(order)
                    .progressPercent(0)
                    .build();
            enrollmentRepository.save(enrollment);
        }
    }
}
