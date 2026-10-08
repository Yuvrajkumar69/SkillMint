package com.skillmint.repository;

import com.skillmint.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActiveTrueOrderByDisplayOrderAsc();
    List<Category> findByTypeAndActiveTrueOrderByDisplayOrderAsc(String type);
    Optional<Category> findBySlug(String slug);
    boolean existsByName(String name);
}
