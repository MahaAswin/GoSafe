package com.gosafe.backend.complaint.dto;

import com.gosafe.backend.complaint.enums.ComplaintCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object containing request parameters for creating/updating complaints.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequestDTO {

    @NotBlank(message = "Title is required.")
    private String title;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotNull(message = "Category is required.")
    private ComplaintCategory category;

    @NotNull(message = "Latitude is required.")
    @Min(value = -90, message = "Latitude must be greater than or equal to -90.")
    @Max(value = 90, message = "Latitude must be less than or equal to 90.")
    private Double latitude;

    @NotNull(message = "Longitude is required.")
    @Min(value = -180, message = "Longitude must be greater than or equal to -180.")
    @Max(value = 180, message = "Longitude must be less than or equal to 180.")
    private Double longitude;

    private String address;
    private String imageUrl;
}
