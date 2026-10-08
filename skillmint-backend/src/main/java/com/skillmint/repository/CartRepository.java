package com.skillmint.repository;

import com.skillmint.entity.CartItem;
import com.skillmint.entity.Course;
import com.skillmint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CartItem c JOIN FETCH c.course course LEFT JOIN FETCH course.instructor LEFT JOIN FETCH course.category WHERE c.user.id = :userId ORDER BY c.addedAt DESC")
    List<CartItem> findByUserIdWithCourseDetails(@org.springframework.data.repository.query.Param("userId") Long userId);

    List<CartItem> findByUserIdOrderByAddedAtDesc(Long userId);
    List<CartItem> findByUserOrderByAddedAtDesc(User user);
    Optional<CartItem> findByUserIdAndCourseId(Long userId, Long courseId);
    Optional<CartItem> findByUserAndCourseId(User user, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserAndCourseId(User user, Long courseId);
    void deleteByUserIdAndCourseId(Long userId, Long courseId);
    void deleteByUserAndCourseId(User user, Long courseId);
    void deleteByUserAndCourseIn(User user, List<Course> courses);
    void deleteByUserAndCourseIdIn(User user, List<Long> courseIds);
    void deleteAllByUserId(Long userId);
    void deleteAllByUser(User user);
}
