var mysql = require('./mysql');//�������ݿ�ģ��
var TEST_DATABASE = 'nodejs_mysql_test';//���ݿ���
var TEST_TABLE = 'user';//����
var client ;
var infodiv;

window.onload = function (){
	alert('helloworld');
    client = mysql.createConnection({  
        host : '127.0.0.1',  //������ַ
        user : 'root',  //���ݿ��û���
		port : '13306'
        password : '123456'//���ݿ�����
    }); 
    client.query('USE '+TEST_DATABASE);//ʹ�ø����ݿ�
    infodiv = document.getElementById("info"); 
       queryAll(); //��ѯ��������
}
 
 //���ڸ�ʽת��
Date.prototype.Format = function(fmt) 
{ 
  var o = { 
    "M+" : this.getMonth()+1,                  //�·� 
    "d+" : this.getDate(),                     //�� 
    "h+" : this.getHours(),                    //Сʱ 
    "m+" : this.getMinutes(),                  //�� 
    "s+" : this.getSeconds(),                  //�� 
    "q+" : Math.floor((this.getMonth()+3)/3), //���� 
    "S"  : this.getMilliseconds()               //���� 
  };   
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)  
    if(new RegExp("("+ k +")").test(fmt))  
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

//�������
function add(){
    var name =  document.getElementById("name");
    var password = document.getElementById("password");
    var date = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
    client.query('INSERT INTO '+TEST_TABLE+' SET username = ?, password = ?, created = ?',[name.value, password.value, date],function(err, results){
        if(results.insertId != null){
            alert("��ӳɹ�");
          }//���ؼ�¼id
    });
    infodiv.innerHTML=""; 
    queryAll();
}

//��ѯ��������
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

//ɾ������
function toremove(id){
    if(confirm("ȷ��ɾ����")){
    client.query("delete from user where id = ?", [ id ], function(err, results) {//ɾ��idΪ1�ļ�¼
    var str = JSON.stringify(results);
  /**result ���µ���Ϣ
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

//�޸�����
    /**client.query("update user set password = ? where id = ?", [ "123456", 4 ], function(err, results) {//�޸�idΪ1�ļ�¼��password
    var str = JSON.stringify(results);    
    alert(str);
//  alert(results);  
  /** result ���µ���Ϣ
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
 
client.end();//�ر�����