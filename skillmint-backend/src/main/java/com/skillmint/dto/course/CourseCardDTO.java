package com.skillmint.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CourseCardDTO {
    private Long id;
    private String title;
    private String slug;
    private String subtitle;
    private String thumbnailUrl;
    private String previewVideoUrl;
    private String level;
    private String totalDuration;
    private Integer totalLessons;
    private java.math.BigDecimal originalPrice;
    private java.math.BigDecimal discountedPrice;
    private Integer discountPercent;
    private Double rating;
    private Integer totalReviews;
    private Integer totalStudents;
    private boolean featured;
    private boolean trending;
    private InstructorDTO instructor;
    private CategoryDTO category;
}
