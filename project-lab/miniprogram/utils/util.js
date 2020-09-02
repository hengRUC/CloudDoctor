const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
   * 发送订阅消息
   **/
  //实现在满足条件的时候给用户发送模板消息
  //像二手物品交易中，将用户的物品信息存储起来，等到其他人购买，提醒用户发货
  //就可以在别人下单的函数中，给卖家发送模板消息。
  function send(){
    wx.cloud.callFunction({
      name: 'subscribeMessagesend',
      success(res) {
        console.log('订阅消息发送成功');
        console.log(res);
      },
      fail(re) {
        console.log(re);
      }
    })

}

 /**
   * 订阅消息
   **/

 function Subscrib(subscribe_data,doctor_openid,TmplId){
    const self = this
    wx.requestSubscribeMessage({
      tmplIds: [TmplId],
      success(res) {
        //开发文档文档详细对的说明，接口调用返回的结果是什么
    //https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          wx.cloud
            .callFunction({
              //通过调用云函数，实现用户点击允许我们发送订阅消息，
              //将该数据订阅保存到数据库，以便在满足条件的时候发送给用户
              name: 'subscribeMessage',
              data: {
                data: subscribe_data,
                doctor_id: doctor_openid,
                templateId: TmplId,
                //这个是给用户发送订阅消息后，用户点击订阅消息进入小程序的相关页面，一定要是在线的才可以
                page: '/pages/chat/chat',
              },
            })
            .then(() => {
              send();
              console.log('订阅成功，写入数据库');
            })
            .catch((err) => {
              console.log('订阅失败');
              console.log(err)
            });
        }
      },
      fail(re) {
        console.log(re);
      },
    })
  }


module.exports = {
  formatTime: formatTime,
  Subscrib: Subscrib
}
