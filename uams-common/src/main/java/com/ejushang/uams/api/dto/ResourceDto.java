package com.ejushang.uams.api.dto;

import java.io.Serializable;
import java.util.List;

/**
 * User: liubin
 * Date: 14-3-24
 */
public class ResourceDto implements Serializable {

    private Integer id;

    /** 资源名 */
    private String name;

    /** 唯一键 */
    private String uniqueKey;

    /** 前端展示需要使用的属性 */
    private String iconCls;

    /** 前端展示需要使用的属性 */
    private String module;

    /** 入口操作名称 */
    private String entryOperation;

    /** 是否具有入口操作 **/
    private Boolean hasEntryOperation = false;

    private List<OperationDto> operationList;

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

    public Boolean getHasEntryOperation() {
        return hasEntryOperation;
    }

    public void setHasEntryOperation(Boolean hasEntryOperation) {
        this.hasEntryOperation = hasEntryOperation;
    }

    public List<OperationDto> getOperationList() {
        return operationList;
    }

    public void setOperationList(List<OperationDto> operationList) {
        this.operationList = operationList;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ResourceDto that = (ResourceDto) o;

        if (entryOperation != null ? !entryOperation.equals(that.entryOperation) : that.entryOperation != null)
            return false;
        if (hasEntryOperation != null ? !hasEntryOperation.equals(that.hasEntryOperation) : that.hasEntryOperation != null)
            return false;
        if (iconCls != null ? !iconCls.equals(that.iconCls) : that.iconCls != null) return false;
        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (module != null ? !module.equals(that.module) : that.module != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (operationList != null ? !operationList.equals(that.operationList) : that.operationList != null)
            return false;
        if (uniqueKey != null ? !uniqueKey.equals(that.uniqueKey) : that.uniqueKey != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (uniqueKey != null ? uniqueKey.hashCode() : 0);
        result = 31 * result + (iconCls != null ? iconCls.hashCode() : 0);
        result = 31 * result + (module != null ? module.hashCode() : 0);
        result = 31 * result + (entryOperation != null ? entryOperation.hashCode() : 0);
        result = 31 * result + (hasEntryOperation != null ? hasEntryOperation.hashCode() : 0);
        result = 31 * result + (operationList != null ? operationList.hashCode() : 0);
        return result;
    }
}
