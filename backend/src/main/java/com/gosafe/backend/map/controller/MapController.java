package com.gosafe.backend.map.controller;

import com.gosafe.backend.map.dto.GeocodeResponseDto;
import com.gosafe.backend.map.dto.LocationDto;
import com.gosafe.backend.map.dto.MapLocationResponseDto;
import com.gosafe.backend.map.dto.SafeRouteResponseDto;
import com.gosafe.backend.map.service.MapService;
import com.gosafe.backend.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller class managing HTTP request mapping routes for Map APIs.
 */
@RestController
@RequestMapping("/api/v1/map")
@RequiredArgsConstructor
@Validated
public class MapController {

    private final MapService mapService;

    /**
     * Gets the mock current location coordinate points.
     *
     * @return Response envelope with coordinates.
     */
    @GetMapping("/current-location")
    public ResponseEntity<ApiResponse<LocationDto>> getCurrentLocation() {
        LocationDto location = mapService.getCurrentLocation();
        ApiResponse<LocationDto> response = ApiResponse.<LocationDto>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Mock current location retrieved successfully.")
                .data(location)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Returns a list of nearby hospitals.
     *
     * @return Response envelope with hospitals.
     */
    @GetMapping("/nearby/hospitals")
    public ResponseEntity<ApiResponse<List<MapLocationResponseDto>>> getNearbyHospitals() {
        List<MapLocationResponseDto> hospitals = mapService.getNearbyHospitals();
        ApiResponse<List<MapLocationResponseDto>> response = ApiResponse.<List<MapLocationResponseDto>>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Nearby hospitals retrieved successfully.")
                .data(hospitals)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Returns a list of nearby police stations.
     *
     * @return Response envelope with police stations.
     */
    @GetMapping("/nearby/police")
    public ResponseEntity<ApiResponse<List<MapLocationResponseDto>>> getNearbyPolice() {
        List<MapLocationResponseDto> police = mapService.getNearbyPolice();
        ApiResponse<List<MapLocationResponseDto>> response = ApiResponse.<List<MapLocationResponseDto>>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Nearby police stations retrieved successfully.")
                .data(police)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Returns a list of nearby fire stations.
     *
     * @return Response envelope with fire stations.
     */
    @GetMapping("/nearby/fire-stations")
    public ResponseEntity<ApiResponse<List<MapLocationResponseDto>>> getNearbyFireStations() {
        List<MapLocationResponseDto> fireStations = mapService.getNearbyFireStations();
        ApiResponse<List<MapLocationResponseDto>> response = ApiResponse.<List<MapLocationResponseDto>>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Nearby fire stations retrieved successfully.")
                .data(fireStations)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Returns a list of nearby emergency shelters.
     *
     * @return Response envelope with shelters.
     */
    @GetMapping("/nearby/shelters")
    public ResponseEntity<ApiResponse<List<MapLocationResponseDto>>> getNearbyShelters() {
        List<MapLocationResponseDto> shelters = mapService.getNearbyShelters();
        ApiResponse<List<MapLocationResponseDto>> response = ApiResponse.<List<MapLocationResponseDto>>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Nearby emergency shelters retrieved successfully.")
                .data(shelters)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Converts a coordinate pair to a mock textual address.
     *
     * @param latitude Coordinate latitude.
     * @param longitude Coordinate longitude.
     * @return Response envelope with address info.
     */
    @GetMapping("/reverse-geocode")
    public ResponseEntity<ApiResponse<GeocodeResponseDto>> reverseGeocode(
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        GeocodeResponseDto geocode = mapService.reverseGeocode(latitude, longitude);
        ApiResponse<GeocodeResponseDto> response = ApiResponse.<GeocodeResponseDto>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Reverse geocoding complete.")
                .data(geocode)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Evaluates navigation paths between source and destination coordinates.
     *
     * @param sourceLatitude Origin latitude.
     * @param sourceLongitude Origin longitude.
     * @param destinationLatitude Destination latitude.
     * @param destinationLongitude Destination longitude.
     * @return Response envelope with routing path.
     */
    @GetMapping("/safe-route")
    public ResponseEntity<ApiResponse<SafeRouteResponseDto>> getSafeRoute(
            @RequestParam Double sourceLatitude,
            @RequestParam Double sourceLongitude,
            @RequestParam Double destinationLatitude,
            @RequestParam Double destinationLongitude) {
        SafeRouteResponseDto route = mapService.getSafeRoute(
                sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude);
        ApiResponse<SafeRouteResponseDto> response = ApiResponse.<SafeRouteResponseDto>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Safest navigation path calculated successfully.")
                .data(route)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
