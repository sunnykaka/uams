<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>

    <script>

        window.onload = function() {
            document.getElementById("addBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='users';

                document.getElementById('hiddenMethod').value='post';

                $form.submit();
            }

            document.getElementById("updateBtn").onclick = function() {
                var $form = document.getElementById("form1");
                $form.action='users/' + document.getElementById('updateId').value;

                document.getElementById('hiddenMethod').value='put';

                $form.submit();
            }
        }

    </script>
</head>
<body>
<form id="form1" action="users" method="post">
    <input type="hidden" id="hiddenMethod" name="_method" value="post"/>
    用户名: <input type="text" name="username"  /><br/>
    密码: <input type="text" name="password"  /><br/>
    <input type="button" value="添加" id="addBtn" />
    <input type="button" value="修改" id="updateBtn" />
    id: <input type="text" id="updateId" name="updateId"  /><br/>
</form>


</body>
</html>