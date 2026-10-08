package com.skillmint.repository;

import com.skillmint.entity.CourseLesson;
import com.skillmint.entity.LessonProgress;
import com.skillmint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserAndLesson(User user, CourseLesson lesson);
    List<LessonProgress> findByUserAndLesson_Course_Id(User user, Long courseId);
    void deleteByUserAndLesson(User user, CourseLesson lesson);
    long countByUserAndLesson_Course_Id(User user, Long courseId);
}
