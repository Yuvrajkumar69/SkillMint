package com.skillmint.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

class JwtAuthenticationEntryPointTest {

    private final JwtAuthenticationEntryPoint entryPoint = new JwtAuthenticationEntryPoint();

    @Test
    @DisplayName("commence should return 401 Unauthorized with JSON error body and WWW-Authenticate header")
    void commence_Returns401() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/cart");
        MockHttpServletResponse response = new MockHttpServletResponse();

        entryPoint.commence(request, response, new BadCredentialsException("Expired token"));

        assertEquals(401, response.getStatus());
        assertEquals("application/json", response.getContentType());
        assertEquals("Bearer error=\"invalid_token\"", response.getHeader("WWW-Authenticate"));
        assertTrue(response.getContentAsString().contains("Unauthorized: Authentication token is missing, invalid or expired"));
    }
}
