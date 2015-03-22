package com.ejushang.uams.server.user.service;

import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Filter;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.domain.User;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * User: liubin
 * Date: 14-3-10
 */
@Service
public class UserService {

    @Autowired
    private GeneralDAO generalDAO;

    @Transactional(readOnly = true)
    public User get(Integer userId) {
        return generalDAO.get(User.class, userId);
    }

    @Transactional(readOnly = true)
    public List<User> findByKey(String username, Page page) {


        Search search = new Search(User.class);
        search.addFilterEqual("username", username).addSortDesc("createTime");

        return generalDAO.search(search);

//        String name = "Joe";
//        Integer age = 21;
//        String orderByParam = "age";

//        Search search = new Search(User.class).addFilterEqual("name", name)
//                .addFilterLessThan("age", age)
//                .addSortAsc(orderByParam);
//        return generalDAO.search(s);

//        StringBuilder hql = new StringBuilder("select u from User u where 1=1");
//        List<Object> params = new ArrayList<Object>();
//        if(!StringUtils.isEmpty(name)) {
//            hql.append(" and u.name = ? ");
//            params.add(name);
//        }
//        if(age != null && age > 0) {
//            hql.append(" and u.age = ? ");
//            params.add(age);
//        }
//        if(!StringUtils.isEmpty(orderByParam)) {
//            hql.append(" order by " + orderByParam + " asc ");
//        }
//
//        return generalDAO.query(hql.toString(), null, params.toArray());


    }

    @Transactional
    public void save(User user) {
        if(isUsernameExist(user.getUsername(), user.getId())) {
            throw new UamsBusinessException("用户名已存在");
        }
        generalDAO.save(user);
    }

    @Transactional(readOnly = true)
    public boolean isUsernameExist(String username, Integer userId) {
        Search search = new Search(User.class).addFilterEqual("username", username).addFilterNotEqual("id", userId);
        int count = generalDAO.count(search);
        return count > 0;
    }

}
