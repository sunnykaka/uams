package com.ejushang.uams.server.domain;

import com.ejushang.uams.enumer.EmployeePosition;
import com.ejushang.uams.server.common.util.EntityClass;

import javax.persistence.*;

/**
 * User:moon
 * Date: 14-3-11
 * Time: 上午10:29
 */
@Entity
@Table(name = "t_employee_info")
public class EmployeeInfo implements EntityClass<Integer> {
    /**id*/

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    /** 名字*/
    @Column(name="name", length = 32)
    private String name;

    /**工号*/
    @Column(name="number", length = 32)
    private String number;

    /**性别*/
    @Column(name="sex", length = 8)
    private String sex;

    /**年龄*/
    @Column(name="age")
    private Integer age;

    /**电话*/
    @Column(name="tel", length = 64)
    private String  tel;

    /**家庭住址*/
    @Column(name="address", length = 255)
    private String  address;

    /**e-mail*/
    @Column(name="eamil", length = 255)
    private String  email;

    /**职位*/
    @Column(name="position", length = 32)
    @Enumerated(EnumType.STRING)
    private EmployeePosition position;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public EmployeePosition getPosition() {
        return position;
    }

    public void setPosition(EmployeePosition position) {
        this.position = position;
    }




}
