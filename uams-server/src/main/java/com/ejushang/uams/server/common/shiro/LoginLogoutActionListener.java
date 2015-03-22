package com.ejushang.uams.server.common.shiro;

import com.ejushang.uams.server.domain.User;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 用户登录登出Listener
 * User: liubin
 * Date: 14-1-16
 */
public class LoginLogoutActionListener implements AuthenticationListener {

    private static final Logger log = LoggerFactory.getLogger(LoginLogoutActionListener.class);


    @Override
    public void onSuccess(AuthenticationToken token, AuthenticationInfo info) {
        log.info("用户[{}]登录成功", ((UsernamePasswordToken) token).getUsername());

    }

    @Override
    public void onFailure(AuthenticationToken token, AuthenticationException ae) {
        log.info("用户[{}]登录失败", ((UsernamePasswordToken) token).getUsername());
    }

    @Override
    public void onLogout(PrincipalCollection principals) {
        User user = (User)principals.getPrimaryPrincipal();
        if(user == null) {
            log.info("用户已注销");
        } else {
            log.info("用户[{}]已注销", user.getUsername());
        }
    }

}
