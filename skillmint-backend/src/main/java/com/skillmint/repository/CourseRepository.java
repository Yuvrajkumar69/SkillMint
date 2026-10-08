package com.skillmint.repository;

import com.skillmint.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findBySlug(String slug);

    Page<Course> findByActiveTrue(Pageable pageable);

    List<Course> findByFeaturedTrueAndActiveTrue();

    List<Course> findByTrendingTrueAndActiveTrue();

    Page<Course> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.active = true AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.subtitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Course> searchCourses(@Param("query") String query, Pageable pageable);

    @Query(
        value = "SELECT c FROM Course c WHERE c.active = true AND " +
               "(:type IS NULL OR UPPER(c.type) = UPPER(:type) OR (c.category IS NOT NULL AND UPPER(c.category.type) = UPPER(:type))) AND " +
               "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
               "(:level IS NULL OR c.level = :level) AND " +
               "(:minPrice IS NULL OR c.discountedPrice >= :minPrice) AND " +
               "(:maxPrice IS NULL OR c.discountedPrice <= :maxPrice) AND " +
               "(:query IS NULL OR (LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
               "LOWER(c.subtitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
               "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))))",
        countQuery = "SELECT COUNT(c) FROM Course c WHERE c.active = true AND " +
               "(:type IS NULL OR UPPER(c.type) = UPPER(:type) OR (c.category IS NOT NULL AND UPPER(c.category.type) = UPPER(:type))) AND " +
               "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
               "(:level IS NULL OR c.level = :level) AND " +
               "(:minPrice IS NULL OR c.discountedPrice >= :minPrice) AND " +
               "(:maxPrice IS NULL OR c.discountedPrice <= :maxPrice) AND " +
               "(:query IS NULL OR (LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
               "LOWER(c.subtitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
               "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))))"
    )
    Page<Course> filterCourses(
            @Param("type") String type,
            @Param("categoryId") Long categoryId,
            @Param("level") String level,
            @Param("minPrice") java.math.BigDecimal minPrice,
            @Param("maxPrice") java.math.BigDecimal maxPrice,
            @Param("query") String query,
            Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.category.id IN " +
           "(SELECT cat.id FROM Category cat WHERE cat.type = :type) AND c.active = true")
    List<Course> findByType(@Param("type") String type, Pageable pageable);
}
