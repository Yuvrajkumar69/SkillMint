package com.skillmint.service;

import com.skillmint.dto.course.CourseDTO;
import com.skillmint.dto.course.LessonDTO;
import com.skillmint.dto.order.OrderResponse;
import com.skillmint.entity.*;
import com.skillmint.exception.BadRequestException;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final InstructorRepository instructorRepository;
    private final CourseLessonRepository courseLessonRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderService orderService;

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long totalOrders = orderRepository.count();

        java.math.BigDecimal totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.CAPTURED && p.getAmount() != null)
                .map(Payment::getAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalCourses", totalCourses);
        stats.put("totalEnrollments", totalEnrollments);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        return stats;
    }

    // --- COURSES ---
    @Transactional
    public Course createCourse(Course course) {
        if (course.getSlug() == null || course.getSlug().isBlank()) {
            course.setSlug(course.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long id, Course details) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));

        course.setTitle(details.getTitle());
        course.setSubtitle(details.getSubtitle());
        course.setDescription(details.getDescription());
        course.setWhatYouWillLearn(details.getWhatYouWillLearn());
        course.setRequirements(details.getRequirements());
        course.setOriginalPrice(details.getOriginalPrice());
        course.setDiscountedPrice(details.getDiscountedPrice());
        course.setThumbnailUrl(details.getThumbnailUrl());
        course.setPreviewVideoUrl(details.getPreviewVideoUrl());
        course.setLevel(details.getLevel());
        course.setLanguage(details.getLanguage());
        course.setFeatured(details.isFeatured());
        course.setTrending(details.isTrending());
        course.setActive(details.isActive());

        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));
        courseRepository.delete(course);
    }

    // --- CATEGORIES ---
    @Transactional
    public Category createCategory(Category category) {
        if (category.getSlug() == null || category.getSlug().isBlank()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category details) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        category.setName(details.getName());
        category.setIconName(details.getIconName());
        category.setType(details.getType());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // --- INSTRUCTORS ---
    @Transactional
    public Instructor createInstructor(Instructor instructor) {
        return instructorRepository.save(instructor);
    }

    @Transactional
    public Instructor updateInstructor(Long id, Instructor details) {
        Instructor inst = instructorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found: " + id));
        inst.setName(details.getName());
        inst.setBio(details.getBio());
        inst.setDesignation(details.getDesignation());
        inst.setProfilePictureUrl(details.getProfilePictureUrl());
        inst.setLinkedinUrl(details.getLinkedinUrl());
        inst.setYearsOfExperience(details.getYearsOfExperience());
        return instructorRepository.save(inst);
    }

    @Transactional
    public void deleteInstructor(Long id) {
        instructorRepository.deleteById(id);
    }

    // --- LESSONS ---
    @Transactional
    public CourseLesson addLesson(Long courseId, CourseLesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
        lesson.setCourse(course);
        CourseLesson saved = courseLessonRepository.save(lesson);

        // Update total lessons on course
        course.setTotalLessons(courseLessonRepository.findByCourseIdOrderByDisplayOrderAsc(courseId).size());
        courseRepository.save(course);
        return saved;
    }

    @Transactional
    public CourseLesson updateLesson(Long lessonId, CourseLesson details) {
        CourseLesson lesson = courseLessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));
        lesson.setTitle(details.getTitle());
        lesson.setDescription(details.getDescription());
        lesson.setVideoUrl(details.getVideoUrl());
        if (details.getYoutubeVideoId() != null) {
            lesson.setYoutubeVideoId(details.getYoutubeVideoId());
        }
        lesson.setDuration(details.getDuration());
        lesson.setPreview(details.isPreview());
        lesson.setSectionName(details.getSectionName());
        lesson.setDisplayOrder(details.getDisplayOrder());
        return courseLessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        CourseLesson lesson = courseLessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));
        Course course = lesson.getCourse();
        courseLessonRepository.delete(lesson);
        course.setTotalLessons(courseLessonRepository.findByCourseIdOrderByDisplayOrderAsc(course.getId()).size());
        courseRepository.save(course);
    }

    // --- USERS ---
    @Transactional(readOnly = true)
    public Page<User> getUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }

    // --- ORDERS & PAYMENTS ---
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrders(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(orderService::toResponse);
    }

    @Transactional(readOnly = true)
    public List<Payment> getPayments() {
        return paymentRepository.findAll();
    }
}
