package com.sse.impacthub.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendResetToken(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("SSE Impact Hub <" + fromEmail + ">");
        message.setTo(to);
        message.setSubject("Password Reset Request - SSE Impact Hub");
        
        String resetLink = frontendUrl + "/forgot-password?token=" + token;
        
        message.setText("Hello,\n\n"
                + "You requested to reset your password for your SSE Impact Hub account.\n\n"
                + "Please click the following link to reset your password:\n"
                + resetLink + "\n\n"
                + "This link will expire in 24 hours.\n\n"
                + "If you didn't request this, you can safely ignore this email.\n\n"
                + "Best regards,\n"
                + "SSE Impact Hub Team\n"
                + "Social Stock Exchange | Impact Investing Platform");
        
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("SSE Impact Hub <" + fromEmail + ">");
        message.setTo(to);
        message.setSubject("Welcome to SSE Impact Hub!");
        
        message.setText("Hello " + name + ",\n\n"
                + "Welcome to SSE Impact Hub — India's leading Social Stock Exchange platform for impact investing!\n\n"
                + "Here's what you can do:\n"
                + "• Browse verified NGOs and ZCZP bonds\n"
                + "• Invest in social impact with transparent tracking\n"
                + "• Get instant 80G tax certificates for your investments\n"
                + "• Complete KYC with PAN verification\n\n"
                + "Start exploring: " + frontendUrl + "/dashboard\n\n"
                + "Happy Impact Investing!\n"
                + "SSE Impact Hub Team");
        
        mailSender.send(message);
    }

    public void sendInvestmentConfirmation(String to, String investorName, String ngoName, double amount, String txnId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("SSE Impact Hub <" + fromEmail + ">");
        message.setTo(to);
        message.setSubject("Investment Confirmed — " + ngoName + " | SSE Impact Hub");
        
        message.setText("Dear " + investorName + ",\n\n"
                + "Your ZCZP bond investment has been successfully processed!\n\n"
                + "Investment Details:\n"
                + "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                + "NGO: " + ngoName + "\n"
                + "Amount: ₹" + String.format("%,.0f", amount) + "\n"
                + "Transaction ID: " + txnId + "\n"
                + "80G Tax Benefit: ₹" + String.format("%,.0f", amount * 0.3) + " (est. @ 30%)\n"
                + "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                + "You can download your 80G certificate from your Portfolio.\n"
                + "Portfolio: " + frontendUrl + "/portfolio\n\n"
                + "Thank you for making a difference!\n"
                + "SSE Impact Hub Team");
        
        mailSender.send(message);
    }
}
