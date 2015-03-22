package com.ejushang.uams.server.resource.web;

import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.domain.Operation;
import com.ejushang.uams.server.resource.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * User:moon
 * Date: 14-3-20
 * Time: 上午11:35
 */
@Controller
public class ResourceController extends BaseController {

    @Autowired
    private ResourceService resourceService;

    /**
     *  模块页面
     * @return
     */
    @RequestMapping(value = "/operation",method = RequestMethod.GET)
    @ResponseBody
    public String getResource(Integer stubId){
        List<Operation> resourceList=resourceService.findAllOperation(stubId);
        return   new JsonResult(true).addList(resourceList).toJson();
    }

    /**
     * 查询相关联的的操作
     * @param id
     * @param status
     * @return
     */
    @RequestMapping(value="/operation/{id}",method = RequestMethod.POST)
    @ResponseBody
    public String findLinkOperation(@PathVariable("id") Integer id,String status,Integer stubId) {

        List<Integer> integerList=resourceService.findLinkOperation(id,status,stubId);
        return  new JsonResult(true).addList(integerList).toJson();
    }
}
