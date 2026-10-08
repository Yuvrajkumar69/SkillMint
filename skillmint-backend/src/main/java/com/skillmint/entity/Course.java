package com.skillmint.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String whatYouWillLearn; // newline-separated list

    @Column(columnDefinition = "TEXT")
    private String requirements; // newline-separated list

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;

    @Column(nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal originalPrice;

    @Builder.Default
    @Column(precision = 10, scale = 2)
    private java.math.BigDecimal discountedPrice = java.math.BigDecimal.ZERO;

    @Builder.Default
    private Integer discountPercent = 0;

    private String thumbnailUrl;
    private String previewVideoUrl;
    private String language;
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED

    @Builder.Default
    private Integer totalLessons = 0;

    private String totalDuration; // e.g. "24h 30m"

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer totalReviews = 0;

    @Builder.Default
    private Integer totalStudents = 0;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private boolean trending = false;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    @Column(nullable = false)
    private String type = "COURSE";

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<CourseLesson> lessons;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
