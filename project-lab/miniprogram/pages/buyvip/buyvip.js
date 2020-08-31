// pages/buyvip/buyvip.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    modalHidden: true,
    modalContent: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从后段获取产品列表
    this.getAllCardList()
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

  onClickVipDetail: function (event) {
    console.log(event.currentTarget.dataset)
    var cardInfo = event.currentTarget.dataset.product
    this.setData({
      modalContent: {
        'title': cardInfo.title,
        'price': cardInfo.price,
        'info': cardInfo.introduction,
        'additioninfo': cardInfo.addition_info},
      modalHidden: false
    });
  },

  onClickVipBuy: function (event) {
    console.log(event.currentTarget.dataset)
    var product = event.currentTarget.dataset.card
    // 通过productid跳转至付款界面，付款后跳转至会员信息界面
    this.addCardOrder(product.id,product.price,product.general_num,product.special_num)

  },

  modalHide: function (e) {
    this.setData({
      modalHidden: true
    })
  },
   /**
   * 获取产品列表
   */
  getAllCardList: function () {
    var that =this
    wx.request({
    url: 'https://yiwei.run/api/card/getAllCardList',
    // url: 'http://localhost:8080/api/card/getAllCardList',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data)
        var data=res.data.data
        that.setData({
         cardList:data
        })
      }
  })
  },
   /**
   * 新增会员卡订单
   */
  addCardOrder: function(card_id,card_price,gen_num,spe_num){
    var that=this
    console.log("pay...")
       //预支付
   wx.request({
    url: 'https://yiwei.run/api/cardorder/addCardOrder',
    // url: 'http://localhost:8080/api/cardorder/addCardOrder',
    data: {
     openid:app.globalData.openid,
     id_user:app.globalData.id,
     id_card:card_id,
     price:card_price,
     status:1,//正常订单
     general_num:gen_num,
     special_num:spe_num
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log("response...")
      console.log(res)
      var order_id=res.data.orderid
      var prePayInfo=res.data.prePayInfo
      // 调起支付
      wx.requestPayment(
      {
        'timeStamp': prePayInfo.timeStamp,
        'nonceStr': prePayInfo.nonceStr,
        'package': prePayInfo.package,
        'signType': 'MD5',
        'paySign': prePayInfo.paySign,
        'success': function (res) {
          console.log(res)
          that.updateVipInfo(app.globalData.id,gen_num,spe_num)
         },
        'fail': function (res) {
          //订单失败或取消，更改订单状态
          that.cancelCardOrder(order_id)
          console.log(res)
         }
      })
    },
    fail(res){
      console.log("response...")
      console.log(res.data)
    },
  })
},
 /**
   * 取消订单，修改订单状态
   */
cancelCardOrder(id){
  console.log('cancel')
  wx.request({
    url: 'https://yiwei.run/api/cardorder/updateCardOrder',
    // url: 'http://localhost:8080/api/cardorder/updateCardOrder',
    data: {
     orderid:id,
     status:2//取消订单
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1000,
      });
    }
  })

},
redirectToVipInfo(){
  wx.redirectTo({
    url: '/pages/vipInfo/vipInfo',
  })
},
//更新vip信息
updateVipInfo(id_user,gen_num,spe_num){
  var that = this
  wx.request({
    url: 'https://yiwei.run/api/vip/updateVipInfo',
    // url: 'http://localhost:8080/api/vip/updateVipInfo',
    data: {
     id_user:id_user,
     general_total:gen_num, //为了方便借用general_total字段
     special_total:spe_num
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      that.redirectToVipInfo()
    }
  })



}
})