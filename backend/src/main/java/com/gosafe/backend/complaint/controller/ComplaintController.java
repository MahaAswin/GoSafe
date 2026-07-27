package com.gosafe.backend.complaint.controller;

import com.gosafe.backend.complaint.dto.ComplaintRequestDTO;
import com.gosafe.backend.complaint.dto.ComplaintResponseDTO;
import com.gosafe.backend.complaint.service.ComplaintService;
import com.gosafe.backend.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Controller class managing HTTP request mapping routes for Complaint APIs.
 */
@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    /**
     * Creates a new citizen complaint.
     *
     * @param request Validated request payload.
     * @return Response envelope with created complaint.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> createComplaint(
            @Valid @RequestBody ComplaintRequestDTO request) {
        ComplaintResponseDTO complaint = complaintService.createComplaint(request);
        ApiResponse<ComplaintResponseDTO> response = ApiResponse.<ComplaintResponseDTO>builder()
                .success(true)
                .statusCode(HttpStatus.CREATED.value())
                .message("Complaint logged successfully.")
                .data(complaint)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Gets all registered complaints in the system.
     *
     * @return Response envelope with all complaints.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintResponseDTO>>> getAllComplaints() {
        List<ComplaintResponseDTO> complaints = complaintService.getAllComplaints();
        ApiResponse<List<ComplaintResponseDTO>> response = ApiResponse.<List<ComplaintResponseDTO>>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Complaints list retrieved successfully.")
                .data(complaints)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Gets a specific complaint detail.
     *
     * @param id Unique ID of the complaint.
     * @return Response envelope with complaint details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> getComplaintById(
            @PathVariable UUID id) {
        ComplaintResponseDTO complaint = complaintService.getComplaintById(id);
        ApiResponse<ComplaintResponseDTO> response = ApiResponse.<ComplaintResponseDTO>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Complaint details retrieved successfully.")
                .data(complaint)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Updates an existing complaint.
     *
     * @param id Unique ID of the complaint.
     * @param request Validated request payload.
     * @return Response envelope with updated details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> updateComplaint(
            @PathVariable UUID id,
            @Valid @RequestBody ComplaintRequestDTO request) {
        ComplaintResponseDTO complaint = complaintService.updateComplaint(id, request);
        ApiResponse<ComplaintResponseDTO> response = ApiResponse.<ComplaintResponseDTO>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Complaint updated successfully.")
                .data(complaint)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a specific complaint.
     *
     * @param id Unique ID of the complaint.
     * @return Response envelope with cancellation details.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(
            @PathVariable UUID id) {
        complaintService.deleteComplaint(id);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Complaint deleted successfully.")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
