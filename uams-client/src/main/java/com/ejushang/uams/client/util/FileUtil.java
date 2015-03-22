package com.ejushang.uams.client.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * User: liubin
 * Date: 14-3-19
 */
public class FileUtil {

    /**
     * 从输入流中读取字符串
     * @param input
     * @return
     * @throws IOException
     */
    public static String readFile(InputStream input) throws IOException {
        BufferedReader in = null;
        try {
            StringBuilder sb = new StringBuilder();
            in = new BufferedReader(new InputStreamReader(input, "UTF8"));
            String str;
            while ((str = in.readLine()) != null) {
                sb.append(str);
            }
            return sb.toString();
        } finally {
            if(in != null) {
                in.close();
            }
        }

    }


}
