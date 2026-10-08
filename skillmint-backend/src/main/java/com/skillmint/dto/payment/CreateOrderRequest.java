package com.skillmint.dto.payment;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotNull(message = "Course IDs are required")
    @NotEmpty(message = "Course IDs cannot be empty")
    private List<Long> courseIds;
}
