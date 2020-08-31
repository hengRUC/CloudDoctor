const app = getApp()
Page({
  data: {
    animationData: {},
    islogin:0 ,//是否点击登录/注册
    phoneNumber:0,
  },
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
 login: function(){
   var that = this
   that.tranlateAnimation()

 },
// 登录成功：跳转我的界面
redirectToPersonal(){
  wx.switchTab({
    url: '/pages/personal/personal',
    success: function (res) {
    }
  })
 },
 // 跳转用户注册
redirectToRegister(){
  var that=this
  wx.redirectTo({
    url: '/pages/userRegister/userRegister'
  })
 },
//向上滑动动画
tranlateAnimation:function(){
  var animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'ease',
  })

  this.animation = animation


  this.setData({
    animationData:animation.export()
  })

  setTimeout(function() {
    animation.translate(0,-50).step()
    this.setData({
      animationData:animation.export(),
      islogin:1
    })
  }.bind(this), 1000)
},
//获取用户绑定的手机号
getPhoneNumber (e) {
  console.log(e)
  if(e.detail.cloudID){
  var that = this;
  //云函数获取手机号
  wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
          weRunData: wx.cloud.CloudID(e.detail.cloudID),
      }
      }).then(res => {
      that.setData({
          phoneNumber: res.result,
      })
     app.globalData.contact_number=res.result
     that.checkIfDoctor()
  }).catch(err => {
      console.error(err);
  });
  }
},
//使用手机号判断是否为医生
checkIfDoctor(){
  var that =this
  //添加医生
  wx.request({
  url: 'https://yiwei.run/api/doctor/getDoctorByContactNumber',
  // url: 'http://localhost:8080/api/doctor/getDoctorByContactNumber',
   data: {
    contact_number:that.data.phoneNumber,
   },
   header: {
     'content-type': 'application/json' // 默认值
   },
   method: 'POST',
   success(res) {
     console.log(res)
    //如果返回医生列表不为空，则注册医生账号，跳转我的界面
    if(res.data.data.length!=0)
    {
      that.addDoctorByContactNumber()
    }
    else{
    //否则跳转患者注册界面
      that.redirectToRegister()
    }
   }
 })
},
//将openid加入医生信息
addDoctorByContactNumber(){
  var that =this
  //添加医生
  wx.request({
  url: 'https://yiwei.run/api/doctor/addDoctorByContactNumber',
  // url: 'http://localhost:8080/api/doctor/addDoctorByContactNumber',
   data: {
    contact_number:that.data.phoneNumber,
    openid:app.globalData.openid
   },
   header: {
     'content-type': 'application/json' // 默认值
   },
   method: 'POST',
   success(res) {
     console.log(res) 
     //将返回的id写入globalData
     app.globalData.id=res.data.data.id
     //切换is_register的值
     app.globalData.is_register=1
     app.globalData.is_doctor=1
     app.globalData.name=res.data.data.doctor_name
     console.log("@_@")
     console.log(app.globalData)
     that.redirectToPersonal()
   }
 })
}
})


