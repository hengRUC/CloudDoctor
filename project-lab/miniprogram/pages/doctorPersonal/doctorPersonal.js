// miniprogram/pages/doctorPersonal/doctorPersonal.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getChatNumByDoctorId()
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
   /**
   * 获取订单数
   */
  getChatNumByDoctorId:function()
  {
    var that = this
    //请求医生列表
    wx.request({
      url: 'https://yiwei.run/api/chatorder/getChatNumByDoctorId',
      // url: 'http://localhost:8080/api/chatorder/getChatNumByDoctorId',
      data: {
        id_doctor: app.globalData.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data)
        let resp = res.data.data.length
        
        //异常处理
        that.setData(
          {
            patientNum: resp
          }
        )

      }
    })
  }
})