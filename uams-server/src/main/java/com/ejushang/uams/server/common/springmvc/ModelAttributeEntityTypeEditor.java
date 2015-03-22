package com.ejushang.uams.server.common.springmvc;


import com.ejushang.uams.server.common.genericdao.dao.hibernate.GeneralDAO;
import org.apache.commons.lang3.StringUtils;

import java.beans.PropertyEditorSupport;

public class ModelAttributeEntityTypeEditor extends PropertyEditorSupport {

    private GeneralDAO generalDAO;

    private Class<?> entityClass;

    public ModelAttributeEntityTypeEditor(GeneralDAO generalDAO, Class<?> entityClass) {
        this.generalDAO = generalDAO;
        this.entityClass = entityClass;
    }

    public void setAsText(String text) throws IllegalArgumentException {
		text = text.trim();

        try {
            if (!StringUtils.isNumeric(text)) {
                setValue(entityClass.newInstance());
                return;
            }

            setValue(generalDAO.get(entityClass, Integer.parseInt(text)));
		} catch (Exception ex) {
			IllegalArgumentException iae = new IllegalArgumentException(
					"Could not get entity from id: " + ex.getMessage());
			iae.initCause(ex);
			throw iae;
		}
	}
}