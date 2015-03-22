package com.ejushang.uams.server.stub.service;

import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.permission.PermissionService;
import com.ejushang.uams.server.resource.service.ResourceService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static com.ejushang.uams.server.api.util.MD5Util.findFileMD5;


/**
 * User:moon
 * Date: 14-3-14
 * Time: 下午1:29
 */
@Service
public class StubService {

    @Autowired
    private GeneralDAO generalDAO;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private PermissionService permissionService;

    /**
     * 查询单个stub根据id
     */
    @Transactional(readOnly = true)
    public Stub get(Integer id) {
        return generalDAO.get(Stub.class, id);
    }

    /**
     * 查询单个stubRole根据id
     */
    @Transactional(readOnly = true)
    public StubRole getStubRole(Integer id) {
        return generalDAO.get(StubRole.class, id);
    }

    /**
     * 查询所有的stub  分页
     */
    @Transactional(readOnly = true)
     public List<Stub> findByKey(Page page,String name){

        Search search=new Search(Stub.class);
        search.addSortDesc("createTime");
        if(!StringUtils.isEmpty(name)){
            search.addFilterLike("name","%"+name+"%");
        }
        search.addPagination(page);
        return generalDAO.search(search);
     }

    /**
     * 保存或更新stub
     */
    @Transactional
    public void save(Stub stub){

      if(isStubnameExist(stub.getName(),stub.getId())){
          throw new UamsBusinessException("系统名已存在");
      }
          generalDAO.save(stub);
    }

    /**
     * 保存或更新stub
     */
    @Transactional
    public void saveSyncLog(SyncLog syncLog){
        generalDAO.save(syncLog);

    }

    @Transactional
    public boolean isStubnameExist(String name, Integer id) {
        Search search = new Search(Stub.class).addFilterEqual("name", name).addFilterNotEqual("id", id);
        int count = generalDAO.count(search);
        return count > 0;
    }

    /**
     * 查询所有的stub  分页
     */
    @Transactional(readOnly = true)
    public List<SyncLog> findSyncLog(){

        Search search=new Search(SyncLog.class);
        search.addSortDesc("createTime");
        return generalDAO.search(search);
    }

    /**
     * 根据角色id删除 StubRole里面的数据
     */
    @Transactional
    public void delStubRoleByRoleId(Integer roleId){
        Search search=new Search(StubRole.class);
        search.addFilterEqual("roleId",roleId);
        List<StubRole> stubRoleList=generalDAO.search(search);
        for(StubRole stubRole:stubRoleList){
            delStubRoleOperation(stubRole.getId());
            generalDAO.remove(stubRole);
        }
    }

    @Transactional
    public  void saveStubRole(StubRole stubRole){
          generalDAO.save(stubRole);
    }

    @Transactional
    public  void saveStubRoleOperation(StubRoleOperation stubRoleOperation){
        generalDAO.save(stubRoleOperation);
    }

    /**
     * 根据stubId删除 StubRole里面的数据
     */
    @Transactional
    public void delStubRoleByStubId(Integer stubId){
        Search search=new Search(StubRole.class);
        search.addFilterEqual("stubId",stubId);
        List<StubRole> stubRoleList=generalDAO.search(search);
        for(StubRole stubRole:stubRoleList){
            generalDAO.remove(stubRole);
        }
    }

    /**
     * 删除stub，并且删除相关联的表的数据
     */
    @Transactional
    public void delete(int[] ids){
        for(Integer id:ids){
        Stub stub=generalDAO.get(Stub.class,id);
        delStubRoleByStubId(id);
        resourceService.delResourceByStubId(id);
        generalDAO.remove(stub);
        }
    }

    /**
     * 查询出stubRole
     */
    @Transactional(readOnly = true)
    public StubRole findStubRole(Integer roleId,Integer stubId){
        Search search=new Search(StubRole.class);
        search.addFilterEqual("roleId",roleId).addFilterEqual("stubId",stubId);
        return (StubRole)generalDAO.searchUnique(search);
    }

    /**
     * 根据stubRoleId删除 StubRoleOperation里的数据
     */
    @Transactional
    public void delStubRoleOperation(Integer stubRoleId){
        Search search=new Search(StubRoleOperation.class);
        search.addFilterEqual("stubRoleId",stubRoleId);
        List<StubRoleOperation> stubRoleOperations= generalDAO.search(search);
        for(StubRoleOperation stubRoleOperation:stubRoleOperations){
             generalDAO.remove(stubRoleOperation);
        }
    }

    /**
     * 根据stubRoleId查询 StubRoleOperation里的数据
     */
    @Transactional(readOnly = true)
    public List<StubRoleOperation> getStubRoleOperation(Integer stubRoleId){
        Search search=new Search(StubRoleOperation.class);
        search.addFilterEqual("stubRoleId",stubRoleId);
       return generalDAO.search(search);
    }

    /**
     * 根据stubRoleId查询 StubRoleOperation里的数据
     */
    @Transactional(readOnly = true)
    public List<StubRoleOperation> findStubRoleOperation(Integer operationId){
        Search search=new Search(StubRoleOperation.class);
        search.addFilterEqual("operationId",operationId);
        return generalDAO.search(search);
    }

    @Transactional(readOnly = true)
    public Stub findStubByUniqueNo(String uniqueNo){
        Search search=new Search(Stub.class);
        search.addFilterEqual("uniqueNo",uniqueNo);
        return (Stub)generalDAO.searchUnique(search);
    }

    public Boolean syncFile(String uniqueNo, String file){

        Stub stub =findStubByUniqueNo(uniqueNo);
        if(stub.getFileMd5()!=null && stub.getFileMd5().equals(findFileMD5(file))){
            return false;
        }
        if(stub.getFileMd5()==null || !stub.getFileMd5().equals(findFileMD5(file))){
            if(permissionService.refreshPermission(file,uniqueNo)){
                stub.setFileMd5(findFileMD5(file));
                stub.setFileUpdateTime(new Date());
                save(stub);
                //添加SyncLog数据
                SyncLog syncLog=new SyncLog();
                syncLog.setFileMd5(stub.getFileMd5());
                syncLog.setStubId(stub.getId());
                syncLog.setFileContent(file);
                saveSyncLog(syncLog);
                return true;
            }
        }
        return false;
    }

}
