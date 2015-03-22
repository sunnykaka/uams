package com.ejushang.uams.server.common.util;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-5-30
 * Time: 上午11:03
 * To change this template use File | Settings | File Templates.
 */
public class StringUtil {

   // 删除字符串的开头结尾
    public static String deleteStartEnd(String s) {
        return s.substring(1).substring(0,s.length()-2);
    }

    //设置传入格式为科学计数法数字的电话号码
    public static String telString(String tel) {
        String newTel = tel.replace(".","");
        newTel = newTel.replace("E","");
        newTel = newTel.replace("e","");
        if (newTel.length()>11) {
            newTel = newTel.substring(0,11);
        }
        return newTel;
    }

}
