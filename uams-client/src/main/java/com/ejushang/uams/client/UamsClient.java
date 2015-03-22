package com.ejushang.uams.client;

import com.ejushang.uams.api.dto.*;
import com.ejushang.uams.client.env.UamsEnv;
import com.ejushang.uams.client.http.HttpRequest;
import com.ejushang.uams.client.util.JsonUtil;
import com.ejushang.uams.exception.UamsClientException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User: liubin
 * Date: 14-3-18
 */
public class UamsClient {

    private static final Logger log = LoggerFactory.getLogger(UamsClient.class);

    private String uniqueNo;


    UamsClient(String uniqueNo) {
        this.uniqueNo = uniqueNo;
    }

    /**
     * 同步权限文件
     * @return
     * @throws UamsClientException
     */
    public boolean syncPermissionFile() throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "file", UamsClientContext.getPermissionFileContent());

        Boolean success = doRequestReturnObject(Boolean.class, HttpMethod.POST, UamsEnv.stubsFileSyncApiUri, paramMap);
        return success;
    }

    /**
     * 员工登录
     * @param username
     * @param password
     * @return
     * @throws UamsClientException
     */
    public EmployeeDto login(String username, String password) throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "username", username);
        addParam(paramMap, "password", password);

        EmployeeDto employeeDto = doRequestReturnObject(EmployeeDto.class, HttpMethod.GET, UamsEnv.loginApiUri, paramMap);
        return employeeDto;
    }

    public List<EmployeeDto> findEmployeeByName(String username, String name) throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "username", username);
        addParam(paramMap, "name", name);

        List<EmployeeDto> employeeDtos = doRequestReturnList(EmployeeDto.class, HttpMethod.GET, UamsEnv.employeeSearchApiUri, paramMap);
        return employeeDtos;
    }

    public List<EmployeeDto> findEmployeeByRole(String roleName) throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "roleName", roleName);

        List<EmployeeDto> employeeDtos = doRequestReturnList(EmployeeDto.class, HttpMethod.GET, UamsEnv.employeeRoleApiUri, paramMap);
        return employeeDtos;
    }

    public EmployeeInfoDto getEmployeeInfo(Integer employeeId)  throws UamsClientException {
        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "employeeId", employeeId.toString());

        EmployeeInfoDto employeeInfoDto = doRequestReturnObject(EmployeeInfoDto.class, HttpMethod.GET, UamsEnv.employeesApiUri,paramMap);
        return employeeInfoDto;
    }

    public List<RoleDto> findEmployeeRoles(Integer employeeId) throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "employeeId", employeeId.toString());

        List<RoleDto> roleDtos = doRequestReturnList(RoleDto.class,HttpMethod.GET,UamsEnv.employeesRolesApiUri,paramMap);
        return roleDtos;
    }

    public List<ResourceDto> findEmployeeResources(Integer employeeId) throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "employeeId", employeeId.toString());

        List<ResourceDto> resourceDtos = doRequestReturnList(ResourceDto.class,HttpMethod.GET,UamsEnv.employeesResourcesApiUri,paramMap);
        return resourceDtos;
    }

    public List<ResourceDto> findStubResources() throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();

        List<ResourceDto> resourceDtos = doRequestReturnList(ResourceDto.class,HttpMethod.GET,UamsEnv.stubsResourcesApiUri,paramMap);
        return resourceDtos;
    }

    public Boolean updatePassword(Integer id,String oldPassword,String newPassword) throws UamsClientException {

        Map<String, List<String>> paramMap = createParamMap();
        addParam(paramMap, "id", id.toString());
        addParam(paramMap, "oldPassword", oldPassword);
        addParam(paramMap, "newPassword", newPassword);

        Boolean result = doRequestReturnObject(Boolean.class,HttpMethod.GET,UamsEnv.employeePasswordApiUri,paramMap);
        return result;
    }


    private Map<String, List<String>> createParamMap() {
        Map<String, List<String>> params = new HashMap<String, List<String>>();

        addParam(params, "uniqueNo", uniqueNo);

        return params;
    }

    private void addParam(Map<String, List<String>> params, String key, String value) {
        List<String> values = new ArrayList<String>();
        values.add(value);
        params.put(key, values);
    }



    /**
     * 发起http请求,返回List
     * @param resultClass
     * @param httpMethod
     * @param url
     * @param params
     * @param <T>
     * @return
     * @throws UamsClientException
     */
    private <T> List<T> doRequestReturnList(Class<T> resultClass, HttpMethod httpMethod, String url, Map<String, List<String>> params) throws UamsClientException {

        String result = doRequest(httpMethod, url, params);

        try {
            List<T> t = JsonUtil.jsonToList(result, resultClass);
            return t;
        } catch (IOException e) {
            UamsClientException uce = transferException(e, result);
            throw uce;
        }

    }

    /**
     * 发起http请求,返回对象
     * @param resultClass
     * @param httpMethod
     * @param url
     * @param params
     * @param <T>
     * @return
     * @throws UamsClientException
     */
    private <T> T doRequestReturnObject(Class<T> resultClass, HttpMethod httpMethod, String url, Map<String, List<String>> params) throws UamsClientException {

        String result = doRequest(httpMethod, url, params);

        try {
            T t = JsonUtil.json2Object(result, resultClass);
            return t;
        } catch (IOException e) {
            UamsClientException uce = transferException(e, result);
            throw uce;
        }

    }


    /**
     * 发起http请求
     * @param httpMethod
     * @param url
     * @param params
     * @return
     * @throws UamsClientException
     */
    private String doRequest(HttpMethod httpMethod, String url, Map<String, List<String>> params) throws UamsClientException {

        ErrorInfo errorInfo = new ErrorInfo(ErrorCode.UNKNOWN_ERROR);
        errorInfo.setRequestUrl(url);


        HttpRequest request = new HttpRequest();
        String result = null;
        try {
            switch (httpMethod) {
                case GET : {
                    result = request.get(url, params);
                    break;
                }
                case POST : {
                    result = request.post(url, params);
                    break;
                }
            }
        } catch (IOException e) {
            log.error("请求uams server的时候发生错误", e);
            errorInfo.addErrorCodeObj(ErrorCode.STUB_REQUEST_ERROR);
            throw new UamsClientException(errorInfo);
        }
        if(StringUtils.isBlank(result)) {
            errorInfo.addErrorCodeObj(ErrorCode.SERVER_RESPONSE_NOTHING);
            throw new UamsClientException(errorInfo);
        }

        //解析result
        try {
            if(result.contains("errorCode") && result.contains("requestUrl")) {
                //服务器传来的错误消息
                ErrorInfo errorInfoFromServer = JsonUtil.json2Object(result, ErrorInfo.class);
                throw new UamsClientException(errorInfoFromServer);
            } else {
                //正常返回的数据
                return result;
            }
        } catch (IOException e) {
            UamsClientException uce = transferException(e, result);
            throw uce;
        }

    }

    private UamsClientException transferException(IOException e, String jsonResult) {
        String errorMsg = String.format("%s, json:[%s]", ErrorCode.PARSE_SERVER_RESPONSE_ERROR.msg, jsonResult);
        log.error(errorMsg, e);
        ErrorInfo errorInfo = new ErrorInfo(ErrorCode.PARSE_SERVER_RESPONSE_ERROR);
        errorInfo.setMsg(errorMsg);
        return new UamsClientException(errorInfo);
    }


    private static enum HttpMethod {
        GET, POST
    }


}
