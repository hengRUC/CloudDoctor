const app=getApp()
Page({
  
  data:{
    male:true,
    female:false,
    age:'',
    main_problem:'',
    illness_history:'',
    medicine_history:'',
    allergen:'',
    images:[],

    groupId:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    const eventChannel = this.getOpenerEventChannel()
    var that = this
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendData', data => {
      that.setData({
        groupId: data
      });
      console.log(that.data.groupId)
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 处理输入
   */
  handleInput: function (event) {
    //console.log(this.data.content)
    this.setData({
      main_problem: event.detail.value
    })
  },
  /**
  * 输入框获取就诊人年龄
  */
  getAge: function (e) {
    //console.log(e.detail.value)
    this.setData({
      age: e.detail.value
    })
  },
  /**
  * 输入框获取就诊人病史
  */
  getIllnessHistory: function (e) {
    // console.log(e.detail.value)
    this.setData({
      illness_history: e.detail.value
    })
  },
  /**
  * 输入框获取就诊人用药史
  */
  getMedicineHistory: function (e) {
    //console.log(e.detail.value)
    this.setData({
      medicine_history: e.detail.value
    })
  },
  /**
  * 输入框获取就诊人过敏药物
  */
  getAllergen: function (e) {
    //console.log(e.detail.value)
    this.setData({
      allergen: e.detail.value
    })
  },
  /**
  * 单选框radio
  */
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'r1') {
      this.setData({
        male: true,
        female: false,
      })
    }
    else if (e.detail.value == 'r2') {
      this.setData({
        male: false,
        female: true,
      })
    }
  },

  /**
  * 上传文本到云端
  */
  uploadTextToCloud(){
    var messages = []
    if (this.data.male) {
      messages.push("性别：男，年龄：" + this.data.age)
    }
    else {
      messages.push("性别：女，年龄：" + this.data.age)
    }
    messages.push("主要症状：" + this.data.main_problem)
    messages.push("病史：" + this.data.illness_history)
    messages.push("用药史：" + this.data.medicine_history)
    messages.push("过敏药物：" + this.data.allergen)

    var that = this
    for (var i = 0; i < messages.length; i++) {
      console.log(messages[i]);
      var user_avatar = "../../src/icon/default.png"
      if (app.globalData.is_doctor == 1)//如果是医生
      {
        user_avatar = app.globalData.avatar_url
      }
      wx.cloud.callFunction({
        name: "uploadInquiry",
        data: {
          groupId: that.data.groupId,
          avatar: user_avatar,
          msgType: 'text',
          nickName: app.globalData.name,
          content: messages[i]
        },
        success(res) {
          console.log(res)
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },

  /**
  * 上传图片
  */
  uploadPic: function () {
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
  deleteImage: function(event){
    var index = event.currentTarget.dataset.idx
    let that = this
    that.data.images.splice(index, 1)
    that.setData({
      images: that.data.images
    })
  },
  //上传图片到云端
  uploadImagesToCloud(){ 
    // 云函数上传
    // 生成随机字符串
    var that=this
    var user_avatar = "../../src/icon/default.png"
    if (app.globalData.is_doctor == 1)//如果是医生
    {
      user_avatar = app.globalData.avatar_url
    }
    for(var i=0;i<that.data.images.length;i++){
      let path = `${that.data.groupId}/${Math.random()}_${Date.now()}.${that.data.images[i].match(/\.(\w+)$/)[1]}`

      wx.cloud.uploadFile({
        cloudPath: path,
        // filePath: tempFilePaths[0],
        filePath: that.data.images[i],
        success: async (res) => {
          console.log("send img success")
          console.log(res.fileID)
          await wx.cloud.callFunction({
            name: "uploadInquiry",
            data: {
              groupId: that.data.groupId,
              avatar: user_avatar,
              msgType: 'image',
              nickName: app.globalData.name,
              imgFileID: res.fileID
            },
            success(res) {
              console.log(res)
            },
            fail(res) {
              console.log(res)
            }
          })
        },
        fail: e => {
          console.error('[上传图片] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '图片上传失败',
          })
        }
      })
    }
  },


  goChat: function (e) {
    // 在这里上传所有信息，并导航向聊天室    
    this.uploadTextToCloud()
    this.uploadImagesToCloud()

    var that = this

    wx.cloud.callFunction({
      name: "caseConsultation",
      data: {
        optype: 'query',
        id: '',
        groupId: that.data.groupId,
        haveCase: false
      },
      success: async (res) => {
        if (res.result.length == 0) {
          console.log("按道理不可能，addChatOrder已经创建完了")
        }
        else {
          if (res.result[0].haveCase) {
            console.log("按道理不可能，addChatOrder已经修改过了")
          }
          else {
            await wx.cloud.callFunction({
              name: "caseConsultation",
              data: {
                optype: 'update',
                id: res.result[0]._id,
                groupId: that.data.groupId,
                haveCase: true
              },
              success(res1) {
                console.log(res1)
              },
              fail(res1) {
                console.log(res1)
              }
            })
          }
        }
      },
      fail(res) {
        console.log(res)
      }
    })

    this.redirectToChat()
  },
  
  redirectToChat() {
    wx.redirectTo({
      url: '/pages/chat/chat',
    })
  },
})