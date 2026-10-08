package com.skillmint.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String slug;
    private String subtitle;
    private String description;
    private List<String> whatYouWillLearn;
    private List<String> requirements;
    private CategoryDTO category;
    private InstructorDTO instructor;
    private java.math.BigDecimal originalPrice;
    private java.math.BigDecimal discountedPrice;
    private Integer discountPercent;
    private String thumbnailUrl;
    private String previewVideoUrl;
    private String language;
    private String level;
    private Integer totalLessons;
    private String totalDuration;
    private Double rating;
    private Integer totalReviews;
    private Integer totalStudents;
    private boolean featured;
    private boolean trending;
    private List<LessonDTO> lessons;
    private List<ReviewDTO> recentReviews;
}
