package com.gosafe.backend.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Public response DTO for reverse geocoding requests mapping coordinates to mock addresses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeocodeResponseDto {
    private Double latitude;
    private Double longitude;
    private String address;
    private String city;
    private String country;
}
