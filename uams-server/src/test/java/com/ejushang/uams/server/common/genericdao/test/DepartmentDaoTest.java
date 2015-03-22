//package com.ejushang.uams.server.common.genericdao.test;
//
//import com.ejushang.uams.server.BaseTest;
//import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
//import com.ejushang.uams.server.department.service.DepartmentService;
//import com.ejushang.uams.server.domain.Department;
//import org.junit.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.transaction.annotation.Transactional;
//
///**
// * Created with IntelliJ IDEA.
// * User: Joyce.qu
// * Date: 14-3-19
// * Time: 下午2:33
// * To change this template use File | Settings | File Templates.
// */
//public class DepartmentDaoTest extends BaseTest{
//
//    @Autowired
//    private GeneralDAO generalDAO;
//    @Autowired
//    private DepartmentService departmentService;
//    @Autowired
//    private RoleApiService roleApiService;
//
//    @Test
//    @Transactional
//    @Rollback(false)
//    public void testSave(){
//        Department parentDepartment = new Department();
//        parentDepartment.setId(1);
//        Department department = new Department();
//        department.setCode("002");
//        department.setName("技术部子部");
//        department.setParentId(1);
//        department.setParent(parentDepartment);
//        departmentService.save(department);
//
//    }
//
//    @Test
//    @Transactional
//    @Rollback(false)
//    public void testRole(){
//        roleApiService.findRoles(29);
//    }
//}
