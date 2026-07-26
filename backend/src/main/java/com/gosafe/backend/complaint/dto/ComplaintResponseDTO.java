package com.gosafe.backend.complaint.dto;

import com.gosafe.backend.complaint.enums.ComplaintCategory;
import com.gosafe.backend.complaint.enums.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Public response DTO returning complete complaint profiles.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponseDTO {
    private UUID id;
    private String title;
    private String description;
    private ComplaintCategory category;
    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
