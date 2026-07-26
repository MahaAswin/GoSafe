package com.gosafe.backend.shared.exception;

/**
 * Exception representing general system-level or unclassified errors.
 */
public class GenericException extends RuntimeException {
    public GenericException(String message) {
        super(message);
    }

    public GenericException(String message, Throwable cause) {
        super(message, cause);
    }
}
