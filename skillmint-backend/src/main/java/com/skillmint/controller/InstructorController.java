package com.skillmint.controller;

import com.skillmint.dto.common.ApiResponse;
import com.skillmint.dto.course.InstructorDTO;
import com.skillmint.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllInstructors() {
        List<InstructorDTO> instructors = instructorService.getAllInstructors();
        return ResponseEntity.ok(ApiResponse.success("Instructors fetched successfully", instructors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getInstructorById(@PathVariable Long id) {
        InstructorDTO instructor = instructorService.getInstructorById(id);
        return ResponseEntity.ok(ApiResponse.success("Instructor fetched successfully", instructor));
    }
}
