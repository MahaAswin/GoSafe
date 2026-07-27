package com.gosafe.backend.common;

public final class Constants {

    private Constants() {
        // Prevent instantiation
    }

    public static final String API_PREFIX = "/api/v1";
    public static final String AUTH_PREFIX = API_PREFIX + "/auth";
    
    public static final String ROLE_CITIZEN = "ROLE_CITIZEN";
    public static final String ROLE_VOLUNTEER = "ROLE_VOLUNTEER";
    public static final String ROLE_POLICE = "ROLE_POLICE";
    public static final String ROLE_HOSPITAL = "ROLE_HOSPITAL";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
}
