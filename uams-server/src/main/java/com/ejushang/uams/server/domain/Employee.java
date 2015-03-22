package com.ejushang.uams.server.domain;

import com.ejushang.uams.enumer.EmployeeStatus;
import com.ejushang.uams.server.common.util.EntityClass;
import com.ejushang.uams.server.common.util.OperableData;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-11
 * Time: 上午10:10
 */
@Entity
@Table(name = "t_employee")
public class Employee implements EntityClass<Integer>, OperableData{

    /**id*/
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    /**名称*/
    @Column(name = "username", length = 32, nullable = false)
    private String username;

    /**密码*/
    @Column(name = "password", length = 255)
    private String password;

    /** 盐 */
    @Column(name = "salt", length = 128)
    private String salt;

    /**
     * 用户详情
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private EmployeeInfo employeeInfo;

    /**
     * 状态
     */
    @Column(name="status")
    @Enumerated(EnumType.STRING)
    private EmployeeStatus status = EmployeeStatus.NORMAL;

    /**创建时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_time")
    private Date createTime;

    /**更改时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_time")
    private Date updateTime;

    @Column(name="department_id")
    private Integer departmentId;

    /** 所属部门*/
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="department_id", insertable = false, updatable = false)
    private Department department;

    /**角色*/
    @OneToMany(fetch = FetchType.EAGER, mappedBy ="employee")
    private List<EmployeeRole> employeeRoleList = new ArrayList<EmployeeRole>(0);

    /**是否为超级管理员**/
    @Column(name = "root_user")
    private Boolean rootUser = false;


    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public EmployeeInfo getEmployeeInfo() {
        return employeeInfo;
    }

    public void setEmployeeInfo(EmployeeInfo employeeInfo) {
        this.employeeInfo = employeeInfo;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }


    public List<EmployeeRole> getEmployeeRoleList() {
        return employeeRoleList;
    }

    public void setEmployeeRoleList(List<EmployeeRole> employeeRoleList) {
        this.employeeRoleList = employeeRoleList;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Boolean getRootUser() {
        return rootUser;
    }

    public void setRootUser(Boolean rootUser) {
        this.rootUser = rootUser;
    }
}
