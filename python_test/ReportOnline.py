import threading
import os,time
import urllib.request,re,json,http.client

#上报HTTP
def PostInfoToHttp(jsonstr):
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
    conn = http.client.HTTPConnection('114.80.107.136',8081)
    conn.request("POST", "/w_alert",jsonstr,headers)
    #conn = http.client.HTTPConnection('www.baidu.com')
    #conn.request("GET", "/index.html")
    response = conn.getresponse()
    ret = response.read()
    result = 'jsonstr' + jsonstr + 'ret ' + str(ret)
    print(result)
    conn.close()    
    
#解析字符串 组成JSON格式的URL http://114.80.107.136:8081/w_alert 
def GetJSONFromStr(str):
    strlist = str.split(',')
    jsonstr = '{"id":"1087","time":"' + strlist[0] + '","data":{"'+strlist[2]+'":"'+strlist[1]+'"}}'
    return jsonstr
    
#读取分析文件
def GetlastFileInfo(fullpath):
    file = open(fullpath,'r')
    targetline=""
    for line in file.readlines():
        targetline = line
    targetline = targetline.strip('\n')
    jsonstr = GetJSONFromStr(targetline)
    PostInfoToHttp(jsonstr)

#循环函数    
def TimeRun():
    filepath = 'D:\FileLog\\tab_online_account\\tab_online_account_' + time.strftime('%Y%m%d_%H',time.localtime(time.time())) + '.log'    
    GetlastFileInfo(filepath)
    global t        #Notice: use global variable!
    t = threading.Timer(60.0, TimeRun)
    t.start()

t = threading.Timer(60.0, TimeRun)
t.start()
