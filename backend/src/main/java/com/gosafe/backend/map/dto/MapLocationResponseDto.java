package com.gosafe.backend.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Public response DTO returning points of interest such as hospitals, police stations, shelters etc.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapLocationResponseDto {
    private UUID id;
    private String name;
    private String type;
    private Double latitude;
    private Double longitude;
    private String address;
}
