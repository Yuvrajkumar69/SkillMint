package com.skillmint.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String userProfilePicture;
    private Double rating;
    private String comment;
    private LocalDateTime createdAt;
}
