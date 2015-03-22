package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;
import com.ejushang.uams.server.common.util.OperableData;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * User: liubin
 * Date: 14-3-11
 */
@Entity
@Table(name = "t_sync_log")
public class SyncLog implements EntityClass<Integer>, OperableData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

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

    /**更改时间*/
    @Column(name = "file_content", columnDefinition = "TEXT")
    private String fileContent;

    @Column(name="stub_id")
    private Integer stubId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="stub_id",insertable = false,updatable = false)
    private Stub stub;

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

    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }
}
