window.Info = {}
window.web2weapp = {
  preinit: function () {
    window.web2weapp.loadheadfile('https://res.wx.qq.com/open/js/jweixin-1.6.0.js', 'js')
    window.web2weapp.loadheadfile('https://res.wx.qq.com/open/js/cloudbase/1.1.0/cloud.js', 'js')
    document.head.innerHTML += `
    <title>跳转微信小程序</title>
      <script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
      <script src="https://res.wx.qq.com/open/js/cloudbase/1.1.0/cloud.js"></script>
      <meta name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
      <style>
        body {
          display: flex;
          flex-direction: column;
        }
        .model {
          width: 100%;
          max-width: 370px;
          display: flex;
          height: 30px;
          margin: 0 auto;
        }
        .btn {
          border: none;
          height: 75px;
          font-size: 14px;
          border-radius: 7px;
          background-color: #fff;
          width: 94%;
          margin: auto;
          text-align: center;
          line-height: 75px;
          font-size: 18px;
          color: #2a5aac;
          margin-top: 120px;
          max-width: 400px;
          outline: none;
          -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
          -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
          -o-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
        }
        .btn:active {
          background-color: #eee;
        }
      </style>`
  },
  init: function (tempInfo) {
    if (tempInfo == null && JSON.stringify(tempInfo) === '{}') {
      console.error('无有效信息，无法初始化')
      return
    }
    window.web2weapp.show()
    window.Info = tempInfo
    if (window.web2weapp.isWeixinBrowser() && !window.web2weapp.isQWeixinBrowser()) {
      window.wx.config({
        appId: window.Info.appId,
        timestamp: 0,
        nonceStr: 'nonceStr',
        signature: 'signature',
        jsApiList: ['openWeApp'],
        openTagList: ['wx-open-launch-weapp'],
        debug: false
      })
      window.wx.ready(function () {
        var btn = document.getElementById('launch-btn')
        btn.setAttribute('username', window.Info.gh_ID)
        btn.setAttribute('path', window.Info.path)
        btn.style = ''
        btn.addEventListener('launch', function (e) {
          console.log('success', e)
        })
        btn.addEventListener('error', function (e) {
          console.log('fail', e)
        })
      })
    } else {
      window.web2weapp.initWeapp()
    }
  },
  show: function () {
    document.body.innerHTML = `
    <wx-open-launch-weapp id="launch-btn" username="" class="model" style="display: none;">
      <template>
        <style>
          .btn {
            border: none;
            height: 75px;
            font-size: 14px;
            border-radius: 7px;
            background-color: #fff;
            width: 100%;
            margin: auto;
            text-align: center;
            line-height: 75px;
            font-size: 18px;
            color: #2a5aac;
            margin-top: 120px;
            outline: none;
            -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
            -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
            -o-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset;
          }

          .btn:active {
            background-color: #eee;
          }
        </style>
        <button class="btn">点击进入微信小程序</button>
      </template>
    </wx-open-launch-weapp>
    <button class="btn" onclick="window.web2weapp.openWeapp()" id="public-btn" style="display: none;">点击进入微信小程序</button>
  `
    document.body.setAttribute('onselectstart', 'return false')
  },
  initWeapp: async function () {
    window.tcb = new window.cloud.Cloud({
      identityless: true,
      resourceAppid: window.Info.appId,
      resourceEnv: window.Info.env_ID
    })
    await window.tcb.init()
    const res = await window.tcb.callFunction(window.Info.function)
    console.log(res)
    document.getElementById('public-btn').style = ''
    window.minihref = res.result.openlink
    if (window.web2weapp.getQueryVariable('auto')) {
      window.location.href = window.minihref
    }
  },
  openWeapp: function () {
    window.location.href = window.minihref
  },
  isWeixinBrowser: function () {
    var agent = navigator.userAgent.toLowerCase()
    if (agent.match(/MicroMessenger/i) == 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  isQWeixinBrowser: function () {
    var agent = navigator.userAgent.toLowerCase()
    console.log(agent)
    if (agent.match(/wxwork/i) == 'wxwork') {
      return true
    } else {
      return false
    }
  },
  getQueryVariable: function (variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] === variable) { return pair[1] }
    }
    return (false)
  },
  loadheadfile (filename, filetype) {
    let fileref = null
    if (filetype === 'js') {
      fileref = document.createElement('script')
      fileref.setAttribute('type', 'text/javascript')
      fileref.setAttribute('src', filename)
    } else if (filetype === 'css') {
      fileref = document.createElement('link')
      fileref.setAttribute('rel', 'stylesheet')
      fileref.setAttribute('type', 'text/css')
      fileref.setAttribute('href', filename)
    }
    if (typeof fileref !== 'undefined') {
      document.getElementsByTagName('head')[0].appendChild(fileref)
    }
  }
}
window.web2weapp.preinit()
