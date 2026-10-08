package com.skillmint.service;

import com.skillmint.dto.course.CourseCardDTO;
import com.skillmint.entity.CartItem;
import com.skillmint.entity.Course;
import com.skillmint.entity.User;
import com.skillmint.exception.BadRequestException;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.CartRepository;
import com.skillmint.repository.CourseRepository;
import com.skillmint.repository.EnrollmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Course testCourse;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("user@example.com").fullName("Test User").build();
        testCourse = Course.builder().id(10L).title("Test Course").slug("test-course").build();
    }

    @Test
    @DisplayName("getCart should return CourseCardDTO list for valid user")
    void getCart_Success() {
        CartItem item = CartItem.builder().id(100L).user(testUser).course(testCourse).build();
        CourseCardDTO dto = CourseCardDTO.builder().id(10L).title("Test Course").build();

        when(cartRepository.findByUserIdWithCourseDetails(1L)).thenReturn(List.of(item));
        when(courseService.toCardDTO(testCourse)).thenReturn(dto);

        List<CourseCardDTO> result = cartService.getCart(testUser);

        assertEquals(1, result.size());
        assertEquals("Test Course", result.get(0).getTitle());
        verify(cartRepository, times(1)).findByUserIdWithCourseDetails(1L);
    }

    @Test
    @DisplayName("getCart should return empty list when user is null")
    void getCart_NullUser() {
        List<CourseCardDTO> result = cartService.getCart(null);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("addToCart should throw BadRequestException when user already has course in cart")
    void addToCart_AlreadyInCart() {
        when(courseRepository.findById(10L)).thenReturn(Optional.of(testCourse));
        when(cartRepository.existsByUserIdAndCourseId(1L, 10L)).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                cartService.addToCart(testUser, 10L)
        );

        assertEquals("Course is already in your cart", ex.getMessage());
    }

    @Test
    @DisplayName("addToCart should throw ResourceNotFoundException when course does not exist")
    void addToCart_CourseNotFound() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                cartService.addToCart(testUser, 99L)
        );
    }

    @Test
    @DisplayName("addToCart should successfully save CartItem when not duplicate and not enrolled")
    void addToCart_Success() {
        when(courseRepository.findById(10L)).thenReturn(Optional.of(testCourse));
        when(cartRepository.existsByUserIdAndCourseId(1L, 10L)).thenReturn(false);
        when(enrollmentRepository.existsByUserAndCourseId(testUser, 10L)).thenReturn(false);

        cartService.addToCart(testUser, 10L);

        verify(cartRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    @DisplayName("removeFromCart should delete item by userId and courseId")
    void removeFromCart_Success() {
        cartService.removeFromCart(testUser, 10L);
        verify(cartRepository, times(1)).deleteByUserIdAndCourseId(1L, 10L);
    }
}
