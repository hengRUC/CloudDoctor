// miniprogram/pages/doctorRegister/doctorRegister.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact_number:"",
    name:'请输入您的真实姓名',
    title:'健康管理',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    expert:'',
    introduction:'',
    images:[],
    avatar:'',
    currentRegion:"请选择所在地区"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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
   * 输入框获取医生姓名
   */
  getName: function (e) {
    //console.log(e.detail.value)
    this.data.name = e.detail.value
  },
   


  /**
  * 提交注册
  */
  Submit(){
   console.log("submit")
   this.addUser()
  },
  /**
  * 添加用户
  */
 addUser(){
   var that =this
  wx.request({
  url: 'https://yiwei.run/api/user/addUser',
  // url: 'http://localhost:8080/api/user/addUser',
   data: {
    openid:app.globalData.openid,
    name:that.data.name,
    contact_number:app.globalData.contact_number,
    region:that.data.region[0]+that.data.region[1]+that.data.region[2]
   },
   header: {
     'content-type': 'application/json' // 默认值
   },
   method: 'POST',
   success(res) {
     console.log(res)
     //将返回的id写入globalData
     app.globalData.id=res.data.data[0].id
     //切换is_register的值
     app.globalData.is_register=res.data.is_register
     app.globalData.name=res.data.data[0].name
     that.addVip()
   }
 })
},
  /**
  * 把医生的openid写入数据库
  */
  addDoctor(){
    console.log("addDoctor")
    //添加医生
    wx.request({
    url: 'https://yiwei.run/api/doctor/addDoctor',
     data: {
      openid:app.globalData.openid,
      contact_number:app.globalData.contact_number
     },
     header: {
       'content-type': 'application/json' // 默认值
     },
     method: 'POST',
     success(res) {
     console.log(res)
     //将返回的id写入globalData
     app.globalData.id=res.data.data[0].id
     //切换is_register的值
     app.globalData.is_register=res.data.is_register
     app.globalData.name=res.data.data[0].doctor_name
     that.redirectToPersonal()

     }
   })
  },
  //添加vip信息
  addVip()
  {
    var that =this
    wx.request({
    url: 'https://yiwei.run/api/vip/addVip',
    // url: 'http://localhost:8080/api/vip/addVip',
     data: {
      id_user:app.globalData.id,
     },
     header: {
       'content-type': 'application/json' // 默认值
     },
     method: 'POST',
     success(res) {
       console.log(res)
       that.redirectToPersonal()
     }
   })
  },
   /**
  * 上传图片
  */
 uploadPic : function () {
  var that = this
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {   
      // tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths
      var list=[]
      list.push(tempFilePaths)
      that.setData({
        images:tempFilePaths
      })
      console.log(that.data.images)
  }
})
},
//删除图片
deleteImage : function(event){
  var index = event.currentTarget.dataset.idx
  let that = this
  that.data.images.splice(index, 1)
  that.setData({
    images: that.data.images
  })
},
//上传图片到云端
uploadImagesToCloud()
{ 
  // 云函数上传
  var that=this
  let timestamp = (new Date()).valueOf();
  let pics='doctor/'+timestamp + '.png'
  console.log("pics="+pics)
  wx.cloud.uploadFile({
    cloudPath: pics,
    filePath: that.data.images[0],
    success: res => {
      console.log('上传成功', res)
    },
    fail: e => {
      console.error('[上传文件] 失败：', e)
      wx.showToast({
        icon: 'none',
        title: '上传失败',
      })
    }
  })
  that.setData({
    avatar:pics
  })
},
// 我的界面
redirectToPersonal(){
  wx.switchTab({
    url: '/pages/personal/personal'
  })
 },
 bindRegionChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    region: e.detail.value
  })
}
})