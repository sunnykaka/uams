package com.ejushang.uams.server.common.genericdao.test;

import com.ejushang.uams.server.BaseTest;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.resource.service.ResourceService;
import com.ejushang.uams.server.role.service.RoleService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-12
 * Time: 下午2:21
 */
public class RoleDaoTest extends BaseTest{

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private ResourceService resourceService;

    @Test
    @Transactional
    @Rollback(false)
    public void test() {
        Role role=new Role();
        role.setName("ssa");
        generalDAO.save(role);

        Role role2 = generalDAO.get(Role.class, role.getId());
        role2.setName("bbb");
        role2.setUpdateTime(new Date());
        generalDAO.save(role2);

        Role role3 = generalDAO.get(Role.class, role.getId());
        List<Role> roles = generalDAO.query("select r from Role r where r.id = ?", null, role3.getId());
    }

    @Test
     @Transactional
     @Rollback(false)
     public void testEmployeeRole() {
        Role role=new Role();
        role.setName("sss");
        generalDAO.save(role);

        EmployeeRole employeeRole=new EmployeeRole();
        employeeRole.setRoleId(role.getId());
        employeeRole.setRole(role);
        employeeRole.setEmployeeId(generalDAO.get(Employee.class,3).getId());
        employeeRole.setEmployee(generalDAO.get(Employee.class,3));
        generalDAO.save(employeeRole);

    }

    @Test
    @Transactional
    @Rollback(false)
    public void testRole() {
        Role role=new Role();
        role.setName("fff");
        generalDAO.save(role);

        StubRoleOperation roleOperation=new StubRoleOperation();
//        roleOperation.setRoleId(role.getId());
//        roleOperation.setRole(role);
        roleOperation.setOperationId(3);
        roleOperation.setOperation(generalDAO.get(Operation.class,3));
        generalDAO.save(roleOperation);

    }

    @Test
    @Transactional
    @Rollback(false)
    public void testStubRole() {
        Role role=new Role();
        role.setName("fff");
        generalDAO.save(role);

        Stub stub=new Stub();
        stub.setName("fre");
        stub.setCreateTime(new Date());
        stub.setPassword("111222");
        stub.setUniqueNo("wwtt");
        generalDAO.save(stub);

        StubRole stubRole=new StubRole();
        stubRole.setRoleId(role.getId());
        stubRole.setRole(role);
        stubRole.setStubId(stub.getId());
        stubRole.setStub(stub);
        generalDAO.save(stubRole);

    }

    @Test
    @Transactional
    @Rollback(false)
    public void testResource() {

        Resource resource=new Resource();
        resource.setName("部门管理");
        resource.setStubId(1);
        resource.setStub(generalDAO.get(Stub.class,2));
        resource.setUniqueKey("sw_department");
        resource.setModule("/department");
        generalDAO.save(resource);

//        Operation operation=new Operation();
//        resource.setStubId(1);
//        resource.setStub(generalDAO.get(Stub.class,2));
//        operation.setResourceId(resource.getId());
//        operation.setResource(resource);
//        operation.setName("查询角色");
//        generalDAO.save(operation);
//
//        Operation operation2=new Operation();
//        operation.setResourceId(resource.getId());
//        resource.setStubId(1);
//        resource.setStub(generalDAO.get(Stub.class,2));
//        operation.setResource(resource);
//        operation2.setName("删除角色");
//        operation2.setRequired("查询角色");
//        generalDAO.save(operation2);
//
//        Operation operation1=new Operation();
//        resource.setStubId(1);
//        resource.setStub(generalDAO.get(Stub.class,2));
//        operation.setResourceId(resource.getId());
//        operation.setResource(resource);
//        operation1.setName("修改角色");
//        operation1.setRequired("查询角色，删除角色");
//        generalDAO.save(operation1);

//        List<Resource> resourceList=roleService.findAllResource();
//        for(Resource resource1:resourceList){
//                System.out.println(resource.getId()+"/"+resource.getStubId()+"/"+resource.getOperationList());
//        }
    }

//    @Test
//    @Transactional
//    @Rollback(false)
//    public void testORole() {
//       StubRoleOperation roleOperation=new StubRoleOperation();
//        roleOperation.setOperationId(1);
//        roleOperation.setOperation(generalDAO.get(Operation.class,1));
//        roleOperation.setRoleId(2);
//        roleOperation.setRole(generalDAO.get(Role.class,2));
//        generalDAO.save(roleOperation);
//
//        StubRoleOperation roleOperation1=new StubRoleOperation();
//        roleOperation1.setOperationId(2);
//        roleOperation1.setOperation(generalDAO.get(Operation.class,2));
//        roleOperation1.setRoleId(2);
//        roleOperation1.setRole(generalDAO.get(Role.class,2));
//        generalDAO.save(roleOperation1);
//
//        StubRoleOperation roleOperation2=new StubRoleOperation();
//        roleOperation2.setOperationId(2);
//        roleOperation2.setOperation(generalDAO.get(Operation.class,2));
//        roleOperation2.setRoleId(1);
//        roleOperation2.setRole(generalDAO.get(Role.class,1));
//        generalDAO.save(roleOperation2);
//
//        StubRoleOperation roleOperation3=new StubRoleOperation();
//        roleOperation3.setOperationId(2);
//        roleOperation3.setOperation(generalDAO.get(Operation.class,2));
//        roleOperation3.setRoleId(1);
//        roleOperation3.setRole(generalDAO.get(Role.class,1));
//        generalDAO.save(roleOperation3);
//    }

    @Test
    public void testMd5(){
        String file="金泰";
        // 拿到一个MD5转换器
        MessageDigest messageDigest = null;
        String md5=null;
        try {
            messageDigest = MessageDigest.getInstance("MD5");
            // 输入的字符串转换成字节数组
            byte[] inputByteArray =file.getBytes();
            // inputByteArray是输入字符串转换得到的字节数组
            messageDigest.update(inputByteArray);
            // 转换并返回结果，也是字节数组，包含16个元素
            byte[] resultByteArray = messageDigest.digest();
            // 字符数组转换成字符串返回
            md5= byteArrayToHex(resultByteArray);
           System.out.println(md5);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

    }

    public static String byteArrayToHex(byte[] byteArray) {

        // 首先初始化一个字符数组，用来存放每个16进制字符
        char[] hexDigits = {'0','1','2','3','4','5','6','7','8','9', 'A','B','C','D','E','F' };

        // new一个字符数组，这个就是用来组成结果字符串的（解释一下：一个byte是八位二进制，也就是2位十六进制字符（2的8次方等于16的2次方））
        char[] resultCharArray =new char[byteArray.length * 2];

        // 遍历字节数组，通过位运算（位运算效率高），转换成字符放到字符数组中去
        int index = 0;
        for (byte b : byteArray) {
            resultCharArray[index++] = hexDigits[b>>> 4 & 0xf];
            resultCharArray[index++] = hexDigits[b& 0xf];
        }
        // 字符数组组合成字符串返回
        return new String(resultCharArray);
    }


    @Test
    public void testStubString(){
        String newRequired="qqqq,aaa,";
        if(newRequired.endsWith(",")){
            newRequired=newRequired.substring(0,newRequired.length()-1);
        }
        System.out.println(newRequired);
    }

    @Test
    public void findOperation(){
       // List<Operation> operationList= resourceService.findOperationByResourceId(689);
        List<Operation> operationList=resourceService.findAllOperation(1);
        System.out.println(operationList.size());
    }

//    @Test
//    public void findOp(){
//        Operation operation=resourceService.findOperationById(1511);
//        System.out.println(operation.getId()+"/"+operation.getName());
//    }

    @Test
    public void findRe(){
//        List<Integer> params = new ArrayList<Integer>();
//        params.add(17);
//        params.add(1);
////        StringBuilder hql=new StringBuilder("select r from Resource r left join r.operationList o "+
////                                            "left join o.roleOperationList sro left join sro.stubRole sr " +
////                                            "with sr.roleId=17 and r.stubId=1");
//        StringBuilder hql=new StringBuilder("select r from Resource r where id in " +
//                "(select o.resourceId from Operation o  where id in " +
//                "(select sro.operationId from StubRoleOperation sro where sro.stubRoleId in " +
//                "(select id from StubRole sr where sr.roleId=? and sr.stubId=?)))");
//
//        List<Resource> resourceList=generalDAO.query(hql.toString(),null,params.toArray());
        List<Resource> resourceList=resourceService.getResourceByRoleStub(18,4);

        System.out.println(resourceList.size());
        for(Resource resource:resourceList){

            System.out.println(resource.getName());
        }
    }

    }
