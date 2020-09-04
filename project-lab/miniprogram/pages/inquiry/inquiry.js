const app=getApp()
Page({
  
  data:{
    male:true,
    female:false,
    newReply:'',
    picurlList:'',
    id_inquiry:1,

    id_doctor:1,
    id_patient:1,
    doctor_name:"",
    price:20,
    id_user:1,
    abstract:'',
    state:0,
    department:'',
    score:'',

    nameList: [],
    patientList:[],
    index:0,
    content:'',
    name:'请输入咨询人姓名或昵称',
    age:'请输入咨询人岁数',
    illness_history:'请输入咨询人病史',
    medicine_history:'请输入咨询人用药史',
    allergen:'请输入咨询人过敏药物',
    medHistory:true,
    medicine:true,
    allergy:true,
    images:[],
    currentName:'点击选取咨询人',

    patient_openid:'',
    doctor_openid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(){
    const eventChannel = this.getOpenerEventChannel()
    var that = this
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendData', data => {
      that.setData({
        id_doctor:data.id_doctor,
        id_patient:data.id_patient,
        id_user:app.globalData.id,
        doctor_name:data.doctor_name,
        price:data.price,
        department:data.department,
        score:data.score,
        doctor_openid:data.doctor_openid,
        doctor_avatar:data.avatar
      });
      this.getPatientByAuthor(app.globalData.id)
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 提交问诊
   */
  createInquiry: function () {
    var that = this;
    //请求医生信息
    wx.request({
      // url: 'http://119.45.143.38:80/api/inquiry/addInquiry',
      url: 'https://yiwei.run/api/inquiry/addInquiry',
      data: {
        id_inquiry:this.data.id_inquiry,
        id_doctor:this.data.id_doctor,
        id_patient:this.data.id_patient,
        doctor_name:this.data.doctor_name,
        price:this.data.price,
        id_user:this.data.id_user,
        abstract:this.data.newReply,
        state:0,
        department:this.data.department,
        score:this.data.score,
        doctor_avatar:this.data.doctor_avatar
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log("id_inquiry=")
        console.log(res.data.data)
        that.setData({
          id_inquiry:res.data.data
        })
        that.AddReply()
        that.addInquiryOrder()       
      }
    })
  },
  /**
   * 输入框获取就诊人姓名
   */
  getName: function (e) {
    //console.log(e.detail.value)
    this.data.name = e.detail.value
  },
  /**
  * 输入框获取就诊人年龄
  */
  getAge: function (e) {
    //console.log(e.detail.value)
    this.data.age = parseInt(e.detail.value)
  },
  /**
  * 输入框获取就诊人病史
  */
  getIllnessHistory: function (e) {
    //console.log(e.detail.value)
    this.data.illness_history = e.detail.value
  },
  /**
  * 输入框获取就诊人用药史
  */
  getMedicineHistory: function (e) {
    //console.log(e.detail.value)
    this.data.medicine_history = e.detail.value
  },
  /**
  * 输入框获取就诊人过敏药物
  */
  getAllergen: function (e) {
    //console.log(e.detail.value)
    this.data.allergen = e.detail.value
  },

  /**
  * 选择保存
  */
  onClickSave: function (e) {
    if (this.data.state == 0) {
      this.addPatient()
    }
    else if (this.data.state == 1) {
      this.editPatient()
    }

  },

  /**
  * 单选框radio
  */
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'r1') {
      this.setData({
        sex: 0
      })
    }
    else if (e.detail.value == 'r2') {
      this.setData({
        sex: 1
      })
    }
  },

  /**
   * 处理输入
   */
  handleInput: function (event) {
    this.setData({
    newReply:event.detail.value
    })
    //console.log(this.data.content)
  },

  medHistoryChange:function(){
    let temp = this.data.medHistory
    this.setData({medHistory:!temp})
  },
  medicineChange:function(){
    let temp = this.data.medicine
    this.setData({medicine:!temp})
  },
  allergyChange:function(){
    let temp = this.data.allergy
    this.setData({allergy:!temp})
  },
  /**
 * 获取病历
*/
  getPatientByAuthor: function (author) {
    var that = this;
    //请求病人信息
    wx.request({
      url: 'https://yiwei.run/api/patient/getPatientByAuthor',
      data: {
        author_id: author,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data)
        //todo:异常处理
        that.setData(
          {
            patientList: res.data.data
          }
        )
        let plist = that.data.patientList
        let list =[]
        for (var i=0;i<plist.length;i++)
        {
         list.push(plist[i].name)
        }
        that.setData(
          {
            nameList:list
          }
        )
        console.log(that.data.nameList)
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
        const tempFilePaths = res.tempFilePaths
        that.setData({
          images:that.data.images.concat(res.tempFilePaths)
        })
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
    //生成随机字符串
    var rString = this.randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    var that=this
    var pics=''
    for(var i=0;i<that.data.images.length;i++){
    let timestamp = (new Date()).valueOf();
    let path='inquiry/'+rString+'/'+timestamp + '.png'
    pics=pics+path+';'
   
    wx.cloud.uploadFile({
      cloudPath: path,
      // filePath: tempFilePaths[0],
      filePath: that.data.images[i],
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
      picurlList:pics
    })
  }
    },
    /**
    * 当前选择就诊人
   */
    bindPickerChange(event){
      
      console.log(this.data.patientList[1])
      console.log(event.detail.value)
      var index=parseInt(event.detail.value)
      console.log(index)
      this.setData({
        name:this.data.patientList[index].name,
        age:this.data.patientList[index].age,
        illness_history:this.data.patientList[index].illness_history,
        medicine_history:this.data.patientList[index].medicine_history,
        allergen:this.data.patientList[index].allergen,
        currentName:this.data.patientList[index].name,
        id_patient:this.data.patientList[index].id
      })
    },
  /**
  * 提交新回复
  */
 AddReply(){
  var that=this
  console.log(that.data.id_inquiry)
  //请求评论信息
  wx.request({
   url: 'https://yiwei.run/api/reply/addReply',
   data: {
     id_inquiry:that.data.id_inquiry,
     content:that.data.newReply,
     pic_url:that.data.picurlList,
     floor:1,
     id_patient:app.globalData.id,
     id_doctor:that.data.id_doctor,
     from_user:1//来自用户

   },
   header: {
     'content-type': 'application/json' // 默认值
   },
   method: 'POST',
   success(res) {
     console.log(res)
   }
 })
},
/**
  * 新增病历
 */
addPatient: function () {
  var that = this;
  //请求医生信息
  wx.request({
    url: 'https://yiwei.run/api/patient/addPatient',
    data: {
      name: this.data.name,
      author_id:this.data.id_user,
      age:this.data.age,
      sex:this.data.sex,
      illness_history:this.data.illness_history,
      medicine_history:this.data.medicine_history,
      allergen:this.data.allergen
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log(res.data.data)
      that.setData({
        id_patient:res.data.data
      })
      that.createInquiry()
    }
  })

},
    /**
     * 支付诊费，提交订单
     */
    payForInquiry: function (e) {
      this.uploadImagesToCloud()
      if(this.data.medicine==true){this.addPatient()}
      else{this.createInquiry()}
    },
   /**
   * 确认支付
   */
  addInquiryOrder: function(){
    var that=this
        console.log("pay...")
         //预支付
     wx.request({
      url: 'https://yiwei.run/api/inquiryorder/addInquiryOrder',
      data: {
       id_patient:app.globalData.id,
       id_doctor:this.data.id_doctor,
       patient_openid:app.globalData.openid,
       doctor_openid:this.data.doctor_openid,
       status:0,
       doctor_name:this.data.doctor_name,
       id_inquiry:this.data.id_inquiry,
       price:this.data.price
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log("response...")
 
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
            that.redirectToInquiryHistory()
           },
          'fail': function (res) {
            //支付取消或失败，更改订单状态
          that.cancelInquiryOrder(that.data.id_inquiry)
            console.log(res)
           }
        })
      },
      fail(res){
        console.log("response...")
        console.log(res.data)
        //支付取消或失败，更改订单状态
        that.cancelInquiryOrder(that.data.id_inquiry)
      },
    })
       },
  
       redirectToInquiryHistory(){
        wx.redirectTo({
          url: '/pages/inquiryHistory/inquiryHistory',
        })
       },
   //用于生成命名图片文件夹的随机字符串
       randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    /**更改订单状态：取消订单*/
  cancelInquiryOrder(id){
    console.log('cancel')
    wx.request({
       url: 'https://yiwei.run/api/inquiryorder/updateInquiryOrder',
      //url: 'http://localhost:8080/api/inquiryorder/updateInquiryOrder',
      data: {
       id_inquiry:id,
       status:3
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

  }
  
})