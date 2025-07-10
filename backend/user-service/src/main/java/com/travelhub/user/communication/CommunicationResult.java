package com.travelhub.user.communication;

import java.time.Duration;

/**
 * Result wrapper for service communication operations
 */
public class CommunicationResult<T> {
    
    private final boolean successful;
    private final T data;
    private final String errorMessage;
    private final Duration responseTime;
    private final CommunicationFailureType failureType;
    
    public enum CommunicationFailureType {
        TIMEOUT,
        CONNECTION_ERROR,
        API_ERROR,
        DATA_VALIDATION_ERROR,
        UNKNOWN
    }
    
    private CommunicationResult(boolean successful, T data, String errorMessage, 
                               Duration responseTime, CommunicationFailureType failureType) {
        this.successful = successful;
        this.data = data;
        this.errorMessage = errorMessage;
        this.responseTime = responseTime;
        this.failureType = failureType;
    }
    
    public static <T> CommunicationResult<T> success(T data, Duration responseTime) {
        return new CommunicationResult<>(true, data, null, responseTime, null);
    }
    
    public static <T> CommunicationResult<T> failure(String errorMessage, Duration responseTime) {
        return new CommunicationResult<>(false, null, errorMessage, responseTime, CommunicationFailureType.API_ERROR);
    }
    
    public static <T> CommunicationResult<T> timeout(String errorMessage, Duration responseTime) {
        return new CommunicationResult<>(false, null, errorMessage, responseTime, CommunicationFailureType.TIMEOUT);
    }
    
    public static <T> CommunicationResult<T> connectionError(String errorMessage, Duration responseTime) {
        return new CommunicationResult<>(false, null, errorMessage, responseTime, CommunicationFailureType.CONNECTION_ERROR);
    }
    
    public static <T> CommunicationResult<T> dataValidationError(String errorMessage, Duration responseTime) {
        return new CommunicationResult<>(false, null, errorMessage, responseTime, CommunicationFailureType.DATA_VALIDATION_ERROR);
    }
    
    // Getters
    public boolean isSuccessful() {
        return successful;
    }
    
    public T getData() {
        return data;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public Duration getResponseTime() {
        return responseTime;
    }
    
    public CommunicationFailureType getFailureType() {
        return failureType;
    }
    
    public boolean isTimeout() {
        return failureType == CommunicationFailureType.TIMEOUT;
    }
    
    public boolean isConnectionError() {
        return failureType == CommunicationFailureType.CONNECTION_ERROR;
    }
    
    public boolean isApiError() {
        return failureType == CommunicationFailureType.API_ERROR;
    }
    
    public boolean isDataValidationError() {
        return failureType == CommunicationFailureType.DATA_VALIDATION_ERROR;
    }
    
    @Override
    public String toString() {
        if (successful) {
            return String.format("CommunicationResult{successful=true, responseTime=%dms}", 
                    responseTime != null ? responseTime.toMillis() : 0);
        } else {
            return String.format("CommunicationResult{successful=false, failureType=%s, error='%s', responseTime=%dms}", 
                    failureType, errorMessage, responseTime != null ? responseTime.toMillis() : 0);
        }
    }
}