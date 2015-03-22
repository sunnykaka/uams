package com.ejushang.uams.server.common.util;

/**
 * 
 * @author liubin
 *
 * @param <IDClass>
 */
public interface EntityClass<IDClass extends java.io.Serializable> {

	public IDClass getId();

    public void setId(IDClass id);
}