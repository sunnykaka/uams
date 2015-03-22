<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 14-3-18
  Time: 上午11:31
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
                $form.action='departments';

                document.getElementById('hiddenMethod').value='post';

                $form.submit();
            }

            document.getElementById("updateBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='departments/' + document.getElementById('updateId').value;

                document.getElementById('hiddenMethod').value='put';

                $form.submit();
            }

            document.getElementById("deleteBtn").onclick = function(){
                var $form = document.getElementById("form1");
                $form.action='departments/' + document.getElementById('updateId').value;

                document.getElementById('hiddenMethod').value='delete';

                $form.submit();
            }

            document.getElementById("findBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='departments/';

                document.getElementById('hiddenMethod').value='get';

                $form.submit();
            }
        }

    </script>
</head>
<body>
<h1>部门测试</h1>
=======id自动生成======= <br/>
<form id="form1" action="employees" method="post">
    <input type="hidden" id="hiddenMethod" name="_method" value="post"/>
部门编号:  <input type="text" name="code" id="code" /><br/>
部门名称： <input type="text" name="name" id="name" /><br/>
所属部门ID：<input type="text" name="parentId" id="parentId" /><br/>
修改Id：   <input type="text" id="updateId" name="updateId"  /><br/>
<input type="button" value="添加" id="addBtn" />
<input type="button" value="修改" id="updateBtn" />
<input type="button" value="删除" id="deleteBtn" />
<input type="button" value="查找" id="findBtn" />
    </form>


</body>
</html>