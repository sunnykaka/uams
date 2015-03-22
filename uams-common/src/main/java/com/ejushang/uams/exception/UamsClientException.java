package com.ejushang.uams.exception;

import com.ejushang.uams.api.dto.ErrorInfo;

/**
 * uams客户端调用异常
 * User: liubin
 * Date: 14-3-7
 */
public class UamsClientException extends Exception {

    private ErrorInfo errorInfo;

    public UamsClientException(String message) {
        super(message);
    }

    public UamsClientException(ErrorInfo errorInfo) {
        this(errorInfo.toString());
        this.errorInfo = errorInfo;
    }

    public ErrorInfo getErrorInfo() {
        return errorInfo;
    }

    @Override
    public String toString() {
        String msg = super.toString();
        if(msg == null) msg = "";
        msg += errorInfo.toString();
        return msg;
    }
}