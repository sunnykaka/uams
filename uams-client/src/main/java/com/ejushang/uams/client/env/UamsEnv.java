package com.ejushang.uams.client.env;

import com.ejushang.uams.client.UamsClientContext;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;

/**
 * Uams相关环境变量
 * User: liubin
 * Date: 14-3-19
 */
public class UamsEnv {
    
    private static final Logger log = LoggerFactory.getLogger(UamsEnv.class);

    public static String serverRoot;

    public static String uniqueNo;

    public static String employeesApiUri;

    public static String loginApiUri;

    public static String employeesRolesApiUri;

    public static String employeesResourcesApiUri;

    public static String stubsResourcesApiUri;

    public static String stubsFileSyncApiUri;

    public static String employeeSearchApiUri;

    public static String employeePasswordApiUri;

    public static String employeeRoleApiUri;





    public static void init() throws IllegalAccessException {
        for(Field field : UamsEnv.class.getFields()) {
            String fieldName = field.getName();
            String value = getValue(fieldName);
            if(StringUtils.isBlank(value)) {
                log.warn("uams配置文件中没有发现{}配置项:", fieldName);
                continue;
            }
            if(fieldName.endsWith("ApiUri")) {
                //ApiUri结尾的属性值要加上serverRoot路径
                field.set(null, serverRoot + value);
            } else {
                field.set(null, value);
            }
        }
    }


    private static String getValue(String key) {
        return UamsClientContext.getConfigValue(key);
    }


}
