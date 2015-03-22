package com.ejushang.uams.server.common.genericdao.test;

import com.ejushang.uams.server.BaseTest;
import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import com.ejushang.uams.server.common.genericdao.search.Filter;
import com.ejushang.uams.server.common.genericdao.search.Search;
import com.ejushang.uams.server.common.page.Page;
import com.ejushang.uams.server.domain.User;
import com.ejushang.uams.server.user.service.UserService;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.hamcrest.MatcherAssert.*;
import static org.hamcrest.Matchers.*;

/**
 * User: liubin
 * Date: 14-3-10
 */
public class UserDaoTest extends BaseTest {

    @Autowired
    private GeneralDAO generalDAO;
    @Autowired
    private UserService userService;


    @Test
    @Transactional
    @Rollback(false)
    public void test() throws InterruptedException {

        String username = "adasdasd";
        String password = "asd";

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        generalDAO.save(user);

        assertThat(user.getId(), notNullValue());
        assertThat(user.getCreateTime(), notNullValue());
        assertThat(user.getUpdateTime(), notNullValue());

        User user2 = generalDAO.get(User.class, user.getId());

        assertUserEquals(user2, user);

        user.setPassword("fgh");
        Thread.sleep(2000);
        generalDAO.save(user);

        User user3 = generalDAO.get(User.class, user.getId());
        assertUserEquals(user3, user);

        List<User> users = generalDAO.query("select u from User u where u.id = ?", null, user.getId());
        assertThat(users.size(), is(1));
        assertUserEquals(user3, users.get(0));

        int pageSize = 5;
        for(int i=0; i<pageSize + 5; i++) {
            User batchUser = new User();
            batchUser.setUsername(username);
            batchUser.setPassword(password);
            generalDAO.save(batchUser);
        }

        Page page = new Page(1, pageSize);
        users = generalDAO.query("select u from User u", page);
        assertThat(users.size(), is(pageSize));
        users = generalDAO.query("select u from User u", null);
        assertThat(users.size(), greaterThan(pageSize));

        users = generalDAO.search(new Search(User.class).addFilterEqual("id", user.getId()));
        assertThat(users.size(), is(1));
        assertUserEquals(user3, users.get(0));
        users = generalDAO.search(new Search(User.class).addPagination(page));
        assertThat(users.size(), is(pageSize));
        users = generalDAO.search(new Search(User.class));
        assertThat(users.size(), greaterThan(pageSize));
    }

    @Test
    @Transactional
    public void testService() {
        assertThat(userService.get(0), nullValue());
    }

    private void assertUserEquals(User expect, User actual) {
        assertThat(actual.getId(), is(expect.getId()));
        assertThat(actual.getUsername(), is(expect.getUsername()));
        assertThat(actual.getPassword(), is(expect.getPassword()));
        assertThat(actual.getStatus(), is(expect.getStatus()));
        assertThat(actual.getCreateTime(), is(expect.getCreateTime()));
        assertThat(actual.getUpdateTime(), is(expect.getUpdateTime()));

    }

}
