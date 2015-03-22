package com.ejushang.uams.server.department.service;

import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.domain.Department;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-3-18
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */

@Service
public class DepartmentService {
    @Autowired
    private GeneralDAO generalDAO;

    @Transactional    //新增部门
    public Department save(Department department){
        if(isDepartmentExist(department.getName(),department.getId(),department.getCode())){
            throw new UamsBusinessException("该部门已存在");
        }
        if ( department.getParentId()==null || department.getParentId()==0 ){
            department.setParentId(null);
        }
        generalDAO.save(department);
        generalDAO.refresh();

       return department;
    }

    @Transactional(readOnly = true)  //查询部门是否存在
    public boolean isDepartmentExist(String deptName,Integer deptId,String code){
        Search search = new Search(Department.class).addFilterEqual("name",deptName).addFilterNotEqual("id", deptId).addFilterEqual("code",code);
         int count = generalDAO.count(search);
        return count > 0;
    };



    @Transactional(readOnly = true) //按照部门ID查询部门
    public Department get(Integer id){
        return generalDAO.get(Department.class,id);
    };

    @Transactional(readOnly = true) //按照条件查询部门
    public List<Department> findByKey(Map map){
        Search search = new Search(Department.class);
        String[] names = (String[])map.get("name");
        String[] codes = (String[])map.get("code");
        if(names!=null && names.length>0 && !StringUtils.isBlank(names[0])) {
            search.addFilterLike("name", "%"+ names[0] +"%" );
        }if(codes!=null && codes.length>0 && !StringUtils.isBlank(codes[0])) {
            search.addFilterEqual("code", codes[0]);
        }
        search.addFilterNull("parentId");
        return generalDAO.search(search);
    };

//    @Transactional(readOnly = true) //查询所有部门
//    public List<Department> findAll(){
//        Search search = new Search(Department.class).addFetch("children");
//        return generalDAO.search(search);
//    };

    @Transactional   //删除部门
    public void delelte(Integer id){
        Department department = get(id);
        generalDAO.remove(department);
    };

//    @Transactional(readOnly = true) //根据code查询部门
//    public Department findByCode(String code){
//        Search search = new Search(Department.class).addFilterEqual("code",code);
//        return (Department)generalDAO.search(search).get(0);
//    };




}
