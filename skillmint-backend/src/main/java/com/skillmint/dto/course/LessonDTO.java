package com.skillmint.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LessonDTO {
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private String youtubeVideoId;
    private String duration;
    private boolean preview;
    private String sectionName;
    private int displayOrder;
}
