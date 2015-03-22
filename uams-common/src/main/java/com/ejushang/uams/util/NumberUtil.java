package com.ejushang.uams.util;

/**
 * User: liubin
 * Date: 14-3-12
 */
public class NumberUtil {

    public static boolean isNullOrZero(Integer num) {
        return num == null || num.equals(0);
    }

    public static boolean isNullOrZero(Object o) {
        if(o == null) return true;
        if (o instanceof Number) {
            if(((Number)o).intValue() == 0) {
                return true;
            }
        }
        return false;
    }

}
