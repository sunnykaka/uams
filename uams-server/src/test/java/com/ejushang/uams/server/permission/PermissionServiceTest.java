package com.ejushang.uams.server.permission;

import com.ejushang.uams.server.BaseTest;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.domain.Operation;
import com.ejushang.uams.server.domain.Resource;
import com.ejushang.uams.server.domain.Role;
import com.ejushang.uams.server.domain.Stub;
import com.ejushang.uams.server.jaxb.Permissions;
import com.ejushang.uams.server.resource.service.ResourceService;
import com.ejushang.uams.server.role.service.RoleService;
import com.ejushang.uams.server.stub.service.StubService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.charset.Charset;
import java.util.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.Matchers.is;


/**
 * User: liubin
 * Date: 14-4-4
 */
public class PermissionServiceTest extends BaseTest {

    @Autowired
    private PermissionService permissionService;
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private GeneralDAO generalDAO;
    @Autowired
    private RoleService roleService;
    @Autowired
    private StubService stubService;

    private String PERMISSION_FILE_1 = "permissions_test1.xml";
    private String PERMISSION_FILE_2 = "permissions_test2.xml";


    @Test
    @Transactional
    @Rollback(false)
    public void test() throws Exception {
        Stub stub = new Stub();
        stub.setUniqueNo(RandomStringUtils.randomAlphabetic(6) + "uniqueNo");
        stub.setName(RandomStringUtils.randomAlphabetic(6) + "name");
        generalDAO.save(stub);

        Role role = new Role();
        role.setName(RandomStringUtils.randomAlphabetic(6) + "name");
        generalDAO.save(role);

        //导入权限
        Permissions file1 = refreshPermission(PERMISSION_FILE_1, stub.getId());
        generalDAO.getSession().flush();
        generalDAO.getSession().clear();

        List<Resource> allResources = findResourcesByStub(stub.getId());
        //校验权限文件是否都正确导入到数据库
        assertPermissionsEquals(file1.getResource(), allResources);


        //把所有权限赋予该角色
        Set<Integer> operationIds = new HashSet<Integer>();
        for(Resource resource : allResources) {
            for(Operation operation : resource.getOperationList()) {
                operationIds.add(operation.getId());
            }
        }
        int[] operationIdArray = new int[operationIds.size()];
        Integer[] operationIdIntegerArray = operationIds.toArray(new Integer[0]);
        for (int i = 0; i < operationIdIntegerArray.length; i++) {
            operationIdArray[i] = operationIdIntegerArray[i];
        }

        roleService.grantRoleOperation(role.getId(), operationIdArray, stub.getId());
        generalDAO.getSession().flush();
        generalDAO.getSession().clear();

        //校验该角色是否拥有所有权限
        assertPermissionsEquals(file1.getResource(), resourceService.getResourceByRoleStub(role.getId(), stub.getId()));
        generalDAO.getSession().flush();
        generalDAO.getSession().clear();


        //导入第二个权限文件
        Permissions file2 = refreshPermission(PERMISSION_FILE_2, stub.getId());
        generalDAO.getSession().flush();
        generalDAO.getSession().clear();

        //校验权限文件是否都正确导入到数据库
        allResources = findResourcesByStub(stub.getId());
        assertPermissionsEquals(file2.getResource(), allResources);

        //校验该角色是否拥有所有权限
        assertPermissionsEquals(file2.getResource(), resourceService.getResourceByRoleStub(role.getId(), stub.getId()));
        generalDAO.getSession().flush();
        generalDAO.getSession().clear();

    }

    private void assertPermissionsEquals(List<Permissions.Resource> pResources, List<Resource> resources) {
        assertThat(resources.size(), is(pResources.size()));

        Map<String, Permissions.Resource> pResourceMap = new HashMap<String, Permissions.Resource>();
        Map<String, Resource> resourceMap = new HashMap<String, Resource>();
        for(Permissions.Resource pResource : pResources) {
            pResourceMap.put(pResource.getName(), pResource);
        }
        for(Resource resource : resources) {
            resourceMap.put(resource.getName(), resource);
        }

        assertThat(resourceMap.keySet(), is(pResourceMap.keySet()));

        for(Map.Entry<String, Permissions.Resource> entry : pResourceMap.entrySet()) {
            String resourceName = entry.getKey();
            Permissions.Resource pResource = entry.getValue();
            Resource resource = resourceMap.get(resourceName);
            assertResourceEquals(pResource, resource);
        }




//        permissions.getr
    }

    private void assertResourceEquals(Permissions.Resource pResource, Resource resource) {
        assertThat(resource, notNullValue());
        assertThat(pResource.getOperation(), notNullValue());
        assertThat(resource.getOperationList(), notNullValue());
        assertThat(pResource.getOperation().size(), is(resource.getOperationList().size()));

        Map<String, Permissions.Resource.Operation> pOperationMap = new HashMap<String, Permissions.Resource.Operation>();
        Map<String, Operation> operationMap = new HashMap<String, Operation>();
        for(Permissions.Resource.Operation pOperation : pResource.getOperation()) {
            pOperationMap.put(pOperation.getName(), pOperation);
        }
        for(Operation operation : resource.getOperationList()) {
            operationMap.put(operation.getName(), operation);
        }

        assertThat(operationMap.keySet(), is(pOperationMap.keySet()));

        for(Map.Entry<String, Permissions.Resource.Operation> entry : pOperationMap.entrySet()) {
            String operationName = entry.getKey();
            Permissions.Resource.Operation pOperation = entry.getValue();
            Operation operation = operationMap.get(operationName);

            assertOperationEquals(pOperation, operation);
        }

    }

    private void assertOperationEquals(Permissions.Resource.Operation pOperation, Operation operation) {
        assertThat(operation, notNullValue());

        assertThat(operation.getName(), is(pOperation.getName()));
        assertThat(operation.getRequired(), is(pOperation.getRequired()));
        assertThat(operation.getUrl(), is(pOperation.getUrl()));

    }

    private Permissions refreshPermission(String fileName, Integer stubId) throws Exception {
        InputStream is = PermissionServiceTest.class.getResourceAsStream(fileName);
        String file = IOUtils.toString(is, Charset.forName("UTF-8"));
        JAXBContext jc = JAXBContext.newInstance(Permissions.class.getPackage().getName());
        Permissions permissions =  (Permissions)jc.createUnmarshaller().unmarshal(new StringReader(file));

        permissionService.refreshPermission(file, stubService.get(stubId).getUniqueNo());

        return permissions;
    }

    private List<Resource> findResourcesByStub(Integer stubId) {
        Search search = new Search(Resource.class);
        search.addFilterEqual("stubId", stubId);
        return generalDAO.search(search);
    }


}
