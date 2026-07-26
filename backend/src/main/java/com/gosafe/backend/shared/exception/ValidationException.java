package com.gosafe.backend.shared.exception;

/**
 * Exception thrown when validation fails on business rules or constraints.
 */
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
