package com.ejushang.uams.server.department.web;

import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.page.PageFactory;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.department.service.DepartmentService;
import com.ejushang.uams.server.domain.Department;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-3-18
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class DepartmentControll extends BaseController {

    @Autowired
    private DepartmentService departmentService;

    @RequestMapping(value = "/departments",method = RequestMethod.GET)
    @ResponseBody
    public String find(HttpServletRequest request){
        List<Department> departments = new ArrayList<Department>();
        departments = departmentService.findByKey(request.getParameterMap());
        return new JsonResult(true).addList(departments).toJson();
    }



    @RequestMapping(value = "/departments",method = RequestMethod.POST)
    @ResponseBody
    public String createDepartment(Department department){
        Department department1 = departmentService.save(department);
        return new JsonResult(true).addObject(department1).toJson();
    }

    @RequestMapping(value = "/departments/{departmentid}",method = RequestMethod.PUT)
    @ResponseBody
    public String updateDepartment(@ModelAttribute("departmentid")Department department,@PathVariable("departmentid") Integer id){
        assertEntityExist("部门不存在",id,department);
        departmentService.save(department);
      return new JsonResult(true).toJson();
    }

    @RequestMapping(value = "departments/{departmentid}",method = RequestMethod.DELETE)
    @ResponseBody
    public String removeDepartment(@ModelAttribute("departmentid")Department department,@PathVariable("departmentid") Integer id){
        assertEntityExist("部门不存在",department);
        departmentService.delelte(id);

        return new JsonResult(true).toJson();
    }

    @RequestMapping(value = "/department")
    public String web(){
        return "/department";
    }

}
