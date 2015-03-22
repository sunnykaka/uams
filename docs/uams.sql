/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2014-6-5 18:53:20                            */
/*==============================================================*/


drop table if exists t_department;

drop table if exists t_employee;

drop table if exists t_employee_info;

drop table if exists t_employee_role;

drop table if exists t_operation;

drop table if exists t_resource;

drop table if exists t_role;

drop table if exists t_role_operation;

drop table if exists t_stub;

drop table if exists t_stub_role;

drop table if exists t_stub_role_operation;

drop table if exists t_sync_log;

drop table if exists t_user;

/*==============================================================*/
/* Table: t_department                                          */
/*==============================================================*/
create table t_department
(
   id                   int(11) not null auto_increment,
   code                 varchar(20) default NULL,
   create_time          datetime default NULL,
   name                 varchar(20) not null,
   update_time          datetime default NULL,
   parent_id            int(11) default NULL,
   primary key (id),
   unique key UK_iedx7mvwakh1hxmjkr5jj9nia (name),
   key FK_kbhtaoflrhdi9rhgbbjdt5s0m (parent_id)
)
ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_employee                                            */
/*==============================================================*/
create table t_employee
(
   id                   int(11) not null auto_increment,
   create_time          datetime default NULL,
   department_id        int(11) default NULL,
   password             varchar(255) default NULL,
   salt                 varchar(128) default NULL,
   status               varchar(255) default NULL,
   update_time          datetime default NULL,
   username             varchar(32) not null,
   employeeInfo_id      int(11) default NULL,
   root_user            bit(1) default NULL,
   primary key (id),
   key FK_4tfsdr0tkqecugee6qi0lucq0 (department_id),
   key FK_oxdj6m2bxc3umrj3pdmaa5jxv (employeeInfo_id)
)
ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_employee_info                                       */
/*==============================================================*/
create table t_employee_info
(
   id                   int(11) not null auto_increment,
   address              varchar(255) default NULL,
   age                  int(11) default NULL,
   eamil                varchar(255) default NULL,
   name                 varchar(32) default NULL,
   number               varchar(32) default NULL,
   position             varchar(32) default NULL,
   sex                  varchar(8) default NULL,
   tel                  varchar(64) default NULL,
   primary key (id)
)
ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_employee_role                                       */
/*==============================================================*/
create table t_employee_role
(
   id                   int(11) not null auto_increment,
   employee_id          int(11) default NULL,
   role_id              int(11) default NULL,
   primary key (id),
   key FK_ati1rn3t8x1qab6kacxxt56ej (employee_id),
   key FK_15fucytyoxt3clsuur6ki4x3s (role_id)
)
ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_operation                                           */
/*==============================================================*/
create table t_operation
(
   id                   int(11) not null auto_increment,
   configable           bit(1) default NULL,
   name                 varchar(32) default NULL,
   required             varchar(255) default NULL,
   resource_id          int(11) default NULL,
   url                  varchar(255) default NULL,
   primary key (id),
   key FK_nn5otc2hm2sb5x3fbnyhf9nam (resource_id)
)
ENGINE=InnoDB AUTO_INCREMENT=3005 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_resource                                            */
/*==============================================================*/
create table t_resource
(
   id                   int(11) not null auto_increment,
   entry_operation      varchar(32) default NULL,
   icon_cls             varchar(32) default NULL,
   module               varchar(32) default NULL,
   name                 varchar(32) default NULL,
   stub_id              int(11) default NULL,
   unique_key           varchar(32) default NULL,
   primary key (id),
   key FK_ahm5l8dovsu0oawu1jasuecfb (stub_id)
)
ENGINE=InnoDB AUTO_INCREMENT=431 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_role                                                */
/*==============================================================*/
create table t_role
(
   id                   int(11) not null auto_increment,
   create_time          datetime default NULL,
   name                 varchar(32) default NULL,
   update_time          datetime default NULL,
   primary key (id)
)
ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_role_operation                                      */
/*==============================================================*/
create table t_role_operation
(
   id                   int(11) not null auto_increment,
   operation_id         int(11) default NULL,
   role_id              int(11) default NULL,
   primary key (id),
   key FK_ii0sns0ull2pe42es3t5ahsin (operation_id),
   key FK_e8k2ekhnxncqf2s35ivrjxalr (role_id)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_stub                                                */
/*==============================================================*/
create table t_stub
(
   id                   int(11) not null auto_increment,
   create_time          datetime default NULL,
   name                 varchar(32) default NULL,
   password             varchar(255) default NULL,
   unique_no            varchar(32) default NULL,
   update_time          datetime default NULL,
   file_md5             varchar(128) default NULL,
   file_update_time     datetime default NULL,
   primary key (id),
   unique key UK_ocw3wci03epefx23ryg1ye7ym (name),
   unique key UK_8utro28g26nq1esbcmcd2stq (unique_no)
)
ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_stub_role                                           */
/*==============================================================*/
create table t_stub_role
(
   id                   int(11) not null auto_increment,
   role_id              int(11) default NULL,
   stub_id              int(11) default NULL,
   primary key (id),
   key FK_a1qaje8p763ebwg37ix1u0a6r (role_id),
   key FK_mlh9vufp07ud9v45ynhlrii9t (stub_id)
)
ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_stub_role_operation                                 */
/*==============================================================*/
create table t_stub_role_operation
(
   id                   int(11) not null auto_increment,
   operation_id         int(11) default NULL,
   stub_role_id         int(11) default NULL,
   primary key (id),
   key FK_8jr3y3vnvu6quwt949lb0e6s6 (operation_id),
   key FK_myoifjrquh9mhvw7oibbkypny (stub_role_id)
)
ENGINE=InnoDB AUTO_INCREMENT=2112 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_sync_log                                            */
/*==============================================================*/
create table t_sync_log
(
   id                   int(11) not null auto_increment,
   create_time          datetime default NULL,
   file_content         text,
   file_md5             varchar(128) default NULL,
   file_update_time     datetime default NULL,
   stub_id              int(11) default NULL,
   update_time          datetime default NULL,
   primary key (id),
   key FK_dn37ye7u907xh2oqijylhet9 (stub_id)
)
ENGINE=InnoDB AUTO_INCREMENT=249 DEFAULT CHARSET=utf8;

/*==============================================================*/
/* Table: t_user                                                */
/*==============================================================*/
create table t_user
(
   id                   int(11) not null auto_increment,
   create_time          datetime default NULL,
   password             varchar(255) default NULL,
   status               varchar(255) default NULL,
   update_time          datetime default NULL,
   username             varchar(255) not null,
   primary key (id)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table t_department add constraint FK_kbhtaoflrhdi9rhgbbjdt5s0m foreign key (parent_id)
      references t_department (id);

alter table t_employee add constraint FK_4tfsdr0tkqecugee6qi0lucq0 foreign key (department_id)
      references t_department (id);

alter table t_employee_role add constraint FK_ati1rn3t8x1qab6kacxxt56ej foreign key (employee_id)
      references t_employee (id);

alter table t_role_operation add constraint FK_e8k2ekhnxncqf2s35ivrjxalr foreign key (role_id)
      references t_role (id);

alter table t_role_operation add constraint FK_ii0sns0ull2pe42es3t5ahsin foreign key (operation_id)
      references t_operation (id);

alter table t_stub_role add constraint FK_a1qaje8p763ebwg37ix1u0a6r foreign key (role_id)
      references t_role (id);

alter table t_stub_role add constraint FK_mlh9vufp07ud9v45ynhlrii9t foreign key (stub_id)
      references t_stub (id);

alter table t_stub_role_operation add constraint FK_8jr3y3vnvu6quwt949lb0e6s6 foreign key (operation_id)
      references t_operation (id);

alter table t_stub_role_operation add constraint FK_myoifjrquh9mhvw7oibbkypny foreign key (stub_role_id)
      references t_stub_role (id);

alter table t_sync_log add constraint FK_dn37ye7u907xh2oqijylhet9 foreign key (stub_id)
      references t_stub (id);

