package com.ejushang.uams.enumer;

/**
 * 员工状态
 */
public enum EmployeeStatus {

    NORMAL("正常"),

    FROZEN("已冻结"),

    QUIT("已离职");

    public String value;

    private EmployeeStatus(String value) {
        this.value = value;
    }

    /**
     * 根据值取枚举
     * @param value
     * @return
     */
    public static EmployeeStatus enumValueOf(String value) {
        if(value == null) {
            return null;
        }
        for(EmployeeStatus enumValue : values()) {
            if(value.equalsIgnoreCase(enumValue.value)) {
                return enumValue;
            }
        }
        return null;
    }
}