package com.ejushang.uams.server;

import com.ejushang.uams.server.employee.service.EmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.util.Assert;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * User: liubin
 * Date: 14-4-9
 */
public class UamsApplication implements ServletContextListener {

    private static final UamsApplication instance = new UamsApplication();
    public static final UamsApplication getInstance() {
        return instance;
    }

    private ApplicationContext applicationContext;

    private ServletContext servletContext;

    private static final Logger log = LoggerFactory.getLogger(UamsApplication.class);

    private boolean initialized = false;

    private EmployeeService employeeService;


    /**
     * 启动的时候需要调用初始化方法
     */
    public synchronized void init(ApplicationContext applicationContext, ServletContext servletContext) {
        if(initialized) return;
        try {
            Assert.notNull(applicationContext, "applicationContext will not be null!");

            this.applicationContext = applicationContext;
            this.servletContext = servletContext;

            initBeans();

            employeeService.initRootUser();


            if(servletContext != null) {

            }

            initialized = true;
        } catch (Exception e) {
            log.error("系统初始化的时候出错", e);
        }
    }

    private void initBeans() {
        employeeService = applicationContext.getBean(EmployeeService.class);
    }

    public ServletContext getServletContext() {
        return servletContext;
    }

    public ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        UamsApplication uamsApplication = UamsApplication.getInstance();
        uamsApplication.init(WebApplicationContextUtils.getWebApplicationContext(servletContextEvent.getServletContext()), servletContextEvent.getServletContext());
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }

}
