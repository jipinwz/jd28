/*
入口 京东 我的 全民挖现金
运行一次查看邀请码 变量你的邀请码 
export shareCode="FCD4A7E5CB4AF69377D77E9B4553CF6CAD1DAAB9A3E3F6CBAFDE81EEB7393333"
[task_local]
0 10 * * *
*/

const $ = new Env('柠檬全民挖现金');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let allMessage = '';
let shareCode = '';
if (process.env.shareCode) {
  shareCode = process.env.shareCode;
}
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
await list1()
await info()
await helpme()
//await helpme1()
await dslq()

    }
  }
  if ($.isNode() && allMessage) {
        await notify.sendNotify(`${$.name}`, `${allMessage}` )
    }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })
function list1() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/client.action`,

    body: `functionId=tc_taskList&body={"appId":"1EFRSww"}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
headers: {
"Origin": "https://h5.m.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Cookie": cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    data = JSON.parse(data);
                     if(data.data.bizCode == 0){
                     let taskList = data.data.result.taskVos[0].shoppingActivityVos
                     for (let i = 0 ; i < taskList.length; i++){
                     taskToken = taskList[i].taskToken
                     await dotask(taskToken)
                     await task(1)
                     //await task(2)
                     }
                     let taskList1 = data.data.result.taskVos[1].shoppingActivityVos
                     for (let i = 0 ; i < taskList1.length; i++){
                     taskToken = taskList1[i].taskToken
                     await dotask(taskToken)
                     //await task(1)
                     await task(2)
                     }


                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function helpme() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/client.action`,

    body: `functionId=help_activity&body={"shareCode":"${shareCode}","name":"","imageUrl":""}&client=wh5&clientVersion=1.0.0&osVersion=10&uuid=7049442d7e415232`,
headers: {
"Origin": "https://h5.m.jd.com",
"Host": "api.m.jd.com",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Cookie": "cuid=eidIe2798122d1s4GEix%252FuspRjy92JqJ273YghhIs3JZdi%252F4JjftGCWZOLgY3glC5gGXsTY1vGLRKckMeHq2opKqTBNLiayOHJtx2EhExIqlbarZpTFa;"+cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    data = JSON.parse(data);
                 
                   
                   
                    if(data.ret == 0){
$.log("\n助力："+data.helpAmount*0.01)
                        
                    }else if(data.ret == 2){
$.log(`\n${data.msg}`)
}else if(data.ret == 7){
$.log(`\n${data.msg}`)
}
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function dotask(taskToken) {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/client.action `,

    body: `functionId=tc_doTask&body={"taskToken":"${taskToken}"}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
headers: {
"Origin": "https://h5.m.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Cookie": cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    data = JSON.parse(data);
                 
                   
                   
                    if(data.data.bizCode == 0){

                               $.log(`\n${data.data.bizMsg}`)
}else if(data.data.bizCode == 103){
    $.log(`\n${data.data.bizMsg}`)
}
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}



function task(taskId) {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com`,

    body: `functionId=cash_task_getReward&body={"taskId":${taskId}}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
headers: {
"Origin": "https://h5.m.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Cookie": cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    data = JSON.parse(data);
                 if(data.ret == 4){
                    $.log(data.msg)
                 }else if(data.ret == 5){
                      $.log(data.msg)
                 } 


            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function dslq() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com`,

    body: `functionId=meal_checkIn_getReward&body={}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
headers: {
"Origin": "https://h5.m.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Cookie": cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    data = JSON.parse(data);
                 
                   //$.log(data)
                   
                    if(data.ret == 0){
 $.log(`\n下一次领取时间：${data.data.nextTime}`+"\n领取定时奖励："+data.data.reward*0.01)
 }else if(data.ret == 4){
    $.log(data.msg)
}
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function info() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com`,

    body: `functionId=fission_index&body={"activityKey":"2021"}&client=wh5&clientVersion=1.0.0&osVersion=14.3&uuid=6898c30638c55142969304c8e2167997fa59eb51`,
headers: {
"Origin": "https://h5.m.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Cookie": cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    data = JSON.parse(data);
                 
                   
                   
                    if(data.msg == "success"){
 $.log(`\n你的邀请码：${data.activity.shareCode}`)
 }else if(data.code == 1){
    $.log(`\n查询失败`)
}
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function helpme1() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com`,

    body: `functionId=current_activity&body={"shareCode":"FCD4A7E5CB4AF69377D77E9B4553CF6CAD1DAAB9A3E3F6CBAFDE81EEB7393333"}&client=wh5&clientVersion=1.0.0&osVersion=10&uuid=7049442d7e415232`,
headers: {
"Origin": "https://h5.m.jd.com",
"Host": "api.m.jd.com",
      "User-Agent": "jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/56.42;apprpd/;ref/JDLTSubMainPageViewController;psq/38;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|99;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Cookie": cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    //data = JSON.parse(data);
                 
                   
                   
                    //if(data.msg == "success"){
 $.log(data)
 //}
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}










function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data["retcode"] === 13) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data["retcode"] === 0) {
              $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName;
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
