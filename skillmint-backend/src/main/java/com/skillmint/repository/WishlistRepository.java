package com.skillmint.repository;

import com.skillmint.entity.WishlistItem;
import com.skillmint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT w FROM WishlistItem w JOIN FETCH w.course course LEFT JOIN FETCH course.instructor LEFT JOIN FETCH course.category WHERE w.user.id = :userId ORDER BY w.addedAt DESC")
    List<WishlistItem> findByUserIdWithCourseDetails(@org.springframework.data.repository.query.Param("userId") Long userId);

    List<WishlistItem> findByUserIdOrderByAddedAtDesc(Long userId);
    List<WishlistItem> findByUserOrderByAddedAtDesc(User user);
    Optional<WishlistItem> findByUserIdAndCourseId(Long userId, Long courseId);
    Optional<WishlistItem> findByUserAndCourseId(User user, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserAndCourseId(User user, Long courseId);
    void deleteByUserIdAndCourseId(Long userId, Long courseId);
    void deleteByUserAndCourseId(User user, Long courseId);
}
