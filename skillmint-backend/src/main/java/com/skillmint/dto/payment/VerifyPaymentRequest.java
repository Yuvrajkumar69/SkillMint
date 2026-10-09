package com.skillmint.dto.payment;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyPaymentRequest {
    @NotBlank(message = "Razorpay order ID is required")
    @JsonAlias({"razorpay_order_id", "razorpayOrderId", "orderId", "order_id"})
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay payment ID is required")
    @JsonAlias({"razorpay_payment_id", "razorpayPaymentId", "paymentId", "payment_id"})
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay signature is required")
    @JsonAlias({"razorpay_signature", "razorpaySignature", "signature"})
    private String razorpaySignature;

    @NotBlank(message = "Internal order number is required")
    @JsonAlias({"order_number", "orderNumber"})
    private String orderNumber;
}
