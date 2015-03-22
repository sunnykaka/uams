package com.ejushang.uams.server.permission;

import com.ejushang.uams.api.dto.ErrorCode;
import com.ejushang.uams.exception.UamsApiException;
import com.ejushang.uams.server.domain.*;
import com.ejushang.uams.server.jaxb.Permissions;
import com.ejushang.uams.server.resource.service.ResourceService;
import com.ejushang.uams.server.stub.service.StubService;
import com.google.common.collect.Sets;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import java.io.StringReader;
import java.util.*;

/**
 * User:moon
 * Date: 14-3-31
 * Time: 下午2:35
 */
@Service
@Transactional
public class PermissionService {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private StubService stubService;

    private static final Logger log = LoggerFactory.getLogger(PermissionService.class);

    public Boolean refreshPermission(String file,String uniqueNo){

        Stub stub =stubService.findStubByUniqueNo(uniqueNo);

        Permissions permissions;
        try{
            JAXBContext jc = JAXBContext.newInstance(Permissions.class.getPackage().getName());
            permissions = (Permissions)jc.createUnmarshaller().unmarshal(new StringReader(file));
            }catch (JAXBException e){
                log.error("读取权限xml的时候发生错误", e);
            throw new UamsApiException(ErrorCode.PERMISSION_NAME_ERROR.value,"读取权限xml的时候发生错误");
            }

            List<Permissions.Resource> pResources=permissions.getResource();
            //key为name，value为Permissions.Resource对象
            Map<String,Permissions.Resource> pResourceMap=new LinkedHashMap<String, Permissions.Resource>();
            //key为name，value为Permissions.Resource.Operation对象
            Map<String,Permissions.Resource.Operation> pOperationMap=new LinkedHashMap<String, Permissions.Resource.Operation>();
            //key为url, value为Permissions.Resource.Operation对象,只做校验用
            Map<String, Permissions.Resource.Operation> pOperationUrlMap = new HashMap<String, Permissions.Resource.Operation>();
            //key为name,value为Resource对象
            Map<String, Resource> resourceMap = new LinkedHashMap<String, Resource>();
            //key为name,value为Operation对象
            Map<String, Operation> operationMap = new LinkedHashMap<String, Operation>();
            //key为operation的name,value为resource对象的id
            Map<String, Integer> operationNameResourceIdMap = new HashMap<String, Integer>();
            //key为operation的name,value为resource对象的name
            Map<String, String> operationNameResourceNameMap = new HashMap<String, String>();

            //检验所有的resource和operation的name是唯一的，并且operation的url也是唯一的
            //检验operation所有required的name必须存在
            //判断resource的 entryOperation属性不为空
            checkResourceOperation(pResources,pResourceMap,pOperationMap,pOperationUrlMap);

            //比对数据库中的resource列表与现在文件中的resource列表,查找哪些resource已经在新文件中被删除,从数据库中删除这些resource
            //查找哪些resource下的operation已经在新文件中被删除,从数据库中删除这些operation
            updateResourceOperation(stub,pResourceMap,pOperationMap,resourceMap);

            if(log.isInfoEnabled()){
                log.info("查询出的resourceMap的长度为："+resourceMap.size());
            }

            //逐条处理resource
            for(Permissions.Resource pResource:pResources){
                Resource resource=resourceMap.get(pResource.getName());
                if(resource==null){
                    //为新增
                    resource=new Resource();
                    resource.setName(pResource.getName());
                    resourceMap.put(pResource.getName(),resource);
                }
                resource.setUniqueKey(pResource.getUniqueKey());
                resource.setIconCls(pResource.getIconCls());
                resource.setModule(pResource.getModule());
                resource.setStubId(stub.getId());
                resource.setEntryOperation(pResource.getEntryOperation());
                resourceService.save(resource);

                List<Permissions.Resource.Operation> pOperations = pResource.getOperation();
                for(Permissions.Resource.Operation pOperation : pOperations) {
                    operationNameResourceIdMap.put(pOperation.getName(), resource.getId());
                    operationNameResourceNameMap.put(pOperation.getName(),resource.getName());
                }
            }

            //逐条处理operation,首先递归处理required中的operation.然后判断该operation是新增还是修改.
            //1)如果是新增,直接数据库新增operation就好
            //2)如果是修改,找到之前数据库operation的required列表,比对required中的哪些operation需要删除和新增.
            //	忽略删除的,处理新增的.查询哪些角色拥有该operation的权限,将对应角色与新增的operation记录到一个map中,key为角色id,value为要赋予的权限列表
            List<Operation> allOperation = resourceService.findAllOperation(stub.getId());

            for(Operation operation1 : allOperation) {
                operationMap.put(operation1.getName(), operation1);
            }

            POperationHandler pOperationHandler = new POperationHandler(operationMap, pOperationMap,
                    operationNameResourceIdMap,operationNameResourceNameMap);

            for(Map.Entry<String, Permissions.Resource.Operation> entry : pOperationMap.entrySet()) {
                Permissions.Resource.Operation pOperation = entry.getValue();
                if(log.isInfoEnabled()){
                    log.info("接收到的pOperation为："+pOperation.getName());
                }
                pOperationHandler.handlePOperation(pOperation,stub.getId());
            }
        return true;
    }

    public void checkResourceOperation(List<Permissions.Resource> pResources,
        Map<String,Permissions.Resource> pResourceMap,
        Map<String,Permissions.Resource.Operation> pOperationMap,
        Map<String, Permissions.Resource.Operation> pOperationUrlMap){
        //检验所有的resource和operation的name是唯一的，并且operation的url也是唯一的
        for(Permissions.Resource pResource:pResources){
            assertNotExist(pResourceMap,pResource.getName(),"resource的name");
            pResourceMap.put(pResource.getName(),pResource);//把resource加入到pResourceMap中

            List<Permissions.Resource.Operation> pResourceOperation=pResource.getOperation();
            if(pResourceOperation.isEmpty()) {
                throw new UamsApiException(ErrorCode.RESOURCE_OPERATION_NULL.value,"resource"+pResource.getName()+" 的operation为空");
            }

            for(Permissions.Resource.Operation pOperation:pResourceOperation){
                assertNotExist(pOperationMap,pOperation.getName(),"operation的name"); //判断是否存在，不存在则创建，否则返回
                assertNotExist(pOperationUrlMap,pOperation.getUrl(),"operation的url");
                pOperationMap.put(pOperation.getName(), pOperation); //加入操作名字
                pOperationUrlMap.put(pOperation.getUrl(), pOperation);//加入操作的url
            }
        }
        //检验operation所有required的name必须存在
        for(Map.Entry<String,Permissions.Resource.Operation> entry:pOperationMap.entrySet()){
            Permissions.Resource.Operation operation=entry.getValue();
            if(!StringUtils.isBlank(operation.getRequired())){
                String[] strings=operation.getRequired().split(",");
                for(String requiredName:strings){
                    if(!pOperationMap.containsKey(requiredName)){
                        throw new UamsApiException(ErrorCode.REQUIRED_NOT.value,String.format("operation"+operation.getName()+"required的"+requiredName+"不存在"));
                    }
                }
            }
        }
        //判断resource的 entryOperation属性不为空
        for(Permissions.Resource pResource : pResources) {
            String entryOperation = pResource.getEntryOperation();

            if(pOperationMap.get(entryOperation) == null) {
                throw new UamsApiException(ErrorCode.ENTRYOPERATION_NOT_NULL.value,"entryOperation属性不能为空,resource name:" + pResource.getName());
            }

            if(StringUtils.isBlank(entryOperation)) {
                throw new UamsApiException(ErrorCode.ENTRYOPERATION_NOT.value,"entryOperation对应的operation不存在,entryOperation:" + entryOperation);
            }
        }
    }

    public void updateResourceOperation(Stub stub,
        Map<String,Permissions.Resource> pResourceMap,
        Map<String,Permissions.Resource.Operation> pOperationMap,
        Map<String, Resource> resourceMap){
            List<Resource> resourceList=resourceService.findResourceByStubId(stub.getId());
            if(log.isInfoEnabled()){
                    log.info("查询出的resourceList的长度为："+resourceList.size());
            }

            if(!resourceList.isEmpty()){
                for(Resource resource:resourceList){
                    if(!pResourceMap.containsKey(resource.getName())){
                        //删除与模块相关联的操作   删除stubRoleOperation里的数据
                        resourceService.delOperationByResourceId(resource.getId());
                        //删除模块
                        resourceService.delResourceById(resource.getId());
                    }else {
                        resourceMap.put(resource.getName(),resource);
                    }
                }
                //查找哪些resource下的operation已经在新文件中被删除,从数据库中删除这些operation
                List<Operation> operationList=resourceService.findAllOperation(stub.getId());
                for(Operation operation:operationList){
                    if(!pOperationMap.containsKey(operation.getName())){
                        //删除操作
                        resourceService.delOperationById(operation.getId());
                    }
                }
            }
    }

    private void assertNotExist(Map<String, ?> map, String key, String label) {
        if(map.containsKey(key)) {
            throw new UamsApiException(ErrorCode.NAME_MISMATCH.value,String.format(label + "重复,key:[%s]", key));
        }
    }

    private class POperationHandler {
        Map<String, Operation> operationMap;
        Map<String, Permissions.Resource.Operation> pOperationNameMap;
        Map<String, Integer> operationNameResourceIdMap;
        Map<String, String> operationNameResourceNameMap;
        //集合中存放着已经处理过的operation的name,防止无限递归
        Set<String> handledPOperationNameSet = new HashSet<String>();
        //key为operation的name,value为对应operation的required属性中新增的operation name
        Map<String, Set<String>> operationNewlyRequiredMap = new HashMap<String, Set<String>>();

        public POperationHandler(
                Map<String, Operation> operationMap,
                Map<String, Permissions.Resource.Operation> pOperationNameMap,
                Map<String, Integer> operationNameResourceIdMap,
                Map<String, String> operationNameResourceNameMap ) {
            super();
            this.operationMap = operationMap;
            this.pOperationNameMap = pOperationNameMap;
            this.operationNameResourceIdMap = operationNameResourceIdMap;
            this.operationNameResourceNameMap=operationNameResourceNameMap;
        }

        private void handlePOperation(Permissions.Resource.Operation pOperation,Integer stubId) {
            if(handledPOperationNameSet.contains(pOperation.getName())){
                //已经处理过了
                return ;
            }

            if(!StringUtils.isBlank(pOperation.getRequired())){
                String[] requiredNames=pOperation.getRequired().split(",");
                for(String requireName:requiredNames){
                    //递归处理required
                    handlePOperation(pOperationNameMap.get(requireName),stubId);
                }
            }

            if(log.isInfoEnabled()){
                log.info("接收到的pOperation.getName()为："+pOperation.getName());
            }
            Operation operation=operationMap.get(pOperation.getName());
            Integer resourceId = operationNameResourceIdMap.get(pOperation.getName());
            String  resourceName=operationNameResourceNameMap.get(pOperation.getName());
            boolean isNew = operation == null;
            if(isNew){
                //为新增
                operation=new Operation();
                operation.setName(pOperation.getName());
                operationMap.put(pOperation.getName(),operation);
                    if(log.isInfoEnabled()){
                        log.info("新增的pOperation为："+pOperation.getName());
                    }
                operation.setRequired(pOperation.getRequired());
                    if(operation.getRequired()!=null){
                    Set<String> stringSet=Sets.newHashSet(operation.getRequired().split(","));
                    operationNewlyRequiredMap.put(operation.getName(),stringSet);
                    }
            }else{
                //修改operation
                if(log.isInfoEnabled()){
                    log.info("修改的pOperation为："+pOperation.getName());
                }
                String newlyRequired = pOperation.getRequired();
                String formerlyRequired = operation.getRequired();
                if(!StringUtils.isBlank(newlyRequired)) {
                    //新增的required权限
                    Set<String> newlyRequiredNames = Sets.newHashSet(newlyRequired.split(","));
                    //之前的required权限
                    Set<String> formerlyRequiredNames = null;
                    if(!StringUtils.isBlank(formerlyRequired)) {
                        formerlyRequiredNames = Sets.newHashSet(formerlyRequired.split(","));
                    }
                    if(formerlyRequiredNames != null && !formerlyRequiredNames.isEmpty()) {
                        for(Iterator<String> iter = newlyRequiredNames.iterator(); iter.hasNext();) {
                            String newlyRequiredName = iter.next();
                            if(formerlyRequiredNames.contains(newlyRequiredName)) {
                                iter.remove();
                            }
                        }
                    }
                    if(!newlyRequiredNames.isEmpty()) {
                        operationNewlyRequiredMap.put(operation.getName(), newlyRequiredNames);
                    }
                    if(log.isInfoEnabled()){
                        log.info("接收到的operationNewlyRequiredMap为："+operationNewlyRequiredMap);
                        log.info("得到当前operation的required(递归搜索)的新增权限集合的pOperation为："+pOperation.getName());
                    }
                    //得到当前operation的required(递归搜索)的新增权限集合
                    Set<String> newlyPermissionToRoleOperations = getAllNewlyOperation(pOperation);
                    if(log.isInfoEnabled()){
                            log.info("接收到的newlyPermissionToRoleOperations为："+newlyPermissionToRoleOperations);
                    }
                    //查询哪些role拥有当前operation权限 ,则也会拥有新增的操作权限
                    if(!newlyPermissionToRoleOperations.isEmpty()) {
                        List<StubRoleOperation> stubRoleOperations = stubService.findStubRoleOperation(operation.getId());
                        if(!stubRoleOperations.isEmpty()) {
                            for(StubRoleOperation stubRoleOperation : stubRoleOperations) {
                                StubRole stubRole=stubService.getStubRole(stubRoleOperation.getStubRoleId());
                                if(stubRole.getStubId()==stubId){
                                    List<StubRoleOperation> stubRoleOperation2=stubService.getStubRoleOperation(stubRole.getId());
                                    Map<String,StubRoleOperation> stringStubRoleOperationMap=new LinkedHashMap<String, StubRoleOperation>();
                                    for(StubRoleOperation srp:stubRoleOperation2){
                                        stringStubRoleOperationMap.put(resourceService.findOperationById(srp.getOperationId()).getName(),srp);
                                    }
                                    for(String s:newlyPermissionToRoleOperations){
                                        if(!stringStubRoleOperationMap.containsKey(s)){
                                        StubRoleOperation stubRoleOperation1=new StubRoleOperation();
                                        stubRoleOperation1.setOperationId(resourceService.findOperationByName(s,stubId));
                                        stubRoleOperation1.setStubRoleId(stubRoleOperation.getStubRoleId());
                                        stubService.saveStubRoleOperation(stubRoleOperation1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            operation.setRequired(pOperation.getRequired());
            operation.setUrl(pOperation.getUrl());
            operation.setResourceId(resourceId);
            operation.setResourceName(resourceName);
            operation.setConfigable(!"false".equalsIgnoreCase(pOperation.getConfigable()));
            resourceService.saveOperation(operation);
            //记录到已处理列表
            handledPOperationNameSet.add(pOperation.getName());
        }

        private Set<String> getAllNewlyOperation(Permissions.Resource.Operation pOperation) {
            if(log.isInfoEnabled()){
                log.info("接收到的getAllNewlyOperation pOperation为："+pOperation.getName());
            }
            Set<String> results = new HashSet<String>();
            Set<String> newlyRequiredOperation = operationNewlyRequiredMap.get(pOperation.getName());
            if(log.isInfoEnabled()){
                log.info("接收到的getAllNewlyOperation newlyRequiredOperation为："+newlyRequiredOperation);
            }
            if(newlyRequiredOperation != null) {
                results.addAll(newlyRequiredOperation);
            }
            if(log.isInfoEnabled()){
                log.info("接收到的getAllNewlyOperation pOperation.getRequired()为："+pOperation.getRequired());
            }
            if(!StringUtils.isBlank(pOperation.getRequired())) {
                String[] requiredNames = pOperation.getRequired().split(",");
                for(String requiredName : requiredNames) {
                    if(log.isInfoEnabled()){
                        log.info("递归处理的requiredName为："+requiredName);
                    }
                    if(pOperationNameMap.get(requiredName).getRequired()!=null){
                        Set<String> stringSet=Sets.newHashSet(pOperationNameMap.get(requiredName).getRequired().split(","));
                        operationNewlyRequiredMap.put(pOperationNameMap.get(requiredName).getName(),stringSet);
                    }
                    results.addAll(getAllNewlyOperation(pOperationNameMap.get(requiredName)));
                }
            }
            return results;
        }
    }

}
