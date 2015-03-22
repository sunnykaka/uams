package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * User: liubin
 * Date: 14-3-11
 */
@Entity
@Table(name = "t_resource")
public class Resource implements EntityClass<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    /** 资源名 */
    @Column(name = "name", length = 256)
    private String name;

    /** 唯一键 */
    @Column(name = "unique_key", unique = true, length = 256)
    private String uniqueKey;

    /** 前端展示需要使用的属性 */
    @Column(name = "icon_cls", length = 256)
    private String iconCls;

    /** 前端展示需要使用的属性 */
    @Column(name = "module", length = 256)
    private String module;

    /** 入口操作名称 */
    @Column(name = "entry_operation", length = 256)
    private String entryOperation;

    @Column(name = "stub_id")
    private Integer stubId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="stub_id", insertable = false, updatable = false)
    @JsonIgnore
    private Stub stub;

    @OneToMany (fetch = FetchType.LAZY,mappedBy = "resource")
    private List<Operation> operationList=new ArrayList<Operation>(0);

    public Integer getStubId() {
        return stubId;
    }

    public void setStubId(Integer stubId) {
        this.stubId = stubId;
    }

    public Stub getStub() {
        return stub;
    }

    public void setStub(Stub stub) {
        this.stub = stub;
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

    public String getUniqueKey() {
        return uniqueKey;
    }

    public void setUniqueKey(String uniqueKey) {
        this.uniqueKey = uniqueKey;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getEntryOperation() {
        return entryOperation;
    }

    public void setEntryOperation(String entryOperation) {
        this.entryOperation = entryOperation;
    }

    public List<Operation> getOperationList() {
        return operationList;
    }

    public void setOperationList(List<Operation> operationList) {
        this.operationList = operationList;
    }
}
