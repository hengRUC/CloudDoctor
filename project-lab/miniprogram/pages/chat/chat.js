// pages/chat/chat.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    val: '',
    // orderList: [{ name: '吴医生', src: 'http://img1.imgtn.bdimg.com/it/u=105692044,3597038919&fm=27&gp=0.jpg', cue: '血糖控制异常', status: 2 }, { name: '张医生', src: 'http://img1.imgtn.bdimg.com/it/u=105692044,3597038919&fm=27&gp=0.jpg', status: 1 }],
    orderList: [],
    toView: 1
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getChatRooms()
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
   * 获取订单列表
   */
  getChatRooms:function()
  {
    var that = this
    //请求医生列表
    wx.request({
      url: 'http://119.45.143.38:80/api/chatorder/getChatOrderByPatientId',
      data: {
        id_patient: app.globalData.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data)
        let resp = res.data.data
        //异常处理
        that.setData(
          {
            orderList: resp,
          }
        )
      }
    })
  },
  /**
   * 跳转至对应聊天界面
   */
  redirectToChatRoom: function (event) {
    console.log(event.currentTarget.dataset.item)
    var groupid = event.currentTarget.dataset.item.groupid
    var doctor_name = event.currentTarget.dataset.item.doctor_name
    var doctor_avatar = event.currentTarget.dataset.item.doctor_avatar
    var state=event.currentTarget.dataset.item.state
    console.log(state)
    if(state==1){
    wx.navigateTo({
      url: '/pages/room/room',
      success: function (res) {
        var chatinfo={
          groupid: groupid,
          doctor_name:doctor_name,
          doctor_avatar:doctor_avatar
        }
        // 通过eventChannel向被打开页面传送数据
        //res.eventChannel.emit('sendData', roomid)
        res.eventChannel.emit('sendData', chatinfo)
      }
    })}
    else if(state==2){
      wx.showToast({
        icon: 'none',
        title: '预约还未开始！',
      })
    }
    // else if(state==3){
    //   wx.showToast({
    //     icon: 'none',
    //     title: '预约已经结束！',
    //   })
    // }
  },
  showToast(){
    wx.showToast({
      icon: 'none',
      title: '预约还未开始！',
    })
  }

})