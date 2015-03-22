package com.ejushang.uams.enumer;

/**
 * 员工职位
 */
public enum EmployeePosition {

    DIRECTOR("总监"),
    MANAGER("部门经理"),
    SUPERVISOR("部门主管"),
    EMPLOYEE("职员");

    public String value;

    private EmployeePosition(String value){
        this.value = value;
    }

}