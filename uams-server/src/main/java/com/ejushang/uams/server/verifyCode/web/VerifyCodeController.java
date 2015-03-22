package com.ejushang.uams.server.verifyCode.web;

import com.ejushang.uams.server.common.web.BaseController;
import com.ejushang.uams.server.verifyCode.util.VerifyCodeUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-8-4
 * Time: 下午6:29
 * To change this template use File | Settings | File Templates.
 */

@Controller
public class VerifyCodeController extends BaseController {

    @RequestMapping(value = "/verifyCode", method = RequestMethod.GET)
    public void wirteVerifyCode(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //设置浏览器不缓存本页
        response.setHeader("Cache-Control", "no-cache");

        //生成验证码，写入用户session
        String verifyCode= VerifyCodeUtil.generateTextCode(VerifyCodeUtil.TYPE_NUM_LOWER, 4, "0oOilJI1");
        request.getSession().setAttribute("verifyCode",verifyCode);

        //输出验证码给客户端
        response.setContentType("image/jpeg");
        BufferedImage bim=VerifyCodeUtil.generateImageCode(verifyCode, 90, 30, 2,true,Color.WHITE, Color.BLACK,null);
        ImageIO.write(bim, "JPEG", response.getOutputStream());
    }
}
