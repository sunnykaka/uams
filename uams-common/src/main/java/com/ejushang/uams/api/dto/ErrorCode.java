package com.ejushang.uams.api.dto;

/**
 * 错误代码
 * User: liubin
 * Date: 14-3-17
 */
public enum ErrorCode {

    //服务器系统异常
    UNKNOWN_ERROR(10001, "未知错误"),
    IP_RESTRICTION(10002, "IP限制不能请求该资源"),
    PERMISSION_DENIED(10003, "授权失败"),
    PARAMS_ERROR(10004, "参数错误"),
    TOO_MANY_TASK(10005, "任务过多，系统繁忙"),
    TASK_TIMEOUT(10006, "任务超时"),
    NOT_SUPPORTED_METHOD(10007, "请求的HTTP METHOD不支持"),
    IP_REQUEST_TIME_OVERFLOW(10008, "IP请求频次超过上限"),
    USER_REQUEST_TIME_OVERFLOW(10009, "用户请求频次超过上限"),
    STUB_REQUEST_TIME_OVERFLOW(10010, "系统请求频次超过上限"),

    STUB_REQUEST_ERROR(10101, "请求服务器的时候发生异常"),
    SERVER_RESPONSE_NOTHING(10102, "服务器未返回任务数据"),
    PARSE_SERVER_RESPONSE_ERROR(10103, "json转对象的时候发生错误"),

    UNIQUE_NO_NOT_EXIST(20001, "缺少唯一编号参数"),
    UNIQUE_NO_FORMAT_ERROR(20002, "唯一编号格式不正确"),
    STUB_NOT_EXIST(20003, "没有找到对应的客户系统"),


    EMPLOYEE_NOT_EXIST(20101, "员工在系统不存在"),
    EMPLOYEE_FROZEN(20102,"该员工已冻结"),
    EMPLOYEE_PASSWORD_ERROR(20103,"原密码错误"),
    ROLE_NOT_EXIST(20201,"该用户无对应角色"),

    RESOURCE_NOT_EXIST(20301,"该系统下的无任何模块"),
    RESOURCE_NOT_EXIST_FOR_ROLE(20302,"该系统下，该角色对应的模块不存在"),
    USERNAME_PASSWORD_MISMATCH(20303, "用户名或密码错误"),

    ENTRYOPERATION_NOT_NULL(20202,"entryOperation属性不能为空"),
    ENTRYOPERATION_NOT(20203," entryOperation对应的operation不存在"),
    REQUIRED_NOT(20204,"operation的required不存在"),
    RESOURCE_OPERATION_NULL(20205,"resource下的operation为空"),
    NAME_MISMATCH(20201,"权限配置文件中resource或operation名字重复"),
    PERMISSION_NAME_ERROR(20401,"读取权限xml的时候发生错误");

    public final Integer value;

    public final String msg;

    private ErrorCode(Integer value, String msg) {
        this.value = value;
        this.msg = msg;
    }

    public static ErrorCode valueOf(Integer value) {
        if(value != null) {
            for(ErrorCode errorCode : values()) {
                if(errorCode.value.equals(value)) {
                    return errorCode;
                }
            }
        }

        return UNKNOWN_ERROR;
    }
}
