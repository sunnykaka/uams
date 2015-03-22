package com.ejushang.uams.server.index.web;

import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.page.PageFactory;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.util.WebUtil;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.domain.User;
import com.ejushang.uams.server.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * User: liubin
 * Date: 14-3-11
 */
@Controller
public class IndexController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(IndexController.class);


    @RequestMapping("/")
    public String index(){
        return "redirect:/index.html";
    }

    @RequestMapping("/404")
    public String pageNotFound(HttpServletRequest request ,HttpServletResponse response) throws IOException {
        if(WebUtil.isAjaxRequest(request)) {
            new JsonResult(false, "您访问的页面不存在").writeToResponse(response);
        } else {
            response.getOutputStream().write("Page Not Found".getBytes("UTF-8"));
        }
        return null;
    }




}
