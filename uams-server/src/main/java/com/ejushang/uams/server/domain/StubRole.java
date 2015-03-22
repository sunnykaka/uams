package com.ejushang.uams.server.domain;

import com.ejushang.uams.server.common.util.EntityClass;

import javax.persistence.*;
import java.util.List;

/**
 * User:moon
 * Date: 14-3-12
 * Time: 下午3:46
 */
@Entity
@Table(name="t_stub_role")
public class StubRole implements EntityClass<Integer> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name="stub_id")
    private Integer stubId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="stub_id",insertable = false,updatable = false)
    private Stub stub;

    @Column(name="role_id")
    private Integer roleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id",insertable = false,updatable = false)
    private Role role;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStubId() {
        return stubId;
    }

    public void setStubId(Integer stubId) {
        this.stubId = stubId;
    }

    public Stub getStub() {
        return stub;
    }

    public void setStub(Stub stub) {
        this.stub = stub;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}