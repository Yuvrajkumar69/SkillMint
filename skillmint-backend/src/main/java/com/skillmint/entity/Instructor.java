package com.skillmint.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "instructors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String designation;
    private String profilePictureUrl;
    private String linkedinUrl;
    private String twitterUrl;
    private String websiteUrl;

    @Builder.Default
    private int yearsOfExperience = 0;

    @Builder.Default
    private double rating = 0.0;

    @Builder.Default
    private int totalStudents = 0;

    @Builder.Default
    private int totalCourses = 0;

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
