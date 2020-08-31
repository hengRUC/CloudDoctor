// pages/editPatient/editPatient.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    male:null,
    female:null,
    state:0,//0为新增，1为修改
    patient_id:0,
    name: "请输入姓名或昵称",
    author_id: 1,
    age: "请输入岁数",
    sex: 0,
    illness_history: "",
    medicine_history: "",
    allergen: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    var that = this
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendData', data => {
      that.setData({
        state: data.state,
        patient_id:data.patient_id
      });
      console.log(that.data.patient_id, ' from patientList');
      if(that.data.state==1)
      {
        this.getPatientById(that.data.patient_id)
      }
    })
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
   * 输入框获取就诊人姓名
   */
  getName:function(e) {
    //console.log(e.detail.value)
    this.data.name = e.detail.value
  },
  /**
  * 输入框获取就诊人年龄
  */
  getAge:function(e) {
    //console.log(e.detail.value)
    this.data.age = parseInt(e.detail.value)
  },
  /**
  * 输入框获取就诊人病史
  */
  getIllnessHistory:function(e) {
    //console.log(e.detail.value)
    this.data.illness_history = e.detail.value
  },
  /**
  * 输入框获取就诊人用药史
  */
  getMedicineHistory:function(e) {
    //console.log(e.detail.value)
    this.data.medicine_history = e.detail.value
  },
  /**
  * 输入框获取就诊人过敏药物
  */
  getAllergen:function(e) {
    //console.log(e.detail.value)
    this.data.allergen = e.detail.value
  },

  /**
  * 选择保存
  */
  onClickSave:function(e) {
    if(this.data.state==0)
    {
      this.addPatient()
    }
    else if (this.data.state == 1) {
      console.log("state==1")
      this.editPatient()
    }
    
  },

  /**
  * 单选框radio
  */
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if(e.detail.value=='r1')
    {
      this.setData({
        sex:0
      })
    }
    else if(e.detail.value=='r2')
    {
      this.setData({
        sex: 1
      })
    }
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
	      author_id:this.data.author_id,
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
      }
    })
    wx.redirectTo({
      url: '/pages/patientList/patientList',
    })
  },
  /**
   * 修改病历
  */
  editPatient: function () {
  var that = this
  var id_patient = this.data.patient_id
      //编辑病人信息
    wx.request({
      url: 'https://yiwei.run/api/patient/editPatient',
    data: {
      id: id_patient,
      name: this.data.name,
      author_id: this.data.author_id,
      age: this.data.age,
      sex: this.data.sex,
      illness_history: this.data.illness_history,
      medicine_history: this.data.medicine_history,
      allergen: this.data.allergen
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log(res.data.data)
    }
  })
  wx.redirectTo({
    url: '/pages/patientList/patientList',
  })
  },
  /**
   * 根据id获取病历
  */
  getPatientById:function(id)
  {
    var that = this
    var id_patient = id
    //获取病人信息
    wx.request({
      url: 'https://yiwei.run/api/patient/getPatientById',
      data: {
        id: id_patient,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data[0])
        let patient_data = res.data.data[0]
        if (that.data.sex == 0) {
          that.data.male = true
          that.data.female = false
        }
        if (that.data.sex == 1) {
          that.data.male = false
          that.data.female = true
        }
        console.log("male")
        console.log(that.data.male)
        console.log(that.data.female)
        that.setData(
          {
            name: patient_data.name,
            age: patient_data.age,
            sex: patient_data.sex,
            illness_history: patient_data.illness_history,
            medicine_history: patient_data.medicine_history,
            allergen: patient_data.allergen
          }
        )
        
      }
    })
  }

})