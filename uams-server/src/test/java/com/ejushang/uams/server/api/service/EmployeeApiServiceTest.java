package com.ejushang.uams.server.api.service;

import com.ejushang.uams.api.dto.EmployeeDto;
import com.ejushang.uams.server.BaseTest;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.util.JsonUtil;
import com.ejushang.uams.server.domain.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static org.hamcrest.MatcherAssert.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 * User: liubin
 * Date: 14-3-10
 */
public class EmployeeApiServiceTest extends BaseTest {

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private EmployeeApiService employeeApiService;

    @Test
    @Transactional
    @Rollback(false)
    public void test() throws InterruptedException {

        Stub stub = new Stub();
        stub.setName(RandomStringUtils.randomAlphabetic(6) + "name");
        generalDAO.save(stub);

        Employee employee = new Employee();
        employee.setUsername(RandomStringUtils.randomAlphabetic(6) + "username");

        EmployeeInfo employeeInfo = new EmployeeInfo();
        employeeInfo.setName(RandomStringUtils.randomAlphabetic(6) + "name");
        employee.setEmployeeInfo(employeeInfo);

        generalDAO.save(employee);
        generalDAO.flush();

        //如果login()方法完善了,需要加上密码
        EmployeeDto employeeDto = employeeApiService.login(String.valueOf(stub.getId()), employee.getUsername(), null);
        assertThat(employeeDto, notNullValue());
        assertThat(employeeDto.getId(), is(employee.getId()));
        assertThat(employeeDto.getUsername(), is(employee.getUsername()));
        assertThat(employeeDto.getStatus(), is(employee.getStatus()));

        assertDtoEqualsThroughJson(employeeDto);

    }

    /**
     * 测试对象能正常转成json
     * @param origin
     */
    private void assertDtoEqualsThroughJson(Object origin) {
        Object after = JsonUtil.json2Object(JsonUtil.objectToJson(origin), origin.getClass());
        assertThat(EqualsBuilder.reflectionEquals(origin, after, true), is(true));
    }


}
