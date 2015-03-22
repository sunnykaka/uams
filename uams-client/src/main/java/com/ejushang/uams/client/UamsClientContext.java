package com.ejushang.uams.client;

import com.ejushang.uams.client.env.UamsEnv;import com.ejushang.uams.client.util.FileUtil;
import com.ejushang.uams.exception.UamsClientException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 负责读取配置文件与权限文件的信息,负责初始化UamsClient对象以供调用
 * User: liubin
 * Date: 14-3-18
 */
public class UamsClientContext {


    private static final Logger log = LoggerFactory.getLogger(UamsClientContext.class);

    private static final AtomicBoolean initialized = new AtomicBoolean(false);

    private static final String CONFIG_FILE_NAME = "stub.properties";
    private static final String PERMISSION_FILE_NAME = "permissions.xml";

    //stub.properties的键值对
    private static final Map<String, String> configProperties = new HashMap<String, String>();

    //permissions.xml文件内容
    private static String permissionFileContent = null;


    static {
        try {
            init();
        } catch (Exception e) {
            log.error("初始化UAMS环境的时候发生错误", e);
        }
    }


    /**
     * 初始化
     * @throws Exception
     */
    public static void init() throws Exception {
        if(initialized.compareAndSet(false, true)) {
            //顺序不能乱
            readProperties();
            UamsEnv.init();
            readPermissionFile();
            syncPermissionFile();
        }
    }


    /**
     * 读取stub.properties文件内容
     * @throws Exception
     */
    private static void readProperties() throws Exception {
        configProperties.clear();
        Properties props = new Properties();
        InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(CONFIG_FILE_NAME);
        if(inputStream == null) {
            throw new UamsClientException("没有找到uams参数配置文件:" + CONFIG_FILE_NAME);
        }
        try {
            props.load(inputStream);
        } finally {
            inputStream.close();
        }
        for(Iterator<Map.Entry<Object,Object>> iter = props.entrySet().iterator(); iter.hasNext();) {
            Map.Entry<Object,Object> entry = iter.next();
            configProperties.put((String)entry.getKey(), (String)entry.getValue());
        }
    }


    /**
     * 读取permissions.xml文件内容
     * @throws Exception
     */
    private static void readPermissionFile() throws Exception {
        InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(PERMISSION_FILE_NAME);
        if(inputStream == null) {
            throw new UamsClientException("没有找到uams权限配置文件:" + PERMISSION_FILE_NAME);
        }
        String result = FileUtil.readFile(inputStream);
        if(StringUtils.isBlank(result)) {
            throw new UamsClientException("uams权限配置文件的内容不能空,文件名称:" + PERMISSION_FILE_NAME);
        }
        permissionFileContent = result;
    }

    /**
     * 与服务器同步permissions.xml文件
     */
    private static void syncPermissionFile() throws UamsClientException {
        createUamsClient().syncPermissionFile();
    }


    /**
     * 得到permissions.xml文件内容
     * @return
     */
    public static String getPermissionFileContent() {
        return permissionFileContent;
    }


    public static String getConfigValue(String key) {
        return configProperties.get(key);
    }


    public static UamsClient createUamsClient() {
        return new UamsClient(UamsEnv.uniqueNo);
    }



    public static void main(String[] args) {
        System.out.println(UamsEnv.uniqueNo);
        System.out.println(UamsEnv.employeesApiUri);
    }


}
