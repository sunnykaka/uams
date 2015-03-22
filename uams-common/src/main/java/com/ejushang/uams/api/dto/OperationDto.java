package com.ejushang.uams.api.dto;

import java.io.Serializable;
import java.util.List;

/**
 * User: liubin
 * Date: 14-3-24
 */
public class OperationDto implements Serializable {


    private Integer id;

    /**操作路径 */
    private String url;

    /** 操作名字 */
    private String name;

    /** 是否把该操作加到操作界面 */
    private Boolean configable;

    /** 进行此操作的前提条件 */
    private String required;


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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OperationDto that = (OperationDto) o;

        if (configable != null ? !configable.equals(that.configable) : that.configable != null) return false;
        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (required != null ? !required.equals(that.required) : that.required != null) return false;
        if (url != null ? !url.equals(that.url) : that.url != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (url != null ? url.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (configable != null ? configable.hashCode() : 0);
        result = 31 * result + (required != null ? required.hashCode() : 0);
        return result;
    }
}
