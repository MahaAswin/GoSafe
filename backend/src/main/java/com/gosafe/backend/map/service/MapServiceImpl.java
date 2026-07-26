package com.gosafe.backend.map.service;

import com.gosafe.backend.map.dto.GeocodeResponseDto;
import com.gosafe.backend.map.dto.LocationDto;
import com.gosafe.backend.map.dto.MapLocationResponseDto;
import com.gosafe.backend.map.dto.SafeRouteResponseDto;
import com.gosafe.backend.map.exception.InvalidCoordinatesException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service implementation managing map logic using in-memory mock details.
 */
@Service
public class MapServiceImpl implements MapService {

    @Override
    public LocationDto getCurrentLocation() {
        return LocationDto.builder()
                .latitude(28.6139)
                .longitude(77.2090)
                .build();
    }

    @Override
    public List<MapLocationResponseDto> getNearbyHospitals() {
        return List.of(
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("City General Hospital")
                    .type("HOSPITAL")
                    .latitude(28.6120)
                    .longitude(77.2080)
                    .address("Central Medical Ave, Sector 4")
                    .build(),
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("Metro Emergency Clinic")
                    .type("HOSPITAL")
                    .latitude(28.6250)
                    .longitude(77.2150)
                    .address("45 Emergency St, Ring Road")
                    .build()
        );
    }

    @Override
    public List<MapLocationResponseDto> getNearbyPolice() {
        return List.of(
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("District HQ Police Station")
                    .type("POLICE")
                    .latitude(28.6150)
                    .longitude(77.2090)
                    .address("Admin Chowk, Sector 1")
                    .build(),
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("Metro Patrol Hub")
                    .type("POLICE")
                    .latitude(28.6310)
                    .longitude(77.2210)
                    .address("North Gate Expressway Junction")
                    .build()
        );
    }

    @Override
    public List<MapLocationResponseDto> getNearbyFireStations() {
        return List.of(
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("Central Fire Station")
                    .type("FIRESTATION")
                    .latitude(28.6180)
                    .longitude(77.2110)
                    .address("Station Rd, Sector 3")
                    .build(),
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("Industrial Area Fire Station")
                    .type("FIRESTATION")
                    .latitude(28.6400)
                    .longitude(77.2300)
                    .address("Factory Lane, Block C")
                    .build()
        );
    }

    @Override
    public List<MapLocationResponseDto> getNearbyShelters() {
        return List.of(
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("Community Shelter Center")
                    .type("SHELTER")
                    .latitude(28.6100)
                    .longitude(77.2050)
                    .address("Harmony Plaza, Sector 9")
                    .build(),
            MapLocationResponseDto.builder()
                    .id(UUID.randomUUID())
                    .name("Red Cross Relief Shelter")
                    .type("SHELTER")
                    .latitude(28.6280)
                    .longitude(77.2190)
                    .address("12 Relief Lane, Outer Ring")
                    .build()
        );
    }

    @Override
    public GeocodeResponseDto reverseGeocode(Double latitude, Double longitude) {
        validateCoordinates(latitude, longitude);

        return GeocodeResponseDto.builder()
                .latitude(latitude)
                .longitude(longitude)
                .address(String.format("Mock Address near (Lat: %.4f, Lng: %.4f)", latitude, longitude))
                .city("New Delhi")
                .country("India")
                .build();
    }

    @Override
    public SafeRouteResponseDto getSafeRoute(
            Double sourceLatitude,
            Double sourceLongitude,
            Double destinationLatitude,
            Double destinationLongitude) {
        validateCoordinates(sourceLatitude, sourceLongitude);
        validateCoordinates(destinationLatitude, destinationLongitude);

        List<LocationDto> pathPoints = new ArrayList<>();
        pathPoints.add(new LocationDto(sourceLatitude, sourceLongitude));
        
        // Midpoint calculations to create realistic mock path nodes
        double midLat = (sourceLatitude + destinationLatitude) / 2.0;
        double midLng = (sourceLongitude + destinationLongitude) / 2.0;
        pathPoints.add(new LocationDto(midLat + 0.002, midLng - 0.001));
        pathPoints.add(new LocationDto(midLat - 0.001, midLng + 0.002));
        
        pathPoints.add(new LocationDto(destinationLatitude, destinationLongitude));

        return SafeRouteResponseDto.builder()
                .path(pathPoints)
                .averageSafetyScore(0.895)
                .threatLevel("LOW")
                .totalDistanceMeters(1820.5)
                .estimatedDurationSeconds(240.0)
                .build();
    }

    /**
     * Helper method to validate coordinate boundaries.
     *
     * @param lat Latitude check.
     * @param lng Longitude check.
     */
    private void validateCoordinates(Double lat, Double lng) {
        if (lat == null || lat < -90.0 || lat > 90.0) {
            throw new InvalidCoordinatesException("Latitude must range between -90.0 and 90.0 degrees.");
        }
        if (lng == null || lng < -180.0 || lng > 180.0) {
            throw new InvalidCoordinatesException("Longitude must range between -180.0 and 180.0 degrees.");
        }
    }
}
