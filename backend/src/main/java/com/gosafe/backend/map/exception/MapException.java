package com.gosafe.backend.map.exception;

/**
 * Base exception class representing core business/validation errors for the Map feature module.
 */
public class MapException extends RuntimeException {
    public MapException(String message) {
        super(message);
    }
}
