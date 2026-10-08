package com.skillmint.controller;

import com.skillmint.entity.User;
import com.skillmint.service.WishlistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistControllerTest {

    @Mock
    private WishlistService wishlistService;

    @InjectMocks
    private WishlistController wishlistController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("user@example.com").build();
    }

    @Test
    @DisplayName("toggle should parse Integer courseId from body without ClassCastException")
    void toggle_IntegerCourseId() {
        Map<String, Object> body = new HashMap<>();
        body.put("courseId", Integer.valueOf(10));
        when(wishlistService.toggleWishlist(testUser, 10L)).thenReturn(true);

        ResponseEntity<?> response = wishlistController.toggle(testUser, body);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(wishlistService, times(1)).toggleWishlist(testUser, 10L);
    }
}
