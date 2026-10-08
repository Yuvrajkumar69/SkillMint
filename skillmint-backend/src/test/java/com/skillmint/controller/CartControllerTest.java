package com.skillmint.controller;

import com.skillmint.entity.User;
import com.skillmint.service.CartService;
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
class CartControllerTest {

    @Mock
    private CartService cartService;

    @InjectMocks
    private CartController cartController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("user@example.com").build();
    }

    @Test
    @DisplayName("addToCart should parse Integer courseId from body without ClassCastException")
    void addToCart_IntegerCourseId() {
        Map<String, Object> body = new HashMap<>();
        body.put("courseId", Integer.valueOf(10));

        ResponseEntity<?> response = cartController.addToCart(testUser, body);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(cartService, times(1)).addToCart(testUser, 10L);
    }
}
