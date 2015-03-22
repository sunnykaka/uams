<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 14-3-17
  Time: 下午2:09
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
    <script>

        window.onload = function() {
            document.getElementById("addBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='employees';

                document.getElementById('hiddenMethod').value='post';

                $form.submit();
            }

            document.getElementById("updateBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='employees/' + document.getElementById('updateId').value;

                document.getElementById('hiddenMethod').value='put';

                $form.submit();
            }

            document.getElementById("deleteBtn").onclick = function(){
                var $form = document.getElementById("form1");
                $form.action='employees/' + document.getElementById('updateId').value+'?status=FROZEN';

                document.getElementById('hiddenMethod').value='put';

                $form.submit();
            }

            document.getElementById("restoreBtn").onclick = function(){
                var $form = document.getElementById("form1");
                $form.action='employees/' + document.getElementById('updateId').value+'?status=NORMAL';

                document.getElementById('hiddenMethod').value='put';

                $form.submit();
            }

            document.getElementById("findBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='employees/';

                document.getElementById('hiddenMethod').value='get';

                $form.submit();
            }

            document.getElementById("updateRoleBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='employees/roles/' + document.getElementById('updateId').value;

                document.getElementById('hiddenMethod').value='get';

                $form.submit();
            }
        }

    </script>
</head>
<body>
<form id="form1" action="employees" method="post">
    <input type="hidden" id="hiddenMethod" name="_method" value="post"/>
    用户名: <input type="text" name="username" id="username" /><br/>
    密码: <input type="text" name="password"  /><br/>
    地址：  <input type="text" name="employeeInfo.address"  /><br/>
    真实姓名： <input type="text" name="employeeInfo.name"  /><br/>
    年龄： <input type="text" name="employeeInfo.age"  /><br/>
    邮箱： <input type="text" name="employeeInfo.email"  /><br/>
    电话： <input type="text" name="employeeInfo.tel"  /><br/>
    职位： <input type="text" name="employeeInfo.position"  /><br/>
    工号： <input type="text" name="employeeInfo.number"  /><br/>
    性别： <input type="text" name="employeeInfo.sex"  /><br/>
    所属部门:<input type="text" name="departmentId"  /><br/>
    3门:<input type="text" name="department"  /><br/>

    角色:<input type="checkbox" name="roleId" value="1">超级管理员    <input type="checkbox" name="roleId" value="2">客服人员<br/>
         <input type="checkbox" name="roleId" value="3">客服经理

    <input type="button" value="添加" id="addBtn" />
    <input type="button" value="修改" id="updateBtn" />
    <input type="button" value="查找角色" id="updateRoleBtn" />
    <input type="button" value="查找" id="findBtn" />    <br/>





    修改id: <input type="text" id="updateId" name="updateId"  /><br/>
    <input type="button" value="冻结" id="deleteBtn" />
    <input type="button" value="恢复" id="restoreBtn" />
</form>

</body>
</html>