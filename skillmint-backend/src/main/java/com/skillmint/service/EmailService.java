package com.skillmint.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:singhpunam5091@gmail.com}")
    private String fromEmail;

    @Value("${app.name:SkillMint}")
    private String appName;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to " + appName + "! 🎓";
        String body = buildEmailHtml(name,
                "Welcome to SkillMint!",
                "You've successfully verified your SkillMint account. Start exploring our top tech and management courses today.",
                "Explore Courses",
                frontendUrl + "/courses",
                "Your learning journey starts now. Learn. Build. Grow."
        );
        sendHtmlEmail(toEmail, subject, body);
    }

    public void sendPaymentConfirmationEmail(String toEmail, String name, List<String> courseNames, BigDecimal amount, String orderNumber) {
        String coursesHtml = String.join("<br>", courseNames.stream()
                .map(c -> "✅ " + c).toList());

        String subject = "🎉 Enrollment Confirmed - Order #" + orderNumber;
        String body = """
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"></head>
                <body style="font-family: 'Inter', Arial, sans-serif; background-color: #0A0F1E; color: #e2e8f0; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
                    <div style="background: linear-gradient(135deg, #5C6AC4, #00D4AA); padding: 30px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 28px;">SkillMint</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0 0; font-weight: 500;">Learn. Build. Grow.</p>
                    </div>
                    <div style="padding: 32px;">
                      <h2 style="color: #00D4AA; margin-top: 0;">Payment Successful! 🎉</h2>
                      <p>Hi <strong>%s</strong>,</p>
                      <p>Your payment of <strong>₹%.2f</strong> was verified successfully. You are now enrolled in:</p>
                      <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #00D4AA;">
                        %s
                      </div>
                      <p style="color: #94a3b8; font-size: 14px;">Order Number: <strong>%s</strong></p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="%s/my-courses" style="background: linear-gradient(135deg, #5C6AC4, #00D4AA); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                          Go to My Courses →
                        </a>
                      </div>
                      <p style="color: #64748b; font-size: 13px;">If you have any questions, feel free to contact SkillMint Support.</p>
                    </div>
                    <div style="background: #0A0F1E; padding: 20px; text-align: center; color: #475569; font-size: 12px;">
                      © 2024 SkillMint. Learn. Build. Grow. All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(name, amount, coursesHtml, orderNumber, frontendUrl);

        sendHtmlEmail(toEmail, subject, body);
    }

    public void sendPasswordResetEmail(String toEmail, String name, String resetLink) {
        String subject = "Reset Your SkillMint Password";
        String body = buildEmailHtml(name,
                "Password Reset Request",
                "We received a request to reset your password. Click the button below to set a new password. This link expires in 30 minutes.",
                "Reset Password",
                resetLink,
                "If you didn't request this password reset, please ignore this email or contact support."
        );
        sendHtmlEmail(toEmail, subject, body);
    }

    public void sendVerificationEmail(String toEmail, String name, String verificationLink) {
        String subject = "Verify Your SkillMint Email Address";
        String body = buildEmailHtml(name,
                "Verify Your Email",
                "Thank you for joining SkillMint! Please verify your email address by clicking the link below to activate your account.",
                "Verify Email",
                verificationLink,
                "If you did not create a SkillMint account, please ignore this email."
        );
        sendHtmlEmail(toEmail, subject, body);
    }

    public void sendPasswordChangedEmail(String toEmail, String name) {
        String subject = "Your SkillMint Password Has Been Changed";
        String body = buildEmailHtml(name,
                "Password Changed",
                "Your SkillMint account password was successfully updated. If you did not perform this change, please reset your password immediately.",
                "Go to Profile",
                frontendUrl + "/profile",
                "Security notification from SkillMint. Learn. Build. Grow."
        );
        sendHtmlEmail(toEmail, subject, body);
    }

    private String buildEmailHtml(String name, String heading, String body, String btnText, String btnLink, String footer) {
        return """
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"></head>
                <body style="font-family: 'Inter', Arial, sans-serif; background-color: #0A0F1E; color: #e2e8f0; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
                    <div style="background: linear-gradient(135deg, #5C6AC4, #00D4AA); padding: 30px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 28px;">SkillMint</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0 0; font-weight: 500;">Learn. Build. Grow.</p>
                    </div>
                    <div style="padding: 32px;">
                      <h2 style="color: #00D4AA; margin-top: 0;">%s</h2>
                      <p>Hi <strong>%s</strong>,</p>
                      <p>%s</p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background: linear-gradient(135deg, #5C6AC4, #00D4AA); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                          %s →
                        </a>
                      </div>
                      <p style="color: #64748b; font-size: 13px;">%s</p>
                    </div>
                    <div style="background: #0A0F1E; padding: 20px; text-align: center; color: #475569; font-size: 12px;">
                      © 2024 SkillMint. Learn. Build. Grow. All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(heading, name, body, btnLink, btnText, footer);
    }

    private void sendHtmlEmail(String toEmail, String subject, String body) {
        try {
            if (fromEmail == null || fromEmail.isBlank() || fromEmail.contains("smtp-brevo.com") || fromEmail.equals("noreply@skillmint.com")) {
                fromEmail = "singhpunam5091@gmail.com";
            }
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "SkillMint");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            log.info("Email sent to {}: {}", toEmail, subject);
        } catch (Throwable e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            // Logged without crashing caller to enforce transactional isolation
        }
    }
}
