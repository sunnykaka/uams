package com.ejushang.uams.server.role.web;

import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.page.PageFactory;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.domain.Operation;
import com.ejushang.uams.server.domain.Resource;
import com.ejushang.uams.server.domain.Role;
import com.ejushang.uams.server.resource.service.ResourceService;
import com.ejushang.uams.server.role.service.RoleService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-14
 * Time: 下午3:27
 */
@Controller
public class RoleController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(RoleController.class);

    @Autowired
    private RoleService roleService;

    /**
     * 获取所有角色
     * @param request
     * @return
     */
    @RequestMapping(value = "/roles",method = RequestMethod.GET)
    @ResponseBody
    public String roleList(HttpServletRequest request,String name){

        Page page= PageFactory.getPage(request);
        roleService.findAll(page,name);
        return new JsonResult(true).addObject(page).toJson();
    }

    /**
     * 保存角色
     * @param role
     * @return
     */
    @RequestMapping(value = "/roles",method =RequestMethod.POST)
    @ResponseBody
    public String saveRole(Role role){
         roleService.save(role);
        return new JsonResult(true,"操作成功").toJson();
    }

    /**
     * 修改角色
     * @param role
     * @return
     */
    @RequestMapping(value = "/roles/{roleId}",method =RequestMethod.PUT)
    @ResponseBody
    public String updateRole(@ModelAttribute("roleId")Role role){
        roleService.save(role);
        return new JsonResult(true,"操作成功").toJson();
    }

    /**
     * 获取角色权限详细信息页面
     * @return
     */
    @RequestMapping(value = "/roles/{roleId}",method = RequestMethod.GET)
    @ResponseBody
    public String updatePermission(@PathVariable("roleId") Integer roleId,Integer stubId){

       List<Resource> resourceList= roleService.findResourceOperation(roleId,stubId);

        return new JsonResult(true,"操作成功").addList(resourceList).toJson();
    }

    /**
     * 更新角色权限,并指定是哪个客户系统
     * @return
     */
    @RequestMapping(value = "/roles/{roleId}/{stubId}",method = RequestMethod.PUT)
    @ResponseBody
    public String savePermission(@PathVariable("roleId") Integer roleId,int[] permissionIds,@PathVariable("stubId") Integer stubId){

        roleService.grantRoleOperation(roleId,permissionIds,stubId);

        return new JsonResult(true,"操作成功").toJson();
    }

    /**
     * 删除角色
     * @param ids
     * @return
     */
    @RequestMapping(value = "/roles/{ids}",method =RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable("ids") int[] ids){
        try{
            roleService.delete(ids);
            return new JsonResult(true).toJson();
        }catch (Exception e){
            return new JsonResult(false,e.getMessage()).toJson();
        }
    }

}
