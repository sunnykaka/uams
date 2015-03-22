package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;

import javax.persistence.*;

/**
 * User: liubin
 * Date: 14-3-11
 */
@Entity
@Table(name = "t_stub_role_operation")
public class StubRoleOperation implements EntityClass<Integer> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "operation_id")
    private Integer operationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="operation_id", insertable = false, updatable = false)
    private Operation operation;

    @Column(name = "stub_role_id")
    private Integer stubRoleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="stub_role_id", insertable = false, updatable = false)
    private StubRole stubRole;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOperationId() {
        return operationId;
    }

    public void setOperationId(Integer operationId) {
        this.operationId = operationId;
    }

    public Operation getOperation() {
        return operation;
    }

    public void setOperation(Operation operation) {
        this.operation = operation;
    }

    public Integer getStubRoleId() {
        return stubRoleId;
    }

    public void setStubRoleId(Integer stubRoleId) {
        this.stubRoleId = stubRoleId;
    }

    public StubRole getStubRole() {
        return stubRole;
    }

    public void setStubRole(StubRole stubRole) {
        this.stubRole = stubRole;
    }
}
