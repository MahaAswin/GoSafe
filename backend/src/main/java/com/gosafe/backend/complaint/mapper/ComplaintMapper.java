package com.gosafe.backend.complaint.mapper;

import com.gosafe.backend.complaint.dto.ComplaintResponseDTO;
import com.gosafe.backend.complaint.entity.Complaint;
import org.springframework.stereotype.Component;

/**
 * Mapper component translating database models into client-facing data objects.
 */
@Component
public class ComplaintMapper {

    /**
     * Maps a Complaint entity to a ComplaintResponseDTO payload.
     *
     * @param complaint Database entity record.
     * @return DTO representation of the model.
     */
    public ComplaintResponseDTO toDTO(Complaint complaint) {
        if (complaint == null) {
            return null;
        }

        return ComplaintResponseDTO.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .address(complaint.getAddress())
                .imageUrl(complaint.getImageUrl())
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}
