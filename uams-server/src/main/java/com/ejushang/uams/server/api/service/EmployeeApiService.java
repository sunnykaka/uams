package com.ejushang.uams.server.api.service;

import com.ejushang.uams.api.dto.*;
import com.ejushang.uams.enumer.EmployeeStatus;
import com.ejushang.uams.exception.UamsApiException;
import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.api.util.ResourceUtil;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.employee.service.EmployeeService;
import com.ejushang.uams.server.resource.service.ResourceService;
import com.ejushang.uams.server.role.service.RoleService;
import com.ejushang.uams.server.stub.service.StubService;
import com.ejushang.uams.util.NumberUtil;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 员工api接口相关服务
 * User: liubin
 * Date: 14-3-18
 */
@Service
public class EmployeeApiService {

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private StubApiService stubApiService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private StubService stubService;

    /**
     * 员工登录
     * @param uniqueNo
     * @param username
     * @param password
     * @return
     */
    @Transactional(readOnly = true)
    public EmployeeDto login(String uniqueNo, String username, String password) {
        stubApiService.checkStubExist(uniqueNo);
        Employee employee = employeeService.findByName(username);
        //TODO replace by code below
        if(employee == null) {
            throw new UamsApiException(ErrorCode.USERNAME_PASSWORD_MISMATCH);
        } else{
            String salt = employee.getSalt();
            String passwordInput = (new Sha256Hash(password, salt).toBase64());
            if (passwordInput.equals(employee.getPassword())){
                if(employee.getStatus().equals(EmployeeStatus.FROZEN)) {
                    throw new UamsApiException(ErrorCode.EMPLOYEE_FROZEN);
                }
                EmployeeDto employeeDto = buildEmployeeDto(employee);
                return employeeDto;
            }else {
                throw new UamsApiException(ErrorCode.USERNAME_PASSWORD_MISMATCH);
            }
        }
   }

    @Transactional(readOnly = true)
    public List<EmployeeDto> findEmployeeByName(String uniqueNo, String username, String name) {
        stubApiService.checkStubExist(uniqueNo);
        List<Employee> employees = employeeService.findEmployeeByName(username,name);
        List<EmployeeDto> employeeDtos = new ArrayList<EmployeeDto>();
        for (Employee employee : employees) {
            EmployeeDto employeeDto = buildEmployeeDto(employee);
            employeeDtos.add(employeeDto);
        }
        return employeeDtos;
    }

    private EmployeeDto buildEmployeeDto(Employee employee) {
        EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setUsername(employee.getUsername());
        employeeDto.setStatus(employee.getStatus());
        employeeDto.setId(employee.getId());
        employeeDto.setRootUser(employee.getRootUser());
        employeeDto.setName(employee.getEmployeeInfo().getName());
        employeeDto.setEmail(employee.getEmployeeInfo().getEmail());
        employeeDto.setTel(employee.getEmployeeInfo().getTel());
        employeeDto.setNumber(employee.getEmployeeInfo().getNumber());
        employeeDto.setAddress(employee.getEmployeeInfo().getAddress());
        employeeDto.setAge(employee.getEmployeeInfo().getAge());
        employeeDto.setCreateTime(employee.getCreateTime());
        employeeDto.setDepartmentId(employee.getDepartmentId());
        employeeDto.setPosition(employee.getEmployeeInfo().getPosition());
        employeeDto.setSex(employee.getEmployeeInfo().getSex());
        employeeDto.setUpdateTime(employee.getUpdateTime());
        return employeeDto;
    }

    @Transactional (readOnly = true)
    public List<EmployeeDto> findEmployeeByRole (String uniqueNo,String roleName) {
        List<EmployeeDto> employeeDtos = new ArrayList<EmployeeDto>();
        List<Employee> employees = employeeService.findEmployeeByRole(roleName);
        if (employees==null || employees.size()==0) {
            throw new UamsApiException(ErrorCode.EMPLOYEE_NOT_EXIST);
        }
        for(Employee employee:employees) {
            EmployeeDto employeeDto = buildEmployeeDto(employee);
            employeeDtos.add(employeeDto);
        }
        return employeeDtos;
    }

    @Transactional(readOnly = true)
    public List<RoleDto> findRoles(Integer employeeId){
        List<Role> roles = roleService.findRoles(employeeId);
        if(roles == null || roles.size() == 0){
            throw new UamsApiException(ErrorCode.ROLE_NOT_EXIST);
        }
        List<RoleDto> roleDtos = new ArrayList<RoleDto>();
        for (int i= 0;i<roles.size();i++){
            RoleDto roleDto = new RoleDto();
            roleDto.setId(roles.get(i).getId());
            roleDto.setName(roles.get(i).getName());
            roleDto.setCreateTime(roles.get(i).getCreateTime());
            roleDto.setUpdateTime(roles.get(i).getUpdateTime());
            roleDtos.add(roleDto);
        }
        return roleDtos;
    }

    @Transactional(readOnly = true)
    public EmployeeInfoDto findInfo(Integer id){
        Employee employee = employeeService.get(id);
        EmployeeInfo employeeInfo = employee.getEmployeeInfo();
        if (employee == null){
            throw new UamsApiException(ErrorCode.EMPLOYEE_NOT_EXIST);
        }else{
            EmployeeInfoDto employeeInfoDto = new EmployeeInfoDto();
            employeeInfoDto.setId(employee.getId());
            employeeInfoDto.setUsername(employee.getUsername());
            employeeInfoDto.setStatus(employee.getStatus());
            employeeInfoDto.setRootUser(employee.getRootUser());
            employeeInfoDto.setCreateTime(employee.getCreateTime());
            employeeInfoDto.setUpdateTime(employee.getUpdateTime());
            employeeInfoDto.setName(employeeInfo.getName());
            employeeInfoDto.setNumber(employeeInfo.getNumber());
            employeeInfoDto.setSex(employeeInfo.getSex());
            employeeInfoDto.setAge(employeeInfo.getAge());
            employeeInfoDto.setTel(employeeInfo.getTel());
            employeeInfoDto.setAddress(employeeInfo.getAddress());
            employeeInfoDto.setEmail(employeeInfo.getEmail());
            employeeInfoDto.setPosition(employeeInfo.getPosition());
            employeeInfoDto.setDepartmentId(employee.getDepartmentId());

            return employeeInfoDto;
        }
    }

    @Transactional(readOnly = true)
    public List<ResourceDto> findResourceByEmployee(String uniqueNo,Integer employeeId){
        ResourceUtil resourceUtil = new ResourceUtil();
        stubApiService.checkStubExist(uniqueNo);
        List<Role> roles = roleService.findRoles(employeeId);
        if(roles == null || roles.size() == 0){
            throw new UamsApiException(ErrorCode.ROLE_NOT_EXIST);
        }
        Stub stub = stubService.findStubByUniqueNo(uniqueNo);
        Integer stubId = stub.getId();

        Map<Resource,List<Operation>> resourceListMap=new HashMap<Resource, List<Operation>>();
        for (int r =0;r<roles.size();r++){
            List<Resource> newResources =  resourceService.getResourceByRoleStub(roles.get(r).getId(),stubId);
            for (Resource newResource:newResources) {
                if(resourceListMap.containsKey(newResource)){
                     for(Operation operation:newResource.getOperationList()){
                         if(resourceListMap.get(newResource).contains(operation)){
                             continue;
                         }
                         resourceListMap.get(newResource).add(operation);
                     }
                }else {
                    resourceListMap.put(newResource,newResource.getOperationList());
                }
            }
        }
        List<Resource> resourceList=new ArrayList<Resource>();
        for(Map.Entry<Resource,List<Operation>> resourceListEntry:resourceListMap.entrySet()){
            resourceListEntry.getKey().setOperationList(resourceListEntry.getValue());
            resourceList.add(resourceListEntry.getKey());
        }

        Collections.sort(resourceList, new Comparator<Resource>() {
            @Override
            public int compare(Resource o1, Resource o2) {
                    if (o1.getId().equals(o2.getId())) {
                        return 0;
                    } else if (o1.getId()>o2.getId()) {
                        return 1;
                    } else {
                        return -1;
                    }
            }
        });
        return resourceUtil.getResourceDtos(resourceList);
    }

    @Transactional //修改密码
    public Boolean updatePassword(String uniqueNo,Integer id,String oldPassword,String newPassword) {
        stubApiService.checkStubExist(uniqueNo);
        Employee employee = employeeService.get(id);
        String salt = employee.getSalt();
        String password = new Sha256Hash(oldPassword, salt).toBase64();
        if (!employee.getPassword().equals(password)) {
            throw new UamsApiException(ErrorCode.EMPLOYEE_PASSWORD_ERROR);
        }
        employee.setPassword(new Sha256Hash(newPassword, salt).toBase64());
        generalDAO.save(employee);
        return true;
    }

}
