package com.ejushang.uams.server.login.service;

import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.domain.Employee;
import com.ejushang.uams.server.employee.service.EmployeeService;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-8-4
 * Time: 下午1:47
 * To change this template use File | Settings | File Templates.
 */

@Service
public class LoginService {

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private EmployeeService employeeService;

    public boolean login(String usernameInput,String passwordInput) {
        Properties props = new Properties();
        String path = LoginService.class.getClassLoader().getResource("").getPath();
        try {
            InputStream in = new BufferedInputStream (new FileInputStream(path+"/login.properties"));
            props.load(in);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String username = props.getProperty("username");
        String password = props.getProperty("password");
        if (usernameInput.equals(username) && passwordInput.equals(password)) {
            return true;
        }
        return false;
    }

}
