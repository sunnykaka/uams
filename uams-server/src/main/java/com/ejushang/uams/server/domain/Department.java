package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;
import com.ejushang.uams.server.common.util.OperableData;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-11
 * Time: 上午10:19
 */

@Entity
@Table(name = "t_department")
public class Department implements EntityClass<Integer> ,OperableData{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name="name", length = 128, nullable = false, unique = true)
    private String name;

    @Column(name="code", length = 128)
    private String code; //部门编号

    @Column(name="parent_id")
    private Integer parentId;

    /** 所属父类部门*/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="parent_id", insertable = false, updatable = false)
    @JsonIgnore
    private Department parent;


    /**创建时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="create_time")
    private Date createTime;

    /**更新时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="update_time")
    private Date updateTime;

    /**所包含子类部门**/
    @OneToMany(fetch = FetchType.EAGER, mappedBy ="parent")
    private List<Department> children;

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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Department getParent() {
        return parent;
    }

    public void setParent(Department parent) {
        this.parent = parent;
    }

    public List<Department> getChildren() {
        return children;
    }

    public void setChildren(List<Department> children) {
        this.children = children;
    }
}
