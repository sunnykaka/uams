package com.ejushang.uams.server.api.web;

import com.ejushang.uams.api.dto.EmployeeDto;
import com.ejushang.uams.api.dto.ResourceDto;
import com.ejushang.uams.server.api.service.EmployeeApiService;
import com.ejushang.uams.server.api.service.StubApiService;
import com.ejushang.uams.server.common.util.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * User: liubin
 * Date: 14-3-18
 */
@Controller
@RequestMapping("/api")
public class StubApiController {

    @Autowired
    private StubApiService stubApiService;

    @RequestMapping("/stubs/file/sync")
    @ResponseBody
    public Boolean fileSync(String uniqueNo, String file) {

        return stubApiService.syncFile(uniqueNo,file);

    }

    @RequestMapping("/stubs/resources")
    @ResponseBody
    public List<ResourceDto> findAllResourceDto(String uniqueNo){
        return stubApiService.findAll(uniqueNo);
    }


}