package com.gosafe.backend.map.exception;

/**
 * Exception thrown when a specific map location or service registry item cannot be located.
 */
public class LocationNotFoundException extends MapException {
    public LocationNotFoundException(String message) {
        super(message);
    }
}
