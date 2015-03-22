package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;
import com.ejushang.uams.util.NumberUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-11
 * Time: 下午2:18
 */
@Entity
@Table(name = "t_operation")
public class Operation implements EntityClass<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    /**操作路径 */
    @Column(name = "url", length = 255)
    private String url;

    /** 操作名字 */
    @Column(name = "name", length = 32)
    private String name;

    /** 是否把该操作加到操作界面 */
    @Column(name = "configable")
    private Boolean configable = false;

    /** 进行此操作的前提条件 */
    @Column(name = "required", length = 255)
    private String required;

    /** 资源id */
    @Column(name = "resource_id")
    private Integer resourceId;

    /** 资源id */
    @Transient
    private String resourceName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="resource_id", insertable = false, updatable = false)
    @JsonIgnore
    private Resource resource;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "operation")
    @JsonIgnore
    private List<StubRoleOperation> roleOperationList =new ArrayList<StubRoleOperation>(0);

    @JsonIgnore
    @Transient
    private boolean isOp;

    public boolean isOp() {
        return isOp;
    }

    public void setOp(boolean op) {
        isOp = op;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public List<StubRoleOperation> getRoleOperationList() {
        return roleOperationList;
    }

    public void setRoleOperationList(List<StubRoleOperation> roleOperationList) {
        this.roleOperationList = roleOperationList;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getConfigable() {
        return configable;
    }

    public void setConfigable(Boolean configable) {
        this.configable = configable;
    }

    public String getRequired() {
        return required;
    }

    public void setRequired(String required) {
        this.required = required;
    }

    public Integer getResourceId() {
        return resourceId;
    }

    public void setResourceId(Integer resourceId) {
        this.resourceId = resourceId;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof Operation){
            Operation operation = (Operation) obj;
            return operation.getId()!=null &&
                    operation.getId().equals(getId()) &&
                    StringUtils.equals(getName(),operation.getName());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return id<<5-id;
    }
}
