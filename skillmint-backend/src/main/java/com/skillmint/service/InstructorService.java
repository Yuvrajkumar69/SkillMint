package com.skillmint.service;

import com.skillmint.dto.course.InstructorDTO;
import com.skillmint.entity.Instructor;
import com.skillmint.exception.ResourceNotFoundException;
import com.skillmint.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorService {

    private final InstructorRepository instructorRepository;

    @Transactional(readOnly = true)
    public List<InstructorDTO> getAllInstructors() {
        return instructorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InstructorDTO getInstructorById(Long id) {
        Instructor inst = instructorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + id));
        return mapToDTO(inst);
    }

    private InstructorDTO mapToDTO(Instructor inst) {
        return InstructorDTO.builder()
                .id(inst.getId())
                .name(inst.getName())
                .bio(inst.getBio())
                .designation(inst.getDesignation())
                .profilePictureUrl(inst.getProfilePictureUrl())
                .linkedinUrl(inst.getLinkedinUrl())
                .yearsOfExperience(inst.getYearsOfExperience())
                .rating(inst.getRating())
                .totalStudents(inst.getTotalStudents())
                .totalCourses(inst.getTotalCourses())
                .build();
    }
}
