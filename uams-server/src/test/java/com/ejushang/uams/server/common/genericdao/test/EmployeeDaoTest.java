//package com.ejushang.uams.server.common.genericdao.test;
//
//import com.ejushang.uams.server.BaseTest;
//import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
//import com.ejushang.uams.server.domain.Employee;
//import com.ejushang.uams.server.employee.service.EmployeeService;
//import org.junit.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.ArrayList;
//import java.util.Iterator;
//import java.util.List;
//
///**
// * Created with IntelliJ IDEA.
// * User: Joyce.qu
// * Date: 14-3-17
// * Time: 上午9:25
// * To change this template use File | Settings | File Templates.
// */
//public class EmployeeDaoTest extends BaseTest{
//
//    @Autowired
//    private GeneralDAO generalDAO;
//    @Autowired
//    private EmployeeService employeeService;
//
////    @Test
////    @Transactional
////    @Rollback(false)
////    public void testSave(){
//
////        for (int i=0;i<=14;i++){
////          Employee emp = new Employee();
////          emp.setUsername("第"+i+"个");
////          emp.setPassword("123");
////          emp.setDepartmentId(1244343243);
////          employeeService.save(emp);
////        }
////   }
//
////    @Test
////    @Transactional
////    @Rollback(false)
////    public void testRemove(){
////        Employee emp = new Employee();
////        emp.setId(4);
////        employeeService.remove(emp);
////    }
//
//    @Test
//    @Transactional
//    public void testSelect(){
//          Employee emp =employeeService.findById(4);
//        System.out.println(emp.getUsername());
//    }
//
////    @Test
////    @Transactional
////    public void testSelectAll(){
////        List<Employee> employeeList = new ArrayList<Employee>();
////        employeeList = employeeService.findAll();
////        for(Iterator<Employee> employeeIterator = employeeList.iterator();employeeIterator.hasNext();){
////            System.out.println(employeeIterator.next().getUsername());
////        }
////    }
//
//
//}
