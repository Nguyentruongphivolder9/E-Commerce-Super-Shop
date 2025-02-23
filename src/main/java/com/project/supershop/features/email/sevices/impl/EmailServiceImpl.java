package com.project.supershop.features.email.sevices.impl;

import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.email.sevices.EmailService;
import com.project.supershop.features.email.utils.EmailUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@Transactional
public class EmailServiceImpl implements EmailService {
    public static final String NEW_USER_ACCOUNT_VERIFICATION = "New User Account Verification";
    public static final String UTF_8_ENCODING = StandardCharsets.UTF_8.name();
    public static final String EMAIL_TEMPLATE = "emailTemplate";
    @Value("${spring.pulsar.client.service-url}")
    private String serverUrl;

    @Value("${spring.mail.verify}")
    private String verifyUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    public EmailServiceImpl(JavaMailSender javaMailSender, SpringTemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    @Async
    public void sendSimpleMailMessage(String name, String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setSubject(NEW_USER_ACCOUNT_VERIFICATION);
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setText(EmailUtils.getEmailMessage(name, serverUrl, token));
            javaMailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error sending email: " + e.getMessage(), e);
        }
    }

    @Override
    @Async
    public void sendMimeMesageWithAttchments(String name, String to, String token) {
        sendMimeMessage(name, to, token, "src/main/java/com/project/supershop/access/images/images.jpg", false);
    }

    @Override
    @Async
    public void sendMimeMessageWithEmbededFiles(String name, String to, String token) {
        sendMimeMessage(name, to, token, "src/main/java/com/project/supershop/access/images/images.jpg", true);
    }

    @Override
    @Async
    public void sendHtmlEmail(String name, String to, String token) {
        try {
            Context context = new Context();
            context.setVariables(Map.of("name", name, "url", EmailUtils.getVerifycationUrl(verifyUrl, token)));

            String text = templateEngine.process(EMAIL_TEMPLATE, context);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);

            helper.setPriority(1);
            helper.setSubject(NEW_USER_ACCOUNT_VERIFICATION);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setText(text, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending HTML email: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error sending HTML email", e);
        }
    }

    @Override
    @Async
    public void sendHtmlEmailWithEmbededFiles(String name, String to, String token) {
        // Implementation needed
    }

    @Override
    public void sendEmailForLoginPermission(String name, String to, String token, Device device) {

    }

    @Override
    @Async
    public void sendMimeMessageWithEmbededImages(String name, String to, String token) {
        // Implementation needed
    }

    private void sendMimeMessage(String name, String to, String token, String imagePath, boolean isInline) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);

            helper.setPriority(1);
            helper.setSubject(NEW_USER_ACCOUNT_VERIFICATION);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setText(EmailUtils.getEmailMessage(name, serverUrl, token), true);

            FileSystemResource fileResource = new FileSystemResource(new File(imagePath));

            if (isInline) {
                helper.addInline(getContentId(fileResource.getFilename()), fileResource);
            } else {
                helper.addAttachment(fileResource.getFilename(), fileResource);
            }

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending email: " + e.getMessage(), e);
        }
    }

    private String getContentId(String fileName) {
        return "<" + fileName + ">";
    }
}
