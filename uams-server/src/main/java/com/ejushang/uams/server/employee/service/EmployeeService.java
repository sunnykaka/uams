package com.ejushang.uams.server.employee.service;

import com.ejushang.uams.enumer.EmployeeStatus;
import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Filter;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.common.util.PoiUtil;
import com.ejushang.uams.server.common.util.StringUtil;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.role.service.RoleService;
import com.ejushang.uams.util.NumberUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.shiro.crypto.RandomNumberGenerator;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.transaction.Transaction;
import java.io.IOException;
import java.util.*;


/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-3-17
 * Time: 上午9:23
 * To change this template use File | Settings | File Templates.
 */
@Service
public class EmployeeService {
    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private RoleService roleService;

    private final static String DEFAULTPASSWORD = "111111";

    RandomNumberGenerator rng = new SecureRandomNumberGenerator();


    @Transactional                //新增员工
    public void save(Employee employee, String[] roleIds, String newPassword) {
        if (isUsernameExist(employee)) {
            throw new UamsBusinessException("员工名已存在");
        }
        if (StringUtils.isBlank(employee.getEmployeeInfo().getName())) {
            throw new UamsBusinessException("真实姓名不能为空");
        }

        employee.setRootUser(false);
        if (!NumberUtil.isNullOrZero(employee.getId()) && StringUtils.isBlank(newPassword)) {    /**当操作是更新 且 不更改密码时**/
            employee.setPassword(employee.getPassword());
            employee.setSalt(employee.getSalt());
        } else {
            String salt = rng.nextBytes().toBase64();
            employee.setPassword(new Sha256Hash(newPassword, salt).toBase64());
            employee.setSalt(salt);
        }
        generalDAO.save(employee);

        Integer employeeId = employee.getId();
        if (findEmployeeRole(employeeId) != null && !findEmployeeRole(employeeId).isEmpty()) {
            deleteEmployeeRole(employeeId);
        }
        if (roleIds != null && roleIds.length != 0) {
            for (String roleId : roleIds) {
                EmployeeRole employeeRole = new EmployeeRole();
                employeeRole.setRoleId(Integer.parseInt(roleId));
                employeeRole.setEmployeeId(employeeId);
                generalDAO.save(employeeRole);
            }
        }

    }


    @Transactional(readOnly = true)     //判断员工是否存在
    public boolean isUsernameExist(Employee employee) {
        Department department = employee.getDepartment();
        if (department != null && NumberUtil.isNullOrZero(department.getId())) {
            employee.setDepartment(null);
        }
        Search search = new Search(Employee.class).addFilterEqual("username", employee.getUsername());
        int count = generalDAO.count(search);
        if (count == 0) {
            return false;
        }
        if (count > 0 && NumberUtil.isNullOrZero(employee.getId())) {
            return true;
        }
        if (count > 1 && !NumberUtil.isNullOrZero(employee.getId())) {
            return true;
        }
        return false;
    }


    @Transactional(readOnly = true)  //根据员工ID查找员工
    public Employee get(Integer id) {
        Search search = new Search(Employee.class).addFetch("employeeInfo").addFilterEqual("id", id);
        return (Employee) generalDAO.searchUnique(search);
    }

    @Transactional    //根据条件查找员工
    public List<Employee> findByKey(String searchType, String searchValue, Page page) {
        Search search = new Search(Employee.class).addFetch("employeeInfo").addSortDesc("createTime").addPagination(page);
        if (StringUtils.isBlank(searchValue)) {
            return generalDAO.search(search);
        }
        if (!StringUtils.isBlank(searchType) && searchType.equals("username")) {
            search.addFilterLike("username", "%" + searchValue + "%");
        }
        if (!StringUtils.isBlank(searchType) && searchType.equals("name")) {
            search.addFilterLike("employeeInfo.name", "%" + searchValue + "%");
        }
        if (!StringUtils.isBlank(searchType) && searchType.equals("tel")) {
            search.addFilterLike("employeeInfo.tel", "%" + searchValue + "%");
        }
        if (!StringUtils.isBlank(searchType) && searchType.equals("number")) {
            search.addFilterEqual("employeeInfo.number", searchValue);
        }
        return generalDAO.search(search);
    }

    @Transactional(readOnly = true)  //根据用户名查询指定员工
    public Employee findByName(String username) {
        Search search = new Search(Employee.class).addFetch("employeeInfo").addFilterEqual("username", username);
        return (Employee) generalDAO.searchUnique(search);
    }

    @Transactional  //删除指定员工的所有角色
    public void deleteEmployeeRole(Integer employeeId) {
        Search search = new Search(EmployeeRole.class).addFilterEqual("employeeId", employeeId);
        List<EmployeeRole> employeeRoleList = generalDAO.search(search);
        for (int i = 0; i < employeeRoleList.size(); i++) {
            generalDAO.remove(employeeRoleList.get(i));
        }
    }

    @Transactional //查询制定员工的所有角色
    public List<EmployeeRole> findEmployeeRole(Integer employeeId) {
        Search search = new Search(EmployeeRole.class).addFilterEqual("employeeId", employeeId);
        return generalDAO.search(search);
    }

    @Transactional //给所有角色标记该员工所具有的角色
    public List<Role> changeAllRoleStatus(Integer id) {
        List<EmployeeRole> employeeRoles = findEmployeeRole(id);
        List<Role> roles = roleService.findAllRoles();
        for (int i = 0; i < roles.size(); i++) {
            roles.get(i).setStatus(false);
            for (int j = 0; j < employeeRoles.size(); j++) {
                if (roles.get(i).getId().equals(employeeRoles.get(j).getRoleId())) {
                    roles.get(i).setStatus(true);
                }
            }
        }
        return roles;
    }

    @Transactional(readOnly = true) //根据角色名称查询员工
    public List<Employee> findEmployeeByRole(String roleName) {
        List<Employee> employees = new ArrayList<Employee>();
        Search search = new Search(EmployeeRole.class);
        search.addFilterEqual("role.name",roleName);
        List<EmployeeRole> employeeRoleList = generalDAO.search(search);
        if (employeeRoleList==null || employeeRoleList.size()==0) {
            return employees;
        }
        for (EmployeeRole employeeRole:employeeRoleList) {
            Employee employee = get(employeeRole.getEmployeeId());
            employees.add(employee);
        }
        return employees;
    }

    @Transactional(readOnly = true)     //根据员工的用户名或者真实姓名模糊查询员工
    public List<Employee> findEmployeeByName(String username, String name) {
        Search search = new Search(Employee.class);
        if (!StringUtils.isBlank(username)) {
            search.addFilterLike("username", "%" + username + "%");
        }
        if (!StringUtils.isBlank(name)) {
            search.addFilterLike("employeeInfo.name", "%" + name + "%");
        }
        return generalDAO.search(search);
    }

    @Transactional
    public void updateStatus(Integer id, String status) {
        Employee employee = get(id);
        employee.setStatus(EmployeeStatus.valueOf(status));
        generalDAO.save(employee);
    }


    @Transactional
    public void initRootUser() {
        Search search = new Search(Employee.class).addFilterOr(Filter.equal("rootUser", true), Filter.equal("username", "admin"));
        int count = generalDAO.count(search);
        if (count > 0) return;
        Employee employee = new Employee();
        employee.setUsername("admin");
        String salt = rng.nextBytes().toBase64();
        employee.setPassword(new Sha256Hash("111111", salt).toBase64());
        employee.setSalt(salt);
        employee.setStatus(EmployeeStatus.NORMAL);
        employee.setRootUser(true);

        EmployeeInfo employeeInfo = new EmployeeInfo();
        employeeInfo.setName("超级管理员");
        employee.setEmployeeInfo(employeeInfo);

        generalDAO.save(employee);
    }

    @Transactional
    public void uploadExcel(CommonsMultipartFile file) throws IOException {
        Workbook workbook = null;
        try {
            workbook = new XSSFWorkbook(file.getInputStream());
        } catch (Exception e) {
            workbook = new HSSFWorkbook(file.getInputStream());
        }
        Sheet sheet = workbook.getSheetAt(workbook.getFirstVisibleTab());
        int rowNum = sheet.getLastRowNum();
        int firstRow = 1;
        for (int ri = firstRow; ri <= rowNum; ri++) {
            Row row = sheet.getRow(ri);
            Employee employee = new Employee();
            EmployeeInfo employeeInfo = new EmployeeInfo();
            employeeInfo.setNumber(PoiUtil.getStringCellValue(row, 2));
            employeeInfo.setName(PoiUtil.getStringCellValue(row, 3));
            String tel =PoiUtil.getStringCellValue(row, 5);
            employeeInfo.setTel(StringUtil.telString(tel));
            employeeInfo.setEmail(PoiUtil.getStringCellValue(row, 6));
            employee.setUsername(PoiUtil.getStringCellValue(row, 4));
            String roleNames = PoiUtil.getStringCellValue(row, 7);
            Set<String> roleIdSet = new HashSet<String>();
            if (!StringUtils.isBlank(roleNames)) {
                String[] roleNameArr = roleNames.split(",");
                if (roleNameArr != null && roleNameArr.length > 0) {
                    for (int i = 0; i < roleNameArr.length; i++) {
                        String roleName = roleNameArr[i];
                        Role role = roleService.getByName(roleName);
                        if (role != null) {
                            roleIdSet.add(String.valueOf(role.getId()));
                        }
                    }
                }
            }
            employee.setEmployeeInfo(employeeInfo);
            if (!isUsernameExist(employee)) {
                save(employee, roleIdSet.toArray(new String[0]), DEFAULTPASSWORD);
            } else {
                Employee oldEmployee = findByName(employee.getUsername());
                oldEmployee.getEmployeeInfo().setNumber(employee.getEmployeeInfo().getNumber());
                oldEmployee.getEmployeeInfo().setName(employee.getEmployeeInfo().getName());
                oldEmployee.getEmployeeInfo().setTel(employee.getEmployeeInfo().getTel());
                oldEmployee.getEmployeeInfo().setEmail(employee.getEmployeeInfo().getEmail());
                save(oldEmployee, roleIdSet.toArray(new String[0]), DEFAULTPASSWORD);
            }
        }
    }
}
