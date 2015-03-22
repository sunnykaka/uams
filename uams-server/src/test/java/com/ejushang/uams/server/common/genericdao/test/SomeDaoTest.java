package com.ejushang.uams.server.common.genericdao.test;

import com.ejushang.uams.server.BaseTest;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.common.util.JsonUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.Matchers.is;

/**
 * User: liubin
 * Date: 14-3-10
 */
public class SomeDaoTest extends BaseTest {

    @Autowired
    private GeneralDAO generalDAO;

    @Test
    @Transactional
    @Rollback(false)
    public void test() throws InterruptedException {

        Employee employee = new Employee();
        employee.setUsername(RandomStringUtils.randomAlphabetic(6) + "username");

        EmployeeInfo employeeInfo = new EmployeeInfo();
        employeeInfo.setName(RandomStringUtils.randomAlphabetic(6) + "name");
        employee.setEmployeeInfo(employeeInfo);

        Department department = new Department();
        department.setName(RandomStringUtils.randomAlphabetic(6) + "name");
        generalDAO.save(department);
        employee.setDepartmentId(department.getId());

        Role role = new Role();
        role.setName(RandomStringUtils.randomAlphabetic(6) + "name");
        generalDAO.save(role);

        generalDAO.save(employee);
        assertThat(employee.getId(), notNullValue());
        assertThat(employeeInfo.getId(), notNullValue());

        EmployeeRole employeeRole = new EmployeeRole();
        employeeRole.setEmployeeId(employee.getId());
        employeeRole.setRoleId(role.getId());
        generalDAO.save(employeeRole);

        generalDAO.flush();
        generalDAO.getSession().evict(employee);
        generalDAO.getSession().evict(role);
        Employee employeeReload = generalDAO.get(Employee.class, employee.getId());
        Role roleReload = generalDAO.get(Role.class, role.getId());
        Page<Employee> page = new Page<Employee>(1, 10);
        List<Employee> employees = generalDAO.search(new Search(Employee.class).addPagination(page));
        assertThat(!employees.isEmpty(), is(true));
        assertThat(page.getResult(), is(employees));

        assertEmployeeEquals(employee, employeeReload);
        assertDepartmentEquals(department, employeeReload.getDepartment());
        assertEmployeeInfoEquals(employeeInfo, employeeReload.getEmployeeInfo());

        assertThat(employeeReload.getEmployeeRoleList().size(), is(1));
        assertThat(roleReload.getEmployeeRoleList().size(), is(1));

        assertThat(StringUtils.isBlank(JsonUtil.objectToJson(employeeReload)), is(false));
        System.out.println(JsonUtil.objectToJson(employeeReload));

    }
//
//    @Test
//    @Transactional
//    @Rollback(false)
//    public void testJson() {
//        List<Employee> employees = generalDAO.findAll(Employee.class);
//        assert
//    }

    private void assertEmployeeEquals(Employee expect, Employee actual) {
        assertThat(actual.getId(), is(expect.getId()));
        assertThat(actual.getUsername(), is(expect.getUsername()));
        assertThat(actual.getPassword(), is(expect.getPassword()));
        assertThat(actual.getSalt(), is(expect.getSalt()));
        assertThat(actual.getStatus(), is(expect.getStatus()));
        assertDateEquals(expect.getCreateTime(), actual.getCreateTime());
        assertDateEquals(expect.getUpdateTime(), actual.getUpdateTime());
        assertThat(actual.getDepartmentId(), is(expect.getDepartmentId()));
    }

    private void assertDepartmentEquals(Department expect, Department actual) {
        assertThat(actual.getId(), is(expect.getId()));
        assertThat(actual.getCode(), is(expect.getCode()));
        assertThat(actual.getName(), is(expect.getName()));
    }

    /**
     * 判断日期时间是否一样,解决Timestamp类型和java.util.Date互相equals永远为false的问题
     * @param expect
     * @param actual
     */
    private void assertDateEquals(Date expect, Date actual) {
        if(expect != null && actual != null) {
            assertThat(actual.getTime(), is(expect.getTime()));
        } else {
            assertThat(actual, is(expect));
        }
    }

    private void assertEmployeeInfoEquals(EmployeeInfo expect, EmployeeInfo actual) {
        assertThat(actual.getId(), is(expect.getId()));
        assertThat(actual.getName(), is(expect.getName()));
        assertThat(actual.getAddress(), is(expect.getAddress()));
        assertThat(actual.getAge(), is(expect.getAge()));
        assertThat(actual.getEmail(), is(expect.getEmail()));
        assertThat(actual.getPosition(), is(expect.getPosition()));
        assertThat(actual.getNumber(), is(expect.getNumber()));
        assertThat(actual.getSex(), is(expect.getSex()));
        assertThat(actual.getTel(), is(expect.getTel()));

    }

}
