package com.skillmint.service;

import com.skillmint.dto.course.*;
import com.skillmint.entity.*;
import com.skillmint.exception.BadRequestException;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CourseLessonRepository courseLessonRepository;

    public Page<CourseCardDTO> getCourses(
            int page, int size, String sort, String type,
            Long categoryId, String level, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, String query) {

        Sort sortOrder = buildSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<Course> courses = courseRepository.filterCourses(
                (type != null && !type.isBlank()) ? type : null,
                categoryId, level, minPrice, maxPrice,
                (query != null && !query.isBlank()) ? query : null,
                pageable
        );

        return courses.map(this::toCardDTO);
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return toFullDTO(course);
    }

    public CourseDTO getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));
        return toFullDTO(course);
    }

    public List<CourseCardDTO> getFeaturedCourses() {
        return courseRepository.findByFeaturedTrueAndActiveTrue()
                .stream().map(this::toCardDTO).collect(Collectors.toList());
    }

    public List<CourseCardDTO> getTrendingCourses() {
        return courseRepository.findByTrendingTrueAndActiveTrue()
                .stream().map(this::toCardDTO).collect(Collectors.toList());
    }

    public List<CourseCardDTO> getCoursesByType(String type) {
        return courseRepository.findByType(type.toUpperCase(), PageRequest.of(0, 8))
                .stream().map(this::toCardDTO).collect(Collectors.toList());
    }

    @Transactional
    public CourseProgressDTO toggleLessonCompletion(User user, Long courseId, Long lessonId) {
        CourseLesson lesson = courseLessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        if (!lesson.getCourse().getId().equals(courseId)) {
            throw new BadRequestException("Lesson does not belong to course " + courseId);
        }

        Optional<LessonProgress> existing = lessonProgressRepository.findByUserAndLesson(user, lesson);
        if (existing.isPresent()) {
            lessonProgressRepository.delete(existing.get());
        } else {
            LessonProgress progress = LessonProgress.builder()
                    .user(user)
                    .lesson(lesson)
                    .build();
            lessonProgressRepository.save(progress);
        }

        return getCourseProgress(user, courseId);
    }

    public CourseProgressDTO getCourseProgress(User user, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        List<LessonProgress> progressList = lessonProgressRepository.findByUserAndLesson_Course_Id(user, courseId);
        List<Long> completedIds = progressList.stream()
                .map(lp -> lp.getLesson().getId())
                .toList();

        int total = course.getLessons() != null ? course.getLessons().size() : 0;
        int completed = completedIds.size();
        double pct = total > 0 ? (double) completed / total * 100.0 : 0.0;

        return CourseProgressDTO.builder()
                .courseId(courseId)
                .totalLessons(total)
                .completedLessons(completed)
                .progressPercentage(Math.round(pct * 10.0) / 10.0)
                .completedLessonIds(completedIds)
                .isCompleted(total > 0 && completed >= total)
                .build();
    }

    private Sort buildSort(String sort) {
        if (sort == null) return Sort.by("createdAt").descending();
        return switch (sort) {
            case "price-asc" -> Sort.by("discountedPrice").ascending();
            case "price-desc" -> Sort.by("discountedPrice").descending();
            case "rating" -> Sort.by("rating").descending();
            case "popular" -> Sort.by("totalStudents").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("createdAt").descending();
        };
    }

    public CourseCardDTO toCardDTO(Course course) {
        return CourseCardDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .slug(course.getSlug())
                .subtitle(course.getSubtitle())
                .thumbnailUrl(course.getThumbnailUrl())
                .previewVideoUrl(course.getPreviewVideoUrl())
                .level(course.getLevel())
                .totalDuration(course.getTotalDuration())
                .totalLessons(course.getTotalLessons())
                .originalPrice(course.getOriginalPrice())
                .discountedPrice(course.getDiscountedPrice())
                .discountPercent(course.getDiscountPercent())
                .rating(course.getRating())
                .totalReviews(course.getTotalReviews())
                .totalStudents(course.getTotalStudents())
                .featured(course.isFeatured())
                .trending(course.isTrending())
                .instructor(course.getInstructor() != null ? toInstructorDTO(course.getInstructor()) : null)
                .category(course.getCategory() != null ? toCategoryDTO(course.getCategory()) : null)
                .build();
    }

    private CourseDTO toFullDTO(Course course) {
        List<Review> reviews = reviewRepository.findByCourseId(course.getId());

        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .slug(course.getSlug())
                .subtitle(course.getSubtitle())
                .description(course.getDescription())
                .whatYouWillLearn(splitLines(course.getWhatYouWillLearn()))
                .requirements(splitLines(course.getRequirements()))
                .category(toCategoryDTO(course.getCategory()))
                .instructor(toInstructorDTO(course.getInstructor()))
                .originalPrice(course.getOriginalPrice())
                .discountedPrice(course.getDiscountedPrice())
                .discountPercent(course.getDiscountPercent())
                .thumbnailUrl(course.getThumbnailUrl())
                .previewVideoUrl(course.getPreviewVideoUrl())
                .language(course.getLanguage())
                .level(course.getLevel())
                .totalLessons(course.getTotalLessons())
                .totalDuration(course.getTotalDuration())
                .rating(course.getRating())
                .totalReviews(course.getTotalReviews())
                .totalStudents(course.getTotalStudents())
                .featured(course.isFeatured())
                .trending(course.isTrending())
                .lessons(course.getLessons() != null
                        ? course.getLessons().stream().map(this::toLessonDTO).collect(Collectors.toList())
                        : List.of())
                .recentReviews(reviews.stream().limit(5).map(this::toReviewDTO).collect(Collectors.toList()))
                .build();
    }

    private InstructorDTO toInstructorDTO(Instructor inst) {
        if (inst == null) return null;
        return InstructorDTO.builder()
                .id(inst.getId())
                .name(inst.getName())
                .bio(inst.getBio())
                .designation(inst.getDesignation())
                .profilePictureUrl(inst.getProfilePictureUrl())
                .linkedinUrl(inst.getLinkedinUrl())
                .yearsOfExperience(inst.getYearsOfExperience())
                .rating(inst.getRating())
                .totalStudents(inst.getTotalStudents())
                .totalCourses(inst.getTotalCourses())
                .build();
    }

    private CategoryDTO toCategoryDTO(com.skillmint.entity.Category cat) {
        if (cat == null) return null;
        return CategoryDTO.builder()
                .id(cat.getId())
                .name(cat.getName())
                .slug(cat.getSlug())
                .iconName(cat.getIconName())
                .type(cat.getType())
                .build();
    }

    private LessonDTO toLessonDTO(CourseLesson lesson) {
        return LessonDTO.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .videoUrl(lesson.getVideoUrl())
                .youtubeVideoId(lesson.getYoutubeVideoId())
                .duration(lesson.getDuration())
                .preview(lesson.isPreview())
                .sectionName(lesson.getSectionName())
                .displayOrder(lesson.getDisplayOrder())
                .build();
    }

    private ReviewDTO toReviewDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .userName(review.getUser().getFullName())
                .userProfilePicture(review.getUser().getProfilePictureUrl())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private List<String> splitLines(String text) {
        if (text == null || text.isBlank()) return List.of();
        return Arrays.stream(text.split("\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
