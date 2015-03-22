package com.ejushang.uams.client.http;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

/**
 * 封装http get 和 post 请求
 * User: liubin
 * Date: 14-3-19
 */
public class HttpRequest {

    private static final Logger log = LoggerFactory.getLogger(HttpRequest.class);


    public static final String CHARSET_NAME = "UTF-8";


    /**
     * get请求
     * @param url
     * @param params
     * @return
     * @throws IOException
     */
    public String get(String url, Map<String, List<String>> params) throws IOException {
        if(log.isInfoEnabled()) {
            log.info("get请求url:{}, params{}", url, params.toString());
        }
        if(params != null && !params.isEmpty()) {
            url += "?" + getQueryString(params);
        }
        URLConnection connection = new URL(url).openConnection();
        connection.setRequestProperty("Accept-Charset", CHARSET_NAME);
        InputStream response = connection.getInputStream();

        return parseResponse((HttpURLConnection) connection, response);

    }

    /**
     * post请求
     * @param url
     * @param params
     * @return
     * @throws IOException
     */
    public String post(String url, Map<String, List<String>> params) throws IOException {
        if(log.isInfoEnabled()) {
            log.info("post请求url:{}, params{}", url, params.toString());
        }
        String queryString = getQueryString(params);
        URLConnection connection = new URL(url).openConnection();
        connection.setDoOutput(true); // Trigg ers POST.
        connection.setRequestProperty("Accept-Charset", CHARSET_NAME);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=" + CHARSET_NAME);
        OutputStream output = connection.getOutputStream();
        try {
            output.write(queryString.getBytes(CHARSET_NAME));
        } finally {
            try {
                output.close();
            } catch (IOException e) {
                log.error("", e);
            }
        }
        InputStream response = connection.getInputStream();

        return parseResponse((HttpURLConnection) connection, response);

    }

    /**
     * 解析返回值
     * @param connection
     * @param response
     * @return
     * @throws IOException
     */
    private String parseResponse(HttpURLConnection connection, InputStream response) throws IOException {
        if(log.isInfoEnabled()) {
            int responseCode = connection.getResponseCode();
            log.info("response status:" + responseCode);
        }
        BufferedReader reader = new BufferedReader(new InputStreamReader(response, CHARSET_NAME));
        try {
            StringBuilder sb = new StringBuilder();
            for (String line; (line = reader.readLine()) != null;) {
                sb.append(line);
            }
            String result = sb.toString();
            log.info("response result: " + result);
            return result;
        } finally {
            try {
                reader.close();
            } catch (IOException e) {
                log.error("", e);
            }
        }
    }

    /**
     * 创建查询参数字符串
     * @param params
     * @return
     * @throws UnsupportedEncodingException
     */
    private String getQueryString(Map<String, List<String>> params) throws UnsupportedEncodingException {
        if(params == null || params.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for(Map.Entry<String, List<String>> entry : params.entrySet()) {
            String key = entry.getKey();
            List<String> values = entry.getValue();
            if(values == null || values.isEmpty()) {
                continue;
            }
            for (String value : values) {
                sb.append(key).append("=");
                if(!StringUtils.isBlank(value)) {
                    sb.append(URLEncoder.encode(value, CHARSET_NAME));
                }
                sb.append("&");
            }
        }
        sb.deleteCharAt(sb.length() - 1);
        return sb.toString();
    }


}
