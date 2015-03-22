package com.ejushang.uams.server.stub.web;

import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.page.PageFactory;
import com.ejushang.uams.server.common.util.JsonResult;
import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.domain.SyncLog;
import com.ejushang.uams.server.stub.service.StubService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.ejushang.uams.server.domain.Stub;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-14
 * Time: 下午1:30
 */
@Controller
public class StubController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(StubController.class);

    @Autowired
    private StubService stubService;

    /**
     * 查询所有stub
     * @param request
     * @return
     */
    @RequestMapping(value = "/stubs",method = RequestMethod.GET)
    @ResponseBody
    public String list(HttpServletRequest request,String name) {

        Page page = PageFactory.getPage(request);
        stubService.findByKey(page,name);

        return new JsonResult(true).addObject(page).toJson();
    }

    /**
     * 添加stub
     * @param
     * @return
     */
    @RequestMapping(value ="/stubs",method = RequestMethod.POST)
    @ResponseBody
    public String save( Stub stub) {

           stubService.save(stub);

        return new JsonResult(true).toJson();
    }

    /**
     * 更新stub
     * @param
     * @return
     */
    @RequestMapping(value ="/stubs/{id}",method =RequestMethod.PUT)
    @ResponseBody
    public String update(@ModelAttribute("id") Stub stub) {

        stubService.save(stub);

        return new JsonResult(true).toJson();
    }

    /**
     * 删除stub
     * @param
     * @return
     */
    @RequestMapping(value ="/stubs/{ids}",method =RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable("ids") int[] ids) {

        stubService.delete(ids);

        return new JsonResult(true).toJson();
    }

    /**
     * 查询记录
     * @param
     * @return
     */
    @RequestMapping(value ="/syncLog",method =RequestMethod.GET)
    @ResponseBody
    public String getSyncLog() {

      List<SyncLog> syncLogList= stubService.findSyncLog();

        return new JsonResult(true).addList(syncLogList).toJson();
    }




}
