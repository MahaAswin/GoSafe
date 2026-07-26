package com.gosafe.backend.map.exception;

/**
 * Exception thrown when validation of geographic latitude or longitude checks fail.
 */
public class InvalidCoordinatesException extends MapException {
    public InvalidCoordinatesException(String message) {
        super(message);
    }
}
