package com.ejushang.uams.server.employee.web;

import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.page.PageFactory;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.domain.Employee;
import com.ejushang.uams.server.domain.Role;
import com.ejushang.uams.server.employee.service.EmployeeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-3-17
 * Time: 上午9:24
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class EmployeeController extends BaseController {

    @Autowired
    private EmployeeService employeeService;

    @RequestMapping(value = "/employees", method = RequestMethod.GET)
    @ResponseBody
    public String list(HttpServletRequest request, String searchValue, String searchType) {
        Page page = PageFactory.getPage(request);
        employeeService.findByKey(searchType, searchValue, page);
        return new JsonResult(true).addObject(page).toJson();
    }

    @RequestMapping(value = "/employees/roles/{employeeid}", method = RequestMethod.GET)
    @ResponseBody
    public String getEmployeeRoleLists(HttpServletRequest request, @PathVariable("employeeid") Integer id) {
        List<Role> roleList = employeeService.changeAllRoleStatus(id);
        return new JsonResult(true).addObject(roleList).toJson();
    }


    @RequestMapping(value = "/employees", method = RequestMethod.POST)
    @ResponseBody
    public String createEmployee(Employee employee, String[] roleIds, String newPassword) {
        employeeService.save(employee, roleIds, newPassword);

        return new JsonResult(true).toJson();

    }

    @RequestMapping(value = "/employees/{employeeid}", method = RequestMethod.PUT)
    @ResponseBody
    public String updateEmployee(@ModelAttribute("employeeid") Employee employee, @PathVariable("employeeid") Integer id, String status, String[] roleIds, String newPassword) {
        assertEntityExist("员工不存在", id, employee);
        if (!StringUtils.isBlank(status)) {
            employeeService.updateStatus(id, status);
        } else {
            employeeService.save(employee, roleIds, newPassword);
        }


        return new JsonResult(true).toJson();

    }

    @RequestMapping("/employees/upload_excel")
    @ResponseBody
    public String uploadExcel(@RequestParam("uploadFile") CommonsMultipartFile uploadFile) {
        String excelRegex = "^.*\\.(xls|xlsx)$";
        String fileName = uploadFile.getOriginalFilename();
        if (!fileName.matches(excelRegex)) {
            throw new UamsBusinessException("文件读取错误");
        }
        try {
            employeeService.uploadExcel(uploadFile);
        } catch (IOException e) {
            return new JsonResult(false, "导入失败：" + e.getMessage()).toJson();
        }
        return new JsonResult(true, "导入成功!").toJson();
    }
}
