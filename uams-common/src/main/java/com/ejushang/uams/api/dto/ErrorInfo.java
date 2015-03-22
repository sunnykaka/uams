package com.ejushang.uams.api.dto;

import java.util.HashMap;
import java.util.Map;

/**
 * 错误信息Dto
 * User: liubin
 * Date: 14-3-17
 */
public class ErrorInfo {

    private String requestUrl;

    private int errorCode;

    private String msg;

    public ErrorInfo() {}

    public ErrorInfo(ErrorCode errorCode) {
        addErrorCodeObj(errorCode);
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public void addErrorCodeObj(ErrorCode errorCode) {
        this.errorCode = errorCode.value;
        this.msg = errorCode.msg;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Map toMap(){
        Map map = new HashMap();
        map.put("errorCode", errorCode);
        map.put("msg", msg);
        map.put("requestUrl", requestUrl);
        return map;
    }

    @Override
    public String toString() {
        return "ErrorInfo{" +
                "requestUrl='" + requestUrl + '\'' +
                ", errorCode=" + errorCode +
                ", msg='" + msg + '\'' +
                '}';
    }
}
