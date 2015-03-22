package com.ejushang.uams.server.api.util;

import com.ejushang.uams.api.dto.OperationDto;
import com.ejushang.uams.api.dto.ResourceDto;
import com.ejushang.uams.server.domain.Operation;
import com.ejushang.uams.server.domain.Resource;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Joyce.qu
 * Date: 14-4-3
 * Time: 下午5:31
 * To change this template use File | Settings | File Templates.
 */
public class ResourceUtil {

    public List<ResourceDto> getResourceDtos(List<Resource> resources) {
        List<ResourceDto> resourceDtos = new ArrayList<ResourceDto>();
        for (int i=0;i<resources.size();i++){
            ResourceDto resourceDto = new ResourceDto();
            List<OperationDto> operationDtos = new ArrayList<OperationDto>();
            resourceDto.setId(resources.get(i).getId());
            resourceDto.setName(resources.get(i).getName());
            resourceDto.setEntryOperation(resources.get(i).getEntryOperation());
            resourceDto.setHasEntryOperation(false);
            for (Operation operation:resources.get(i).getOperationList()) {
                if (operation.getName().equals(resources.get(i).getEntryOperation())){
                    resourceDto.setHasEntryOperation(true);
                }
            }
            resourceDto.setIconCls(resources.get(i).getIconCls());
            resourceDto.setModule(resources.get(i).getModule());
            resourceDto.setUniqueKey(resources.get(i).getUniqueKey());
            for (int j =0;j<resources.get(i).getOperationList().size();j++){
                OperationDto operationDto = new OperationDto();
                operationDto.setId(resources.get(i).getOperationList().get(j).getId());
                operationDto.setName(resources.get(i).getOperationList().get(j).getName());
                operationDto.setConfigable(resources.get(i).getOperationList().get(j).getConfigable());
                operationDto.setRequired(resources.get(i).getOperationList().get(j).getRequired());
                operationDto.setUrl(resources.get(i).getOperationList().get(j).getUrl());
                operationDtos.add(operationDto);
            }
            resourceDto.setOperationList(operationDtos);
            resourceDtos.add(resourceDto);
        }

        return resourceDtos;
    }
}
