package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;
import com.ejushang.uams.server.common.util.OperableData;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * User:Amos.zhou
 * Date: 14-3-11
 * Time: 上午11:14
 */
@Entity
@Table(name = "t_role")
public class Role implements EntityClass<Integer>, OperableData {

    /**id*/
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    /**名字*/
    @Column(name="name", length = 32)
    private String name;

    /**创建时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="create_time")
    private Date createTime;

    /**更新时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="update_time")
    private Date updateTime;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,mappedBy ="role")
    private List<EmployeeRole> employeeRoleList=new ArrayList<EmployeeRole>(0);

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,mappedBy ="role")
    private List<StubRole> stubRoleList;

    /**标记指定员工是否具有该角色**/
    @Transient
    private Boolean status;

    public List<StubRole> getStubRoleList() {
        return stubRoleList;
    }

    public void setStubRoleList(List<StubRole> stubRoleList) {
        this.stubRoleList = stubRoleList;
    }

    public List<EmployeeRole> getEmployeeRoleList() {
        return employeeRoleList;
    }

    public void setEmployeeRoleList(List<EmployeeRole> employeeRoleList) {
        this.employeeRoleList = employeeRoleList;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
