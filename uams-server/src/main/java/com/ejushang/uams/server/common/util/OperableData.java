package com.ejushang.uams.server.common.util;

import java.util.Date;

/**
 * User: liubin
 * Date: 14-3-12
 */
public interface OperableData {

    void setCreateTime(Date createTime);

    Date getCreateTime();

    void setUpdateTime(Date updateTime);

    Date getUpdateTime();
}
