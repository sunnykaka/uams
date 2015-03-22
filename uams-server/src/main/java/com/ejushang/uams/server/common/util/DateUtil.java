package com.ejushang.uams.server.common.util;

import org.joda.time.MutableDateTime;

import java.util.Date;

/**
 * User: liubin
 * Date: 14-3-13
 */
public class DateUtil {

    /**
     * 得到当前时间,不包括毫秒
     * @return
     */
    public static Date now() {

        MutableDateTime now = new MutableDateTime();
        now.setMillisOfSecond(0);
        return now.toDate();

    }

}
