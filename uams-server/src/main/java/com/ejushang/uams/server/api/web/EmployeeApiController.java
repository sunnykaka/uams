package com.ejushang.uams.server.api.web;

import com.ejushang.uams.api.dto.EmployeeDto;
import com.ejushang.uams.api.dto.EmployeeInfoDto;
import com.ejushang.uams.api.dto.ResourceDto;
import com.ejushang.uams.api.dto.RoleDto;
import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.api.service.EmployeeApiService;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * User: liubin
 * Date: 14-3-18
 */
@Controller
@RequestMapping("/api")
public class EmployeeApiController {

    @Autowired
    private EmployeeApiService employeeApiService;

    @RequestMapping("/login")
    @ResponseBody
    public EmployeeDto login(HttpServletRequest request,String uniqueNo, String username, String password) {
        return employeeApiService.login(uniqueNo, username, password);

    }

    @RequestMapping("/employees/roles")
    @ResponseBody
    public List<RoleDto> findRoleByEmployee(Integer employeeId) {
        return employeeApiService.findRoles(employeeId);
    }

    @RequestMapping("/employees")
    @ResponseBody
    public EmployeeInfoDto getInfo(Integer employeeId){
        return employeeApiService.findInfo(employeeId);
    }

    @RequestMapping("/employees/resources")
    @ResponseBody
    public List<ResourceDto> findResourceByEmployee(String uniqueNo,Integer employeeId){
        return employeeApiService.findResourceByEmployee(uniqueNo,employeeId);
    }

    @RequestMapping("/employees/search")
    @ResponseBody
    public List<EmployeeDto> findEmployeeByName(String uniqueNo, String username, String name) {
        return employeeApiService.findEmployeeByName(uniqueNo,username,name);
    }

    @RequestMapping("/employees/password")
    @ResponseBody
    public Boolean updatePassword(String uniqueNo,Integer id,String oldPassword,String newPassword) {
        return employeeApiService.updatePassword(uniqueNo,id,oldPassword,newPassword);
    }

    @RequestMapping("/employees/role")
    @ResponseBody
    public List<EmployeeDto> findEmployeeByRole(String uniqueNo,String roleName) {
        return employeeApiService.findEmployeeByRole(uniqueNo,roleName);
    }



}