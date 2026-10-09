package com.skillmint.service;

import com.skillmint.dto.auth.ForgotPasswordRequest;
import com.skillmint.dto.auth.ResetPasswordRequest;
import com.skillmint.entity.PasswordResetToken;
import com.skillmint.entity.User;
import com.skillmint.exception.BadRequestException;
import com.skillmint.repository.PasswordResetTokenRepository;
import com.skillmint.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    @Value("${app.password-reset.token-expiry-minutes:30}")
    private int tokenExpiryMinutes;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public void initiatePasswordReset(ForgotPasswordRequest request) {
        // Always respond the same way to prevent email enumeration
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().toLowerCase().trim());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Delete old token for this user and flush to DB before inserting new token
            tokenRepository.deleteByUser(user);
            tokenRepository.flush();

            // Generate new token
            String tokenValue = UUID.randomUUID().toString();
            PasswordResetToken token = PasswordResetToken.builder()
                    .token(tokenValue)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusMinutes(tokenExpiryMinutes))
                    .used(false)
                    .build();
            tokenRepository.save(token);

            String resetLink = frontendUrl + "/reset-password?token=" + tokenValue;
            log.info("Password reset initiated for user: {}. Reset link: {}", user.getEmail(), resetLink);

            try {
                emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetLink);
            } catch (Throwable e) {
                log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
            }
        }
        // Always return success message to prevent email enumeration
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token."));

        if (token.isUsed()) {
            throw new BadRequestException("This reset link has already been used.");
        }

        if (token.isExpired()) {
            throw new BadRequestException("This reset link has expired. Please request a new one.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        // Send notification email
        try {
            emailService.sendPasswordChangedEmail(user.getEmail(), user.getFullName());
        } catch (Throwable e) {
            log.warn("Failed to send password changed notification email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}
