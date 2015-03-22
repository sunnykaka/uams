package com.ejushang.uams.server.role.service;

import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.resource.service.ResourceService;
import com.ejushang.uams.server.stub.service.StubService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * User:moon
 * Date: 14-3-14
 * Time: 下午3:26
 */
@Service
@Transactional
public class RoleService {
    private static final Logger log = LoggerFactory.getLogger(RoleService.class);
    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private StubService stubService;

    @Autowired
    private ResourceService resourceService;

    /**
     * 得到一个角色
     */
    @Transactional(readOnly = true)
    public Role get(Integer id){

       return generalDAO.get(Role.class,id);
    }

    /**
     * 查询所有角色
     */
    @Transactional(readOnly = true)
    public List<Role> findAll(Page page,String name){

        Search search=new Search(Role.class);
        if(!StringUtils.isEmpty(name)){
              search.addFilterLike("name","%"+name+"%");
        }
        search.addSortDesc("createTime");
        search.addPagination(page);
        return generalDAO.search(search);
    }

    /**
     * 查询所有角色
     */
    @Transactional(readOnly = true)
    public List<Role> findAllRoles(){
        Search search=new Search(Role.class);
        return generalDAO.search(search);
    }


    /**
     * 保存角色
     */
    public void save(Role role){
       if(isRolenameExist(role.getName(),role.getId())){
          throw new UamsBusinessException("角色名已存在");
       }
        generalDAO.save(role);
    }

    public boolean isRolenameExist(String name, Integer id) {
        Search search = new Search(Role.class).addFilterEqual("name", name).addFilterNotEqual("id", id);
        int count = generalDAO.count(search);
        return count > 0;
    }

    /**
     * 删除角色
     */
    public void delete(int[] ids){
        for(Integer id:ids){
        Search search=new Search(EmployeeRole.class);
        search.addFilterEqual("roleId",id);
        List<EmployeeRole> employeeRoleList= generalDAO.search(search);
        if(employeeRoleList.size()>0){
            throw new UamsBusinessException(String.format("有%d个用户拥有角色[%s],不能删除",employeeRoleList.size(),id));
        }
        stubService.delStubRoleByRoleId(id);
        generalDAO.remove(get(id));
        }
    }

    /**
     * 查找出所有的模块操作，根据roleId标记相应的操作
     */
    @Transactional(readOnly = true)
    public List<Resource> findResourceOperation(Integer roleId,Integer stubId) {
        if(log.isInfoEnabled()){
            log.info("接收到的roleId为："+roleId+"接收到的stubId为："+stubId);
        }
        StubRole stubRole=stubService.findStubRole(roleId,stubId);

        if(stubRole==null){
              return getAllPermission(stubId);
        }

        //查找所有的资源
        List<Operation> listOperation= resourceService.findAllOperation(stubId);

        //一个角色拥有的操作
        List<Operation> operationRoleList=new ArrayList<Operation>();
        List<StubRoleOperation> roleOperations=resourceService.findStubRoleOperate(stubRole.getId());
        for(StubRoleOperation roleOperation:roleOperations){
            operationRoleList.add(roleOperation.getOperation());
        }

        //如果角色拥有哪个角色，就把操作里的isOp设置成true，否则为false
        for(Operation operation1:listOperation){
            for(Operation operation:operationRoleList){
                if(operation.getId().equals(operation1.getId())){
                    operation1.setOp(true);
                }
            }
        }

        return getAllPermission(stubId);
    }

    /**
     * 查找出所有的操作,为添加页面用
     */
    @Transactional(readOnly = true)
    public List<Resource> getAllPermission(Integer stubId) {

        //查找所有的模块
        List<Resource> listResource=resourceService.findResourceByStubId(stubId);

        //把操作加到相应的资源模块中（Resource）
        for(Resource resourceList:listResource){
            Collections.sort(resourceList.getOperationList(),new Comparator<Operation>() {
                @Override
                public int compare(Operation o1, Operation o2) {
                    boolean same = o1.getConfigable()&&o2.getConfigable();
                    if( !same && !o1.getConfigable()){
                        return  1;
                    }
                    return 0;
                }
            });
        }

        return listResource;

    }

    public void saveRolePermission(StubRoleOperation roleOperation) {
            generalDAO.save(roleOperation);
    }

    /**
     * 给角色授权
     */
    public void grantRoleOperation(Integer roleId,int[] operationId,Integer stubId) {

        StubRole stubRole=new StubRole();
        if(stubService.findStubRole(roleId,stubId)==null){
            stubRole.setRoleId(roleId);
            stubRole.setStubId(stubId);
            stubService.saveStubRole(stubRole);
        } else{
            stubRole=stubService.findStubRole(roleId,stubId);
            resourceService.deleteRoleOperationByRoleId(roleId,stubId);
        }
        List<Operation> operationList=new ArrayList<Operation>();
        if(operationId!=null){
            for(int id:operationId){
              Operation operation= resourceService.findOperationById(id);
              operationList.add(operation);
            }
            for(Operation p : operationList) {
                    StubRoleOperation rp = new StubRoleOperation();
                    rp.setOperationId(p.getId());
                    rp.setStubRoleId(stubRole.getId());
                    saveRolePermission(rp);
            }
        }
    }

    /**
     * 根据用户ID，查询该用户的所有角色
     */
    @Transactional(readOnly = true)
    public List<Role> findRoles(Integer employeeId){
        Search search = new Search(Role.class);
        return generalDAO.search(search.addFilterEqual("employeeRoleList.employeeId", employeeId));
    }

    /**
     * 根据用户ID，查询该用户的所有角色
     */
    @Transactional(readOnly = true)
    public Role getByName(String name){
        Search search = new Search(Role.class);
        search.addFilterEqual("name", name);
        return (Role)generalDAO.searchUnique(search);
    }


}
