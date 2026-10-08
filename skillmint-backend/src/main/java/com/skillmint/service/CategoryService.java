package com.skillmint.service;

import com.skillmint.dto.course.CategoryDTO;
import com.skillmint.entity.Category;
import com.skillmint.repository.CategoryRepository;
import com.skillmint.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getCategoriesByType(String type) {
        return categoryRepository.findByTypeAndActiveTrueOrderByDisplayOrderAsc(type.toUpperCase())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private CategoryDTO toDTO(Category cat) {
        long courseCount = courseRepository.findByCategoryIdAndActiveTrue(
                cat.getId(),
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE)
        ).getTotalElements();

        return CategoryDTO.builder()
                .id(cat.getId())
                .name(cat.getName())
                .slug(cat.getSlug())
                .description(cat.getDescription())
                .iconName(cat.getIconName())
                .type(cat.getType())
                .courseCount((int) courseCount)
                .build();
    }
}
