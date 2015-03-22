package com.ejushang.uams.server.login.web;


import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.util.StringUtil;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.login.service.LoginService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-8-4
 * Time: 下午1:47
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class LoginController extends BaseController {

    @Autowired
    private LoginService loginService;

    @RequestMapping(value="/user/login",method = RequestMethod.POST)
    @ResponseBody
    public String login(String username,String password,String verifyCode,HttpServletRequest request,HttpServletResponse response) {
        //取session中的正确验证码
        //页面不缓存本页
        response.setHeader("Cache-Control", "no-cache");
        String legalCode=null;
        if(request.getSession().getAttribute("verifyCode")!=null) {
            legalCode=(String)(request.getSession().getAttribute("verifyCode"));
        }
        if (StringUtils.isBlank(verifyCode) || !verifyCode.equals(legalCode)) {
            return new JsonResult(false,"验证码错误").toJson();
        }
        if (loginService.login(username,password)) {
            request.getSession().setAttribute("username",username);
            return new JsonResult(true).toJson();
        } else {
            return new JsonResult(false,"用户名或者密码错误").toJson();
        }

    }

    @RequestMapping(value="/logout",method = RequestMethod.GET)
    public void logout(HttpServletRequest request,HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        session.invalidate();
        response.sendRedirect("/login.html");
    }
}
