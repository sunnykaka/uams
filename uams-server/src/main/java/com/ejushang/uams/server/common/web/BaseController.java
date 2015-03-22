package com.ejushang.uams.server.common.web;

import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.util.EntityClass;
import com.ejushang.uams.util.NumberUtil;

/**
 * User: liubin
 * Date: 14-3-13
 */
public class BaseController {

    protected void assertNotNull(String message, Object o) {
        if(o == null) {
            throw new UamsBusinessException(message);
        }
    }

    protected void assertEntityExist(String message, Integer id, EntityClass<Integer> entity) {
        if(id == null) return;
        assertEntityExist(message, entity);
    }

    protected void assertEntityExist(String message, EntityClass<Integer> entity) {
        if(NumberUtil.isNullOrZero(entity.getId())) {
            throw new UamsBusinessException(message);
        }
    }

}
