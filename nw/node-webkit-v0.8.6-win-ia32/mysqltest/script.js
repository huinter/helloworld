var mysql = require('./mysql');//加载数据库模块
var TEST_DATABASE = 'nodejs_mysql_test';//数据库名
var TEST_TABLE = 'user';//表名
var client ;
var infodiv;

window.onload = function (){
	alert('helloworld');
    client = mysql.createConnection({  
        host : '127.0.0.1',  //主机地址
        user : 'root',  //数据库用户名
		port : '13306'
        password : '123456'//数据库密码
    }); 
    client.query('USE '+TEST_DATABASE);//使用该数据库
    infodiv = document.getElementById("info"); 
       queryAll(); //查询所有数据
}
 
 //日期格式转换
Date.prototype.Format = function(fmt) 
{ 
  var o = { 
    "M+" : this.getMonth()+1,                  //月份 
    "d+" : this.getDate(),                     //日 
    "h+" : this.getHours(),                    //小时 
    "m+" : this.getMinutes(),                  //分 
    "s+" : this.getSeconds(),                  //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()               //毫秒 
  };   
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)  
    if(new RegExp("("+ k +")").test(fmt))  
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

//添加数据
function add(){
    var name =  document.getElementById("name");
    var password = document.getElementById("password");
    var date = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
    client.query('INSERT INTO '+TEST_TABLE+' SET username = ?, password = ?, created = ?',[name.value, password.value, date],function(err, results){
        if(results.insertId != null){
            alert("添加成功");
          }//返回记录id
    });
    infodiv.innerHTML=""; 
    queryAll();
}

//查询所有数据
function queryAll(){
     client.query('select * from  '+TEST_TABLE,function(err, results){ 
        var info="id  &nbsp;&nbsp;username &nbsp; &nbsp; &nbsp;password&nbsp;  &nbsp;createdate</br>";
        for(var i = 0; i < results.length; i++){
            var person = results[i];
            var date=new Date(person.created);
            var dateStr = date.Format("yyyy-MM-dd");
            info += person.id + " &nbsp; &nbsp;" + person.username + " &nbsp; &nbsp;" + person.password + " &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" +dateStr + "&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<lable onclick='toremove("+person.id+");'>delete</lable> </br>";
        }
        infodiv.innerHTML=info; 
    }); 
}

//删除数据
function toremove(id){
    if(confirm("确定删除？")){
    client.query("delete from user where id = ?", [ id ], function(err, results) {//删除id为1的记录
    var str = JSON.stringify(results);
  /**result 如下的信息
      {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          serverStatus: 2,
          warningCount: 0,
          message: '',
          protocol41: true,
          changedRows: 0 
      }
  */    infodiv.innerHTML=""; 
        queryAll();
    });
}
}

//修改数据
    /**client.query("update user set password = ? where id = ?", [ "123456", 4 ], function(err, results) {//修改id为1的记录的password
    var str = JSON.stringify(results);    
    alert(str);
//  alert(results);  
  /** result 如下的信息
      {      fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          serverStatus: 2,
          warningCount: 0,
          message: '(Rows matched: 1  Changed: 1  Warnings: 0',
          protocol41: true,
          changedRows: 1 
      }
  
});  */
 
client.end();//关闭连接