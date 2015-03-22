package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;
import com.ejushang.uams.server.common.util.OperableData;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * User: liubin
 * Date: 14-3-11
 */
@Entity
@Table(name = "t_stub")
public class Stub implements EntityClass<Integer>, OperableData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "name", length = 32, unique = true)
    private String name;

    @Column(name = "unique_no", length = 32, unique = true)
    private String uniqueNo;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "file_md5", length = 128)
    private String fileMd5;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "file_update_time")
    private Date fileUpdateTime;

    /**创建时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_time")
    private Date createTime;

    /**更改时间*/
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_time")
    private Date updateTime;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "stub")
    @JsonIgnore
    private List<Resource> resourceList=new ArrayList<Resource>(0);

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "stub")
    @JsonIgnore
    private List<StubRole> stubRoleList=new ArrayList<StubRole>(0);


    public String getFileMd5() {
        return fileMd5;
    }

    public void setFileMd5(String fileMd5) {
        this.fileMd5 = fileMd5;
    }

    public Date getFileUpdateTime() {
        return fileUpdateTime;
    }

    public void setFileUpdateTime(Date fileUpdateTime) {
        this.fileUpdateTime = fileUpdateTime;
    }

    public List<StubRole> getStubRoleList() {
        return stubRoleList;
    }

    public void setStubRoleList(List<StubRole> stubRoleList) {
        this.stubRoleList = stubRoleList;
    }

    public List<Resource> getResourceList() {
        return resourceList;
    }

    public void setResourceList(List<Resource> resourceList) {
        this.resourceList = resourceList;
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

    public String getUniqueNo() {
        return uniqueNo;
    }

    public void setUniqueNo(String uniqueNo) {
        this.uniqueNo = uniqueNo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}
