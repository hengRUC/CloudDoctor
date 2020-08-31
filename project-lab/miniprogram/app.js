//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      console.log("use wx cloud")
      wx.cloud.init({
        env: 'airobot-z9ted',
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    //使用云函数获取openid
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction login result: ', res)
        this.globalData.openid = res.result.openid
        this.getUserIdByOpenid(this.globalData.openid)
      }
    })

    //通过openid获取用户id，如果用户为第一次登录，则创建新的用户记录


    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  getUserIdByOpenid: function (openId) {
    var that = this;
    //请求用户id
    wx.request({
      // url: 'https://yiwei.run/api/user/getUserId',
      url: 'https://yiwei.run/api/user/getUserId',
      // url: 'http://localhost:8080/api/user/getUserId',
      data: {
        openid:openId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
          console.log(res.data)
          that.globalData.is_register = res.data.is_register
          that.globalData.is_doctor = res.data.is_doctor
          if(that.globalData.is_register==1) //如果已注册
          {
          that.globalData.id = res.data.data[0].id
          that.globalData.name = res.data.data[0].name
          that.globalData.contact_number = res.data.data[0].contact_number
          if(that.globalData.is_doctor==1)//如果是医生
          {
            that.globalData.name=res.data.data[0].doctor_name
            that.globalData.avatar_url="cloud://airobot-z9ted.6169-airobot-z9ted-1302168733/"+res.data.data[0].avatar
          }
          else{
            that.globalData.name=res.data.data[0].name
          }
          }
         
          console.log(that.globalData)
      }
    })
  },
  globalData: {
    is_register:0,//判断用户是否注册
    openid:"",
    id:0,
    is_doctor:0, //判断当前用户是否是医生
    name:"点击注册", //用户昵称
    contact_number:"",//联系方式
    avatar_url:""//医生头像
  }
}
)