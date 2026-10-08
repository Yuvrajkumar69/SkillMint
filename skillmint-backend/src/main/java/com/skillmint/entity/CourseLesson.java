package com.skillmint.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_lessons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    private String description;
    private String videoUrl;
    private String youtubeVideoId;
    private String duration; // e.g. "12m 30s"

    @Builder.Default
    private boolean preview = false; // free preview

    private String sectionName;

    @Builder.Default
    private int displayOrder = 0;
}
