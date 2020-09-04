// pages/buyvip/buyvip.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // generalExperts: {'availableTimes': 0, 'usedTimes': 0, 'totalTimes': 0},
    // specialExperts: { 'availableTimes': 0, 'usedTimes': 0, 'totalTimes': 0 },
    general_total:0,
    general_used:0,
    general_remain:0,
    special_total:0,
    special_used:0,
    special_remain:0,
    addition_info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVipInfoById()

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
  * 获取会员信息
  */
  getVipInfoById(){
  
  var that =this
  wx.request({
  url: 'https://yiwei.run/api/vip/getVipByUid',
  // url: 'http://localhost:8080/api/vip/getVipByUid',
    data: {
    id_user:app.globalData.id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log(res.data)
      var data=res.data.data[0]
      that.setData({
        general_total:data.general_total,
        general_used:data.general_used,
        general_remain:data.general_total-data.general_used,
        special_total:data.special_total,
        special_used:data.special_used,
        special_remain:data.special_total-data.special_used,
        addition_info: data.addition_info
      })
    }
})
},
redirectToDoctorList(){
   wx.switchTab({
     url: '/pages/doctorList/doctorList',
   })
}
})