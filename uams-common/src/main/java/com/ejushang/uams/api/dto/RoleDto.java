package com.ejushang.uams.api.dto;

import java.io.Serializable;
import java.util.Date;

/**
 * User: liubin
 * Date: 14-3-24
 */
public class RoleDto implements Serializable{

    /**id*/
    private Integer id;

    /**名字*/
    private String name;

    /**创建时间*/
    private Date createTime;

    /**更新时间*/
    private Date updateTime;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RoleDto roleDto = (RoleDto) o;

        if (createTime != null ? !createTime.equals(roleDto.createTime) : roleDto.createTime != null) return false;
        if (id != null ? !id.equals(roleDto.id) : roleDto.id != null) return false;
        if (name != null ? !name.equals(roleDto.name) : roleDto.name != null) return false;
        if (updateTime != null ? !updateTime.equals(roleDto.updateTime) : roleDto.updateTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (createTime != null ? createTime.hashCode() : 0);
        result = 31 * result + (updateTime != null ? updateTime.hashCode() : 0);
        return result;
    }
}
