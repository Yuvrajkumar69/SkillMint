package com.skillmint.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InstructorDTO {
    private Long id;
    private String name;
    private String bio;
    private String designation;
    private String profilePictureUrl;
    private String linkedinUrl;
    private int yearsOfExperience;
    private double rating;
    private int totalStudents;
    private int totalCourses;
}
