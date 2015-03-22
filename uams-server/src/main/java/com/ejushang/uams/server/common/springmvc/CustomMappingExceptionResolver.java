package com.ejushang.uams.server.common.springmvc;

import com.ejushang.uams.UamsConstants;
import com.ejushang.uams.api.dto.ErrorCode;
import com.ejushang.uams.api.dto.ErrorInfo;
import com.ejushang.uams.exception.UamsApiException;
import com.ejushang.uams.exception.UamsBusinessException;
import com.ejushang.uams.server.common.util.JsonResult;
import org.apache.commons.beanutils.BeanMap;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * User: liubin
 * Date: 14-2-7
 *
 * springmvc异常信息记录类
 *
 */
public class CustomMappingExceptionResolver extends SimpleMappingExceptionResolver {

    private Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * 记录错误日志
     */
    @Override
    protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response,
                                              Object handler, Exception ex) {

        String msg = "系统发生错误,请联系管理员";
        Map errorInfoMap;
        String requestUri = WebUtils.getRequestUri(request);
        boolean unknownError = false;
        boolean apiError = false;
        UamsApiException apiException = null;

        if(ex instanceof UamsBusinessException) {
            //业务异常
            msg = ex.getMessage();

        } else if(ex instanceof UamsApiException) {
            //api请求异常
            apiError = true;
            apiException = (UamsApiException)ex;

        } else {
            //未知错误
            unknownError = true;
            logger.error(ex.getMessage(), ex);
            if(requestUri.startsWith("/api/")) {
                apiError = true;
                if(ex instanceof MissingServletRequestParameterException) {
                    apiException = new UamsApiException(ErrorCode.PARAMS_ERROR);
                }
            } else {
                response.setStatus(UamsConstants.SYSTEM_ERROR);
            }
        }

        if(!apiError) {
            if(unknownError) {
                response.setStatus(UamsConstants.SYSTEM_ERROR);
            }
            errorInfoMap = new JsonResult(false, msg).toMap();

        } else {
            //返回API调用异常的信息
            ErrorCode errorCode = ErrorCode.UNKNOWN_ERROR;
            msg = ErrorCode.UNKNOWN_ERROR.msg;
            if(apiException != null) {
                errorCode = apiException.getErrorCode();
                msg = apiException.getErrorMsg();
            }
            ErrorInfo errorInfo = new ErrorInfo(errorCode);
            errorInfo.setMsg(msg);
            errorInfo.setRequestUrl(requestUri);
            errorInfoMap = errorInfo.toMap();
        }


        ModelAndView mav = new ModelAndView();
        MappingJackson2JsonView view = new MappingJackson2JsonView();
        view.setAttributesMap(errorInfoMap);
        mav.setView(view);
        return mav;
    }


}