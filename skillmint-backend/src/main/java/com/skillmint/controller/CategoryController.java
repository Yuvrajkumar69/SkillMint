package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Categories fetched", categoryService.getAllCategories()));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse> getByType(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success("Categories by type fetched", categoryService.getCategoriesByType(type)));
    }
}
