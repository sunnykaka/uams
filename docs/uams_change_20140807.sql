
/*===================================*/
/* 修正TAO_BAO平台的所有订单优惠，及其订单项优惠金额*/
/*===================================*/
use uams;

alter table t_department modify column code varchar(128);
alter table t_department modify column name varchar(128);

alter table t_resource modify column name varchar(256);
alter table t_resource modify column unique_key varchar(256);
alter table t_resource modify column icon_cls varchar(256);
alter table t_resource modify column module varchar(256);
alter table t_resource modify column entry_operation varchar(256);
