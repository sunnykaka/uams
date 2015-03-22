package com.ejushang.uams.exception;

/**
 * uams项目业务异常
 * User: liubin
 * Date: 14-3-7
 */
public class UamsBusinessException extends RuntimeException {

    public UamsBusinessException() {
        super();
    }

    public UamsBusinessException(String message) {
        super(message);
    }

    public UamsBusinessException(String message, Throwable cause) {
        super(message, cause);
    }

    public UamsBusinessException(Throwable cause) {
        super(cause);
    }


}