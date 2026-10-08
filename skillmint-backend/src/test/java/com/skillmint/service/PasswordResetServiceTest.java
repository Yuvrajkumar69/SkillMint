package com.skillmint.service;

import com.skillmint.dto.auth.ForgotPasswordRequest;
import com.skillmint.dto.auth.ResetPasswordRequest;
import com.skillmint.entity.PasswordResetToken;
import com.skillmint.entity.User;
import com.skillmint.exception.BadRequestException;
import com.skillmint.repository.PasswordResetTokenRepository;
import com.skillmint.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PasswordResetService passwordResetService;

    private User testUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(passwordResetService, "tokenExpiryMinutes", 30);
        ReflectionTestUtils.setField(passwordResetService, "frontendUrl", "http://localhost:5173");

        testUser = User.builder()
                .id(1L)
                .email("user@example.com")
                .fullName("Test User")
                .password("oldHashedPassword")
                .build();
    }

    @Test
    @DisplayName("initiatePasswordReset should create token and send email for valid user")
    void initiatePasswordReset_Success() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("user@example.com");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));

        passwordResetService.initiatePasswordReset(request);

        verify(tokenRepository, times(1)).deleteByUser(testUser);
        verify(tokenRepository, times(1)).flush();
        verify(tokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(eq("user@example.com"), eq("Test User"), anyString());
    }

    @Test
    @DisplayName("initiatePasswordReset should silently succeed for non-existent email")
    void initiatePasswordReset_NonExistentEmail() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("nonexistent@example.com");

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> passwordResetService.initiatePasswordReset(request));
        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(any(), any(), any());
    }

    @Test
    @DisplayName("resetPassword should update password and mark token used on success")
    void resetPassword_Success() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-token-123");
        request.setNewPassword("NewPassword@123");
        request.setConfirmPassword("NewPassword@123");

        PasswordResetToken token = PasswordResetToken.builder()
                .id(10L)
                .token("valid-token-123")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(20))
                .used(false)
                .build();

        when(tokenRepository.findByToken("valid-token-123")).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("NewPassword@123")).thenReturn("newHashedPassword");

        passwordResetService.resetPassword(request);

        assertEquals("newHashedPassword", testUser.getPassword());
        assertTrue(token.isUsed());
        verify(userRepository, times(1)).save(testUser);
        verify(tokenRepository, times(1)).save(token);
        verify(emailService, times(1)).sendPasswordChangedEmail(eq("user@example.com"), eq("Test User"));
    }

    @Test
    @DisplayName("resetPassword should throw BadRequestException if passwords do not match")
    void resetPassword_MismatchPasswords() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-token-123");
        request.setNewPassword("NewPassword@123");
        request.setConfirmPassword("DifferentPassword@123");

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                passwordResetService.resetPassword(request)
        );
        assertEquals("Passwords do not match.", ex.getMessage());
    }

    @Test
    @DisplayName("resetPassword should throw BadRequestException if token already used")
    void resetPassword_AlreadyUsedToken() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("used-token-123");
        request.setNewPassword("NewPassword@123");
        request.setConfirmPassword("NewPassword@123");

        PasswordResetToken token = PasswordResetToken.builder()
                .token("used-token-123")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(20))
                .used(true)
                .build();

        when(tokenRepository.findByToken("used-token-123")).thenReturn(Optional.of(token));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                passwordResetService.resetPassword(request)
        );
        assertEquals("This reset link has already been used.", ex.getMessage());
    }

    @Test
    @DisplayName("resetPassword should throw BadRequestException if token expired")
    void resetPassword_ExpiredToken() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("expired-token-123");
        request.setNewPassword("NewPassword@123");
        request.setConfirmPassword("NewPassword@123");

        PasswordResetToken token = PasswordResetToken.builder()
                .token("expired-token-123")
                .user(testUser)
                .expiresAt(LocalDateTime.now().minusMinutes(5))
                .used(false)
                .build();

        when(tokenRepository.findByToken("expired-token-123")).thenReturn(Optional.of(token));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                passwordResetService.resetPassword(request)
        );
        assertEquals("This reset link has expired. Please request a new one.", ex.getMessage());
    }
}
