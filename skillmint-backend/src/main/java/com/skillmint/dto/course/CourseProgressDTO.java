package com.skillmint.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CourseProgressDTO {
    private Long courseId;
    private int totalLessons;
    private int completedLessons;
    private double progressPercentage;
    private List<Long> completedLessonIds;
    private boolean isCompleted;
}
