package com.ejushang.uams.server.user.web;

import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.page.PageFactory;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.domain.User;
import com.ejushang.uams.server.user.service.UserService;
import com.ejushang.uams.util.NumberUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.beans.PropertyEditorSupport;
import java.util.List;
import java.util.Map;

/**
 * User: liubin
 * Date: 14-3-11
 */
@Controller
public class UserController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;


    @RequestMapping("/users/list")
    @ResponseBody
    public String list(HttpServletRequest request, String username) {

        Page page = PageFactory.getPage(request);
        userService.findByKey(username, page);

        return new JsonResult(true).addObject(page).toJson();

    }

//    @RequestMapping(value = {"/users", "/users/{user}"}, method = {RequestMethod.POST, RequestMethod.PUT})
//    @ResponseBody
//    public String save(@ModelAttribute("user") User user, @PathVariable("user") Integer id) {
//
//        assertEntityExist("用户不存在", id, user);
//
//        userService.save(user);
//
//        return new JsonResult(true).toJson();
//
//    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public String createUser(User user) {

        userService.save(user);

        return new JsonResult(true).toJson();

    }

    @RequestMapping(value = "/users/{userId}", method = RequestMethod.PUT)
    @ResponseBody
    public String updateUser(@ModelAttribute("userId") User user, @PathVariable("userId") Integer userId) {

        assertEntityExist("用户不存在", userId, user);

        userService.save(user);

        return new JsonResult(true).toJson();

    }


    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public String view(@ModelAttribute("userId") User user) {

        assertEntityExist("用户不存在", user);

        return new JsonResult(true).addObject(user).toJson();

    }

    @RequestMapping("/test")
    public String test() {
        return "/test";
    }




}
