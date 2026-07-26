package com.gosafe.backend.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Public response DTO returning navigation routes and threat evaluations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SafeRouteResponseDto {
    private List<LocationDto> path;
    private Double averageSafetyScore;
    private String threatLevel;
    private Double totalDistanceMeters;
    private Double estimatedDurationSeconds;
}
