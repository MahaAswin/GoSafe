package com.gosafe.backend.map.service;

import com.gosafe.backend.map.dto.GeocodeResponseDto;
import com.gosafe.backend.map.dto.LocationDto;
import com.gosafe.backend.map.dto.MapLocationResponseDto;
import com.gosafe.backend.map.dto.SafeRouteResponseDto;
import java.util.List;

/**
 * Service interface specifying map operations.
 */
public interface MapService {

    /**
     * Gets a mock current location coordinate.
     *
     * @return Current location coordinate.
     */
    LocationDto getCurrentLocation();

    /**
     * Returns a list of nearby hospitals.
     *
     * @return List of nearby hospitals.
     */
    List<MapLocationResponseDto> getNearbyHospitals();

    /**
     * Returns a list of nearby police stations.
     *
     * @return List of nearby police stations.
     */
    List<MapLocationResponseDto> getNearbyPolice();

    /**
     * Returns a list of nearby fire stations.
     *
     * @return List of nearby fire stations.
     */
    List<MapLocationResponseDto> getNearbyFireStations();

    /**
     * Returns a list of nearby emergency shelters.
     *
     * @return List of nearby emergency shelters.
     */
    List<MapLocationResponseDto> getNearbyShelters();

    /**
     * Decodes coordinates into a mock address (reverse geocoding).
     *
     * @param latitude Target latitude.
     * @param longitude Target longitude.
     * @return Reverse geocoded address.
     */
    GeocodeResponseDto reverseGeocode(Double latitude, Double longitude);

    /**
     * Calculates a mock safe route consisting of multiple coordinates.
     *
     * @param sourceLatitude Origin latitude.
     * @param sourceLongitude Origin longitude.
     * @param destinationLatitude Destination latitude.
     * @param destinationLongitude Destination longitude.
     * @return Calculated safe path with metrics.
     */
    SafeRouteResponseDto getSafeRoute(
            Double sourceLatitude,
            Double sourceLongitude,
            Double destinationLatitude,
            Double destinationLongitude);
}
