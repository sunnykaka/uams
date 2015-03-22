package com.ejushang.uams.server.resource.service;

import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.domain.Operation;
import com.ejushang.uams.server.domain.Resource;
import com.ejushang.uams.server.domain.StubRole;
import com.ejushang.uams.server.domain.StubRoleOperation;
import com.ejushang.uams.server.stub.service.StubService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User:moon
 * Date: 14-3-20
 * Time: 上午11:34
 */
@Service
@Transactional
public class ResourceService {

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private StubService stubService;

    private static final Logger log = LoggerFactory.getLogger(ResourceService.class);
    /**
     * 得到一个模块
     */
    @Transactional(readOnly = true)
    public Resource getResource(Integer id){
        return generalDAO.get(Resource.class,id);
    }

    /**
     * 删除模块
     */
    public void delResourceById(Integer id){

        generalDAO.remove(generalDAO.get(Resource.class,id));
    }

    /**
     * 保存模块
     */
    public void save(Resource resource){
        generalDAO.save(resource);
    }

    /**
     * 保存操作
     */
    public void saveOperation(Operation operation){
        generalDAO.save(operation);
    }

    /**
     * 删除操作
     */
    public void delOperationById(Integer id){
        //删除stubRoleOperation里的数据
        delStubRoleOperationByOpeId(id);
        generalDAO.remove(generalDAO.get(Operation.class,id));
    }

    /**
     * 查询出该系统下所有的操作
     */
    @Transactional(readOnly = true)
    public List<Operation> findAllOperation(Integer stubId){
        List<Resource> resources=findResourceByStubId(stubId);
        if(log.isInfoEnabled()){
            log.info("查询出的findAllOperation resources的长度为："+resources.size());
        }
        List<Operation> operationList=new ArrayList<Operation>();
        for(Resource resource:resources){
            List<Operation> operationList1= findOperationByResourceId(resource.getId());
            if(log.isInfoEnabled()){
                log.info("查询出的resource的id为："+resource.getId());
                log.info("查询出的operationList1的长度为："+operationList1.size());
            }
            for(Operation operation:operationList1){
                operation.setResourceName(getResource(operation.getResourceId()).getName());
                saveOperation(operation);
                operationList.add(operation);
            }
        }

        return operationList;
    }

    /**
     * 查询该模块下的所有操作
     */
    @Transactional(readOnly = true)
    public List<Operation> findOperationByResourceId(Integer resourceId){
        Search search=new Search(Operation.class);
        search.addFilterEqual("resourceId",resourceId);
       return generalDAO.search(search);
    }

    /**
     * 根据角色id查询出该角色拥有的操作
     */
    @Transactional(readOnly = true)
    public List<StubRoleOperation> findStubRoleOperate(Integer stubRoleId){
        Search search=new Search(StubRoleOperation.class);
        search.addFilterEqual("stubRoleId", stubRoleId);
        return generalDAO.search(search);
    }

    /**
     * 根据roleId删除 RoleOperation里的数据
     * 删除该角色所拥有的操作
     */
    public void deleteRoleOperationByRoleId(Integer roleId,Integer stubId){
        StubRole stubRole= stubService.findStubRole(roleId,stubId);
        Search search=new Search(StubRoleOperation.class);
        search.addFilterEqual("stubRoleId",stubRole.getId());
        List<StubRoleOperation> roleOperationList=generalDAO.search(search);
        for(StubRoleOperation roleOperation:roleOperationList){
            generalDAO.remove(roleOperation);
        }


    }

    /**
     * 根据operationId删除
     */
    public void delStubRoleOperationByOpeId(Integer operationId){
        Search search=new Search(StubRoleOperation.class);
        search.addFilterEqual("operationId",operationId);
        List<StubRoleOperation> roleOperationList=generalDAO.search(search);
        for(StubRoleOperation roleOperation:roleOperationList){
            generalDAO.remove(roleOperation);
        }
    }

    /**
     * 根据resourceId删除
     */
    public void delOperationByResourceId(Integer resourceId){
        Search search=new Search(Operation.class);
        search.addFilterEqual("resourceId",resourceId);
        List<Operation> operationList=generalDAO.search(search);
        for(Operation operation:operationList){
            delStubRoleOperationByOpeId(operation.getId());
            generalDAO.remove(operation);
        }
    }

    /**
     * 根据stubId删除
     */
    public void delResourceByStubId(Integer stubId){
        Search search=new Search(Resource.class);
        search.addFilterEqual("stubId",stubId);
        List<Resource> resourceList=generalDAO.search(search);
        for(Resource resource:resourceList){
            delOperationByResourceId(resource.getId());
            generalDAO.remove(resource);
        }
    }

    /**
     * 根据操作名字查询出操作
     */
    @Transactional(readOnly = true)
    public Integer findOperationByName(String name,Integer stubId){
        Integer operationId=null;
        Search search=new Search(Operation.class);
        search.addFilterEqual("name",name);
        List<Operation> operationList=generalDAO.search(search);
        for(Operation operation:operationList){
            Resource resource=getResource(operation.getResourceId());
            if(resource.getStubId().equals(stubId)){
                 operationId=operation.getId();
            }
        }
        if(log.isInfoEnabled()){
            log.info("operationId为："+operationId);
        }
        return operationId;
    }

    /**
     * 查询出相关联的操作
     */
    @Transactional(readOnly = true)
    public List<Integer> findLinkOperation(Integer id,String status,Integer stubId) {
        List<Integer> integerList=new ArrayList<Integer>();
        Operation operation=generalDAO.get(Operation.class,id);

        if(status.equals("true")){
            String required=operation.getRequired();
            if(required==null){
                return integerList;
            }
            String[] requiredArray=required.split(",");
            for(int i=0;i<requiredArray.length;i++){
               Integer integers=findOperationByName(requiredArray[i],stubId);
                    integerList.add(integers);
            }
        }else if(status.equals("false")){
            List<Operation> operationList=findAllOperation(stubId);
            for(Operation operation2:operationList){
                if(StringUtils.isNotBlank(operation2.getRequired())){
                    String[] requiredArray=operation2.getRequired().split(",");
                    for(String s:requiredArray){
                        if(s.equals(operation.getName())){
                            integerList.add(operation2.getId());
                        }
                    }
                }
            }
        }
        return integerList;
    }

    /**
     * 根据id查询出该操作
     */
    @Transactional(readOnly = true)
    public  Operation findOperationById(Integer id) {
            return generalDAO.get(Operation.class,id);
    }

    /**
     * 查询出该客户系统下的模块
     */
    @Transactional(readOnly = true)
    public List<Resource> findResourceByStubId(Integer stubId){
            Search search=new Search(Resource.class);
            search.addFilterEqual("stubId",stubId);
            return generalDAO.search(search);
    }

    /**
     * 根据角色id和系统id查询出该角色在该系统中能够进行操作的模块
     */
    @Transactional(readOnly = true)
    public List<Resource> getResourceByRoleStub(Integer roleId,Integer stubId){

//        StringBuilder hql=new StringBuilder("select r from Resource r left join r.operationList o   "+
//                                            "left join o.roleOperationList sro left join sro.stubRole sr " +
//                                            "on sr.roleId=? and r.stubId=?");

//        StringBuilder hql=new StringBuilder("select r from Resource r where id in " +
//                                            "(select o.resourceId from Operation o  where id in " +
//                                            "(select sro.operationId from StubRoleOperation sro where sro.stubRoleId in " +
//                                            "(select id from StubRole sr where sr.roleId=? and sr.stubId=?)))");

        StringBuilder hql = new StringBuilder("select sro.operation from StubRoleOperation sro  " +
                "where sro.stubRole.roleId=? and sro.stubRole.stubId=?)");

        List<Operation> operations = generalDAO.query(hql.toString(), null, new Object[]{roleId,stubId});
        Map<Integer, Resource> resourceMap1 = new HashMap<Integer, Resource>();
        for(Operation operation : operations) {
            Resource resource = resourceMap1.get(operation.getResourceId());
            if(resource == null) {
                resource=getResource(operation.getResourceId());
                resource.setOperationList(new ArrayList<Operation>());
                resourceMap1.put(resource.getId(), resource);
            } else {
                resource = resourceMap1.get(resource.getId());
            }
            resource.getOperationList().add(operation);
        }
        return new ArrayList<Resource>(resourceMap1.values());
    }
}
