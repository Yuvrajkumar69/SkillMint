package com.skillmint.service;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "fromEmail", "singhpunam5091@gmail.com");
        ReflectionTestUtils.setField(emailService, "appName", "SkillMint");
        ReflectionTestUtils.setField(emailService, "frontendUrl", "http://localhost:5173");
    }

    @Test
    @DisplayName("sendWelcomeEmail should prepare and send MimeMessage")
    void sendWelcomeEmail_Success() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        assertDoesNotThrow(() -> emailService.sendWelcomeEmail("user@example.com", "Jane Doe"));

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("sendPaymentConfirmationEmail should prepare and send confirmation email")
    void sendPaymentConfirmationEmail_Success() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        assertDoesNotThrow(() -> emailService.sendPaymentConfirmationEmail(
                "user@example.com", "Jane Doe",
                List.of("Full Stack Java", "React Mastery"),
                new BigDecimal("1499.00"), "SM-9999"
        ));

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("sendHtmlEmail failure should be caught gracefully without crashing caller")
    void sendHtmlEmail_HandlesFailureGracefully() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new RuntimeException("SMTP connection refused")).when(mailSender).send(any(MimeMessage.class));

        // Must not throw exception to protect payment transaction isolation
        assertDoesNotThrow(() -> emailService.sendWelcomeEmail("user@example.com", "Jane Doe"));
    }
}
