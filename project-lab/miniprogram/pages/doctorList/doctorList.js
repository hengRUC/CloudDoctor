// pages/doctorList/doctorList.js
//云文件存储路径
const app=getApp()
const cloudPath="cloud://airobot-z9ted.6169-airobot-z9ted-1302168733/"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search:'',
    doctorList:[],
    typeArray:[
      {type:'神经内科',status:1,index:0},
      {type:'耳鼻喉科',status:0,index:1},
      {type:'骨科',status:0,index:2},
      {type:'神经外科',status:0,index:3},
      {type:'眼科',status:0,index:4},
      {type:'泌尿科',status:0,index:5},
      {type:'血液科',status:0,index:6},
    ],
    currentChosen:0,//当前选中
    StorageFlag:true,
    searcherStorage:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDoctorByDepartment('神经内科');
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
   * 按科室获取医生列表
   */
  getDoctorByDepartment: function(type){
    var that = this
    //请求医生列表
    wx.request({
      url: 'https://yiwei.run/api/doctor/getDoctorByDepartment',
      // url: 'http://localhost:8080/api/doctor/getDoctorByDepartment',
      data: {
        department: type,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data)
        let resp = res.data.data
        for(var t in resp)
        {
          //获取头像图片
          var picString = cloudPath+resp[t].avatar         
          resp[t].avatar=picString
          //截断介绍
          var expertString = resp[t].expert.substring(0,24)+"..."
          resp[t].expert=expertString
          //截断title
          var titleString = resp[t].title.substring(0,5)
          resp[t].title=titleString
        }

        //异常处理
        that.setData(
          {
            doctorList: resp,
          }
        )
        
      }
    })
  },
   /**
   * 按关键词获取医生列表
   */
  getDoctorByText: function(text){
    var that = this
    //请求医生列表
    wx.request({
      url: 'https://yiwei.run/api/doctor/getDoctorByText',
      data: {
        key: text,
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
            doctorList: resp,
          }
        )
      }
    })
  },
  /**
   * 响应点击左侧科室列表点击事件
   */
  onClickDepartment: function (event) {
    console.log(event.currentTarget.dataset.department)
    var item = event.currentTarget.dataset.department
    var index=this.data.currentChosen
    var oldItem = "typeArray["+index+"].status";
    var newItem = "typeArray["+item.index+"].status";
    this.setData({
      [oldItem]:0,
      [newItem]:1,
      currentChosen:item.index
    })
    // this.data.typeArray[this.data.currentChosen].status=0
    // this.data.typeArray[item.index].status=1
    // this.data.currentChosen=item.index
    // console.log(this.data)
    this.getDoctorByDepartment(item.type)
  },

  /**
       * 获取输入框输入
       */
  bindSearch: function (e) {
    // console.log(e.detail.value)
    var inputValue=e.detail.value
    if(inputValue=='')
    {
      this.setData({
      searcherStorage:[]
    })
   }
    else{
      //查询缓存
    var searchData = wx.getStorageSync(inputValue[0])
    this.setData({
      searcherStorage:searchData
    })
  }

    this.setData({
      search:e.detail.value
    })
  },

  /**
     * 响应搜索点击事件
     */
  onClickSearch: function (event) {
    console.log(this.data.search)
    var searchData=this.data.search
    if(searchData!='')//非空时才调起搜索
    {
      //调用API向本地缓存存入数据
      var searchKey=searchData[0]
      var searchArr = wx.getStorageSync(searchKey) || []
      console.log(searchArr)
      var flag=false;  
      for(var i=0;i<searchArr.length;i++){
          if(searchArr[i]["text"]==searchData)
          {
            searchArr[i]["hot"]+=1;
            flag=true;
          }
        }
        if(!flag){
          var newSearchData={}
          newSearchData["text"]=searchData
          newSearchData["hot"]=1
          searchArr.push(newSearchData)
        }  
      wx.setStorageSync(searchKey,searchArr) 
      this.getDoctorByDepartment(this.data.search)
      this.setData({
        searcherStorage:[]
      })
    }
  },

  /**
     * 响应咨询按钮点击事件
     */
  onClickConsult: function (event) {
    console.log(event.currentTarget.dataset.doctorid)
    var doctorid = event.currentTarget.dataset.doctorid
    if(app.globalData.is_register==1){
    wx.navigateTo({
      url: '/pages/doctorHome/doctorHome',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendData', doctorid)
      }
    })}
    else{
      wx.redirectTo({
        url: '/pages/register/register',
        success: function (res) {
        }
      })}
    
  },
  /**
     * 响应搜索词条响应事件
  */
  tapSearcherStorage:function(event){
    console.log(event.currentTarget.dataset.searchtext)
    var text = event.currentTarget.dataset.searchtext
    this.getDoctorByText(text)
    this.setData({
      searcherStorage:[]
    })
  },
   /**
     * 获取医生科室类别
     */
    getTypeArray(){
  var that=this
  //请求医生列表
  wx.request({
    url: 'https://yiwei.run/api/doctor/getDepartmentList',
    data: {
      department: type,
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
          typeArray: resp,
        }
      )
    }
  })
    }
})