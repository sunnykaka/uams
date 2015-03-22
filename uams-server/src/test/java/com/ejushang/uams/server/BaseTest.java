package com.ejushang.uams.server;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

/**
 * User: liubin
 * Date: 14-3-10
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath*:spring-*.xml")
@TransactionConfiguration(transactionManager="transactionManager")
public class BaseTest {



    //Example
//    @Test
//    @Transactional
//    @Rollback(false)
//    public void test() {
//    }


}
