package com.ejushang.uams.exception;

import com.ejushang.uams.api.dto.ErrorCode;
import org.apache.commons.lang3.StringUtils;

/**
 * uams api调用异常
 * User: liubin
 * Date: 14-3-7
 */
public class UamsApiException extends RuntimeException {

    private ErrorCode errorCode;
    private String errorMsg;

    public UamsApiException(int errorCode) {
        this(ErrorCode.valueOf(errorCode));
    }

    public UamsApiException(int errorCode, String errorMsg) {
        this(errorCode);
        if(!StringUtils.isBlank(errorMsg)) {
            this.errorMsg = errorMsg;
        }
    }

    public UamsApiException(ErrorCode errorCode) {
        this.errorCode = errorCode;
        this.errorMsg = errorCode.msg;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

//    /** 解决 Exception 所谓的性能差的问题. add by Athens on 2014.1.8 */
//    @Override
//    public Throwable fillInStackTrace() {
//        return this;
//    }
}