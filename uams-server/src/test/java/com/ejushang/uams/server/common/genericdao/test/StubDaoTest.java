package com.ejushang.uams.server.common.genericdao.test;

import com.ejushang.uams.server.BaseTest;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.domain.Role;
import com.ejushang.uams.server.domain.Stub;
import com.ejushang.uams.server.domain.StubRole;
import com.ejushang.uams.server.stub.service.StubService;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-14
 * Time: 下午2:18
 */
public class StubDaoTest extends BaseTest {

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private StubService stubService;

    @Test
    @Transactional
    @Rollback(false)
    public void testStub(){

//        Stub stub=new Stub();
//        stub.setName(RandomStringUtils.randomAlphabetic(6) + "name");
//        stub.setUniqueNo("crm");
//        stub.setPassword("111111");
//        stubService.save(stub);

        Role role=new Role();
        role.setName("打酱油的");
        generalDAO.save(role);

//        StubRole stubRole=new StubRole();
//        stubRole.setStub(stub);
//        stubRole.setStubId(stub.getId());
//        stubRole.setRole(role);
//        stubRole.setRoleId(role.getId());
//        generalDAO.save(stubRole);



    }
}
