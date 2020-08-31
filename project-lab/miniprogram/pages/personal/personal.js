const app=getApp()
Page({
  data: {
   is_doctor: 0,
   avatar:"../../src/icon/default.png",//未登录使用默认头像
   username:"点击注册",//未登录使用默认昵称
  },
  onLoad: function (options) {
    
    
  },
  onShow:function(){
    console.log(">..<")
    console.log(app.globalData)
    if(app.globalData.is_register==1){
      console.log(app.globalData)
    this.setData({
      is_doctor:app.globalData.is_doctor,
      username:app.globalData.name
    })
    if(app.globalData.is_doctor==1)
    {
      this.setData({
        avatar:app.globalData.avatar_url
      })
    }
  }
  },
  redirectToDoctorPersonal:function(e){
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/doctorPersonal/doctorPersonal',
      })
    }
  },

  redirectToCollect:function(e){
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  }
  },
  redirectToPatientList: function (e) {
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
    wx.navigateTo({
      url: '/pages/patientList/patientList',
    })
  }
  },
  
  redirectToBuyVip: function (e) {
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
    wx.navigateTo({
      url: '/pages/buyvip/buyvip',
    })
  }
  },
  redirectToChat: function (e) {
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
      if(app.globalData.is_doctor==1)
      {
    wx.navigateTo({
      url: '/pages/doctor_chat/doctor_chat',
    })
     }
    else{
      wx.navigateTo({
        url: '/pages/chat/chat',
      })
    }
    }
  
  },
  redirectToPrescription: function (e) {
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
    wx.navigateTo({
      url: '/pages/prescription/prescription',
    })
  }
  },
  redirectToRegister:function(){
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }
  },
  redirectToVipInfo: function (e) {
    if(app.globalData.is_register==0){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    else{
    wx.navigateTo({
      url: '/pages/vipInfo/vipInfo',
    })
  }
  },
})