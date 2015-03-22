package com.ejushang.uams.server.api.service;

import com.ejushang.uams.api.dto.ErrorCode;
import com.ejushang.uams.api.dto.OperationDto;
import com.ejushang.uams.api.dto.ResourceDto;
import com.ejushang.uams.exception.UamsApiException;
import com.ejushang.uams.server.api.util.MD5Util;
import com.ejushang.uams.server.api.util.ResourceUtil;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.jaxb.Permissions;
import com.ejushang.uams.server.permission.PermissionService;
import com.ejushang.uams.server.resource.service.ResourceService;
import com.ejushang.uams.server.stub.service.StubService;
import com.google.common.collect.Sets;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import java.io.StringReader;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import static com.ejushang.uams.server.api.util.MD5Util.findFileMD5;

/**
 * 客户系统api接口相关服务
 * User: liubin
 * Date: 14-3-18
 */
@Service
public class StubApiService {

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private StubService stubService;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private PermissionService permissionService;


    private static final Logger log = LoggerFactory.getLogger(StubApiService.class);
    /**
     * 查询uniqueNo是否在系统存在
     * @param uniqueNo
     */
    @Transactional(readOnly = true)
    public void checkStubExist(String uniqueNo) {
        if(uniqueNo == null) {
            throw new UamsApiException(ErrorCode.UNIQUE_NO_NOT_EXIST);
        }

        //TODO find in stubService
        Stub stub =stubService.findStubByUniqueNo(uniqueNo);
        if(stub == null) {
            throw new UamsApiException(ErrorCode.STUB_NOT_EXIST);
        }

    }

    @Transactional(readOnly = true)
    public List<ResourceDto> findAll(String uniqueNo){
        ResourceUtil resourceUtil = new ResourceUtil();
        List<ResourceDto> resourceDtos = new ArrayList<ResourceDto>();
        Stub stub = stubService.findStubByUniqueNo(uniqueNo);
        Integer stubId = stub.getId();
        List<Resource> resources = resourceService.findResourceByStubId(stubId);
        return resourceUtil.getResourceDtos(resources);
    }




    /**
     * 同步权限文件
     * @param uniqueNo
     * @param file
     * @return
     */
    @Transactional
    public Boolean syncFile(String uniqueNo, String file){
        checkStubExist(uniqueNo);
        return stubService.syncFile(uniqueNo,file);
    }

}
