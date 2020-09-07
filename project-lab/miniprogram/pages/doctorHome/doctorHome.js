const app = getApp()
const cloudPath="cloud://airobot-z9ted.6169-airobot-z9ted-1302168733/"
const TmplId = '4SnZohkpw5KAM4rxZYUrUl1TDncs9-RexIfgsNoFIwo';
var utils=require('../../utils/util.js')

// pages/doctorHome/doctorHome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,
    modalContent: '',
    //会员剩余次数
    general_remain:0,
    special_remain:0,
    doctor_type:1,
    starArray:[],
    unstarArray:[],
    department:'',
    chat_price:50,
    inquiry_price:10,
    doctor_openid:"",
    patientid:1,
    doctorid:1,
    doctorName:'钟医生',
    title:'主任医师',
    score:4.9,
    reviews:999,
    expert:'儿科',
    patientNum:1240,
    quiryNum:1024,
    rate:99,
    introduction:"我知道这里是一段介绍",
    address:'地址',
    contactNumber:'暂无',
    modalBodyBottom:0,
    hideModal:true,
    list:[
      {title:'简介'},
      {title:'评论'}
    ],
    currentItem:0,
    map:{
      latitude:31.319067,
      longitude:121.529228,
      scale:14,
      markers:[{
        id:0,
        // latitude:31.306067,
        latitude:31.306067,
        longitude:121.529228,
        width:50,
        heigt:50
      }]
    },
    classroomList:[
      {imgurl:'../../src/icon/throat.png',
      name:'上海市第十人民医院 心内科'},
      {imgurl:'../../src/icon/throat.png',
      name:'同济大学附属同济医院 心内科'}
    ],
    experienceList:[
      {
        title:'长年承担同济大学本科教学工作',
        content:''
      }
    
    ],
    educationList:[
      {
        school:'医学院',
        imgUrl:'../../src/icon/PekingUniversity.png',
        college:'Peking University School of Medicine',
        date:'1985'
      },
      // {
      //   school:'医学院',
      //   imgUrl:'../../src/icon/PekingUniversity.png',
      //   college:'Peking University School of Medicine',
      //   date:'1985'
      // },
      // {
      //   school:'医学院',
      //   imgUrl:'../../src/icon/PekingUniversity.png',
      //   college:'Peking University School of Medicine',
      //   date:'1985'
      // },
    ],
    commentList:[],
    isCollect:0,
    item: {
      "thing1": {
        "value": "X医生的咨询"
      },
      "thing3": {
        "value": "请在X个工作日以内进入聊天室咨询"
      },//推送文案： 预约时间：this.data.startTime - this.data.endTime
      "character_string5": {
        "value": "a3510731313"
      }
    },
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
        doctorid: data   
      });
      console.log(that.data.doctorid, ' from doctorList');
      this.getDoctorDetailById(that.data.doctorid)
      this.getCommentByDoctorId(that.data.doctorid)
      this.checkLike()
    })

    
    this.data.patientid=app.globalData.id
    // var query = wx.createSelectorQuery();
    // query.select('#modalBody').boundingClientRect(function (rect) {
    //   let ratio = 750 / rect.width;
    //   that.setData({
    //    modalBodyBottom:-(rect.height*ratio-30)+'rpx',
    //   })
    // }).exec();
  
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
   * tabbar点击事件
   */
  tabBarSelected:function(e){
    let index=e.currentTarget.dataset.key;
    console.log(index)
    this.setData({
      currentItem:index
    })
  },
  
  /*
  *显示预约Modal
  */
 showAndHideModal:function(){
   var height=wx.getSystemInfoSync().windowHeight
   var that=this;
  if(that.data.hideModal==true){
    that.setData({hideModal:false})
    that.animate('#modalBody',[
      {bottom:-(height*0.93),ease: 'ease'},
      {bottom:0,ease: 'ease'}
    ],2500)
  }else{
    that.setData({hideModal:true})
    that.animate('#modalBody',[
      {bottom:0,ease: 'ease'},
      {bottom:-(height*0.93),ease: 'ease'}
    ],2500)
  } 
 },
 /**
   * 响应会员信息按钮点击事件
  */
onClickVip()
{
if(app.globalData.is_doctor==1)
{
  wx.showToast({
    icon: 'none',
    title: '您现在为专家登录，无法查看会员信息',
    duration: 2000
  })
}
else
{
  this.redirectToVip()
}
},
redirectToVip()
{
  wx.redirectTo({
    url: '/pages/vipInfo/vipInfo',
  })
},
redirectToBuyVip()
{
  wx.redirectTo({
    url: '/pages/buyvip/buyvip',
  })
},
  /**
   * 响应图文问诊按钮点击事件
  */
  onClickInquiry: function (event) {
   var inquiry_info={
     id_doctor:this.data.doctorid,
     id_patient:this.data.patientid,
     doctor_name:this.data.doctorName,
     price:this.data.inquiry_order_price,
     department:this.data.department,
     score:this.data.score,
     doctor_openid:this.doctor_openid,
     avatar:this.data.avatar
   }
    wx.navigateTo({
      url: '/pages/inquiry/inquiry',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendData', inquiry_info)
      }
    })
  },

 /**
  *通过id获取医生详细信息
  */
  getDoctorDetailById: function (doctorid) {
    var that = this;
    //请求医生信息
    wx.request({
      url: 'https://yiwei.run/api/doctor/getDoctorByID',
      // url: 'http://localhost:8080/api/doctor/getDoctorByID',
      data: {
        id: doctorid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data[0])
        let resp = res.data.data[0]
          //获取头像图片
          var picString = cloudPath+resp.avatar         
          resp.avatar=picString
          if(resp.contact_number=='')
          {
            resp.contact_number='暂无'
          }

        //todo:异常处理
        that.setData(
          {
            doctor_type:resp.doctor_type,
            doctorName: resp.doctor_name,
            title: resp.title,
            score: resp.score,
            reviews: resp.reviews,
            expert: resp.expert,
            patientNum: resp.patient_num,
            quiryNum: resp.quiry_num,
            rate: resp.rate,
            introduction: resp.introduction,
            address: resp.address,
            contactNumber: resp.contact_number,
            department:resp.department,
            doctor_openid:resp.openid,
            avatar: resp.avatar
          }
        )
      }
    })
  },
  /**
 *通过id获取医生评论
 */
  getCommentByDoctorId: function (doctorid) {
    var that = this;
    //请求医生信息
    wx.request({
      url: 'https://yiwei.run/api/comment/getCommentByDoctorId',
      data: {
        id_doctor: doctorid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        let resp = res.data.data
        //todo:异常处理
        that.setData(
          {
            commentList:resp
          }
        )
      }
    })
  },
  /**
  *响应在线咨询按钮点击事件
 */
  redirectToChatRooms: function (event) {
    if(app.globalData.is_doctor==0){
    var that = this;
    //请求医生信息
    wx.request({
      //url: 'http://localhost:8000/api/vip/getVipByUid',
      url: 'https://yiwei.run/api/vip/getVipByUid',
      data: {
        id_user:app.globalData.id
        },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data[0])
        console.log(res.data)
        var data=res.data.data[0]
        that.setData({

        general_remain:data.general_total-data.general_used,
        special_remain:data.special_total-data.special_used,

      })
      that.checkChatOrder()//检查订单状态，已有订单则跳转
    
      }
    })}
    else{
      wx.showToast({
        icon: 'none',
        title: '您现在为专家登录，无法向其他专家咨询',
        duration:2000
      })
    }
  },
  /**
  *响应预约挂号按钮点击事件
 */
  redirectToSchedule: function (event) {
    if(app.globalData.is_doctor==0){
    var chat_info={
      id_patient:this.data.patientid,
      id_doctor:this.data.doctorid,
      patient_openid:app.globalData.openid,
      doctor_openid:this.data.doctor_openid,
      price:this.data.chat_order_price,
      // price:20,
      doctor_name:this.data.doctorName,
      doctor_avatar:this.data.avatar
    }
    console.log("doctor_home")
    console.log(this.data.doctor_openid)
    wx.showToast({
      icon: 'none',
      title: '当前无需预约，请直接发起咨询',
      duration:2000
    })
    // wx.navigateTo({
    //   url: '/pages/schedule/schedule',
    //   success: function (res) {
    //     // 通过eventChannel向被打开页面传送数据
    //     res.eventChannel.emit('sendData', chat_info)
    //   }
    // })
  }
  else{
    wx.showToast({
      icon: 'none',
      title: '您现在为专家登录，无法向其他专家咨询',
      duration:2000
    })
  }
  },
  /**
  *响应问诊价格按钮点击事件
 */
  showPrice(){
    wx.showToast({
      icon: 'none',
      title: '图文咨询上限50次；在线咨询24小时内',
    })
  },
  /**
  *收藏医生
 */
 onClickLike(){
   if(app.globalData.is_doctor==0)
   {
  wx.showToast({
    icon: 'none',
    title: '收藏成功',
  })
  this.setData({
    isCollect:1
  })
      //收藏
      wx.request({
        url: 'https://yiwei.run/api/collect/addCollect',
        // url: 'http://localhost:8080/api/collect/addCollect',
        data: {
          // uid:app.globalData.id,
          uid:1,
          doctor_id:this.data.doctorid,
          doctor_name:this.data.doctorName,
          department:this.data.department,
          doctor_avatar:this.data.avatar,
          score:this.data.score
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success(res) {
          console.log(res.data)
        }
      })
    }
    else{
      wx.showToast({
        icon: 'none',
        title: '您现在为专家登录，无法收藏',
        duration:2000
      })
    }
},
/**
  *取消收藏医生
 */
 onClickDislike(){
   if(app.globalData.is_doctor==0)
   {
  wx.showToast({
    icon: 'none',
    title: '取消收藏成功',
  })
  this.setData({
    isCollect:0
  })
   //取消收藏
   wx.request({
    url: 'https://yiwei.run/api/collect/deleteCollect',
    data: {
      uid:app.globalData.id,
      doctor_id:this.data.doctorid,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log(res.data)
    }
  })
}
else{
  wx.showToast({
    icon: 'none',
    title: '您现在为专家登录，无法收藏',
    duration:2000
  })
}
},
/**
  *是否收藏
 */
checkLike(){
  if(app.globalData.is_doctor==0){
  //查询收藏
  var that=this
  wx.request({
    url: 'https://yiwei.run/api/collect/getCollectByUid',
    data: {
      // uid:app.globalData.id,
      uid:1,
      doctor_id:this.data.doctorid,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log(res.data.data)
      if(res.data.data.length!=0){
        that.setData({
          isCollect:1
        })
      }
    }
  })
}
},


//确认咨询
confirmChat(){
this.modalHide()
if(this.data.doctor_type==0)
{
  this.minusVipInfo(1,0)
}
else if(this.data.doctor_type==1)
{
  this.minusVipInfo(0,1)
}
this.addChatOrder()
},
minusVipInfo(gen_num,spe_num){
    var that = this
    wx.request({
      url: 'https://yiwei.run/api/vip/minusVipInfo',
      // url: 'http://localhost:8080/api/vip/minusVipInfo',
      data: {
       id_user:app.globalData.id,
       general_total:gen_num, //为了方便借用general_total字段
       special_total:spe_num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        // that.redirectToVipInfo()
      }
    })
},
modalHide: function (e) {
  this.setData({
    modalHidden: true
  })
},
addChatOrder: function(){
  var that=this
 wx.request({
  url: 'https://yiwei.run/api/chatorder/addChatOrder',
  // url: 'http://localhost:8080/api/chatorder/addChatOrder',
  data: {
   id_patient:app.globalData.id,
   id_doctor:that.data.doctorid,
   patient_openid:app.globalData.openid,
   doctor_openid:that.data.doctor_openid,
   status:0,
   doctor_name:that.data.doctorName,
   patient_name:app.globalData.name,
  //  start_time:that.data.startTime,
  //  end_time:endTime,
  //  price:that.data.price,
   doctor_avatar:that.data.avatar,
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  method: 'POST',
  success(res) {
    console.log("response...")
    console.log(res)
    //设置推送消息
    var groupid=res.data.groupId
    var orderid=res.data.orderId
    var value1="item.thing1.value"
    var value2="item.thing3.value"
    var value3="item.character_string5.value"
    that.setData({
      // group_id:"聊天室id",
      [value1]:"发起了咨询",
      [value2]: "刚刚",
      // [value3]:"订单id"
    })
    utils.Subscrib(that.data.item,that.data.doctor_openid,TmplId)
    //====

    wx.cloud.callFunction({
      name: "caseConsultation",
      data: {
        optype: 'query',
        id: '',
        groupId: groupid,
        haveCase: false
      },
      success: async (res) => {
        if (res.result.length == 0) {
          // 本次咨询没有病例就创建状态
          await wx.cloud.callFunction({
            name: "caseConsultation",
            data: {
              optype: 'add',
              id: '',
              groupId: groupid,
              haveCase: false
            },
            success(res1) {
              that.redirectToInquiry(groupid)
            },
            fail(res1) {
              console.log(res1)
            }
          })
        }
        else {
          // 本次咨询有以往病例就修改状态
          await wx.cloud.callFunction({
            name: "caseConsultation",
            data: {
              optype: 'update',
              id: res.result[0]._id,
              groupId: groupid,
              haveCase: false
            },
            success(res1) {
              that.redirectToInquiry(groupid)
            },
            fail(res1) {
              console.log(res1)
            }
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
 
})
   },

   redirectToChat(){
    wx.redirectTo({
      url: '/pages/chat/chat',
    })
   },

  redirectToInquiry(groupid) {
    wx.navigateTo({
      url: '/pages/inquiry/inquiry',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendData', groupid)
      }
    })
  },
   /*
   检查是否已经存在进行中订单
   */
 checkChatOrder: function () {
   console.log("function checkChatOrder")
  var that = this;
  //请求医生信息
  wx.request({
    url: 'https://yiwei.run/api/chatorder/getChatOrderStatus',
    // url: 'http://localhost:8080/api/chatorder/getChatOrderStatus',
    data: {
      id_patient:app.globalData.id,
      id_doctor:this.data.doctorid
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log("checkChatOrder")
      console.log(res.data.data)
      var data=res.data.data
        if(data.length!=0&&data[0].status==0)
        {
          wx.cloud.callFunction({
            name: "caseConsultation",
            data: {
              optype: 'query',
              id: '',
              groupId: data[0].group_id,
              haveCase: false
            },
            success(res) {
              if (res.result.length == 0){
                console.log("按道理不可能，addChatOrder已经创建完了")
              }
              else{
                if (res.result[0].haveCase){
                  that.redirectToChat()
                }
                else{
                  that.redirectToInquiry(data[0].group_id)
                }
              }
            },
            fail(res) {
              console.log(res)
            }
          })
        }
        else{
          if(that.data.doctor_type==0&&that.data.general_remain>0) //普通专家
          {
            that.setData({
              modalContent:'本次咨询将扣除1次普通专家咨询次数，是否发起咨询？',
              modalHidden: false
            });
          } 
          else if(that.data.doctor_type==1&&that.data.special_remain>0) //特殊专家
          {
            that.setData({
              modalContent:'本次咨询将扣除1次特殊专家咨询次数，是否发起咨询？',
              modalHidden: false
            });
          }
          //次数不足，跳转
          else{
            console.log(that.data.doctor_type)
            console.log(that.data.general_remain)
            that.redirectToBuyVip()
          }
        }

     
    }
  })
},

})
