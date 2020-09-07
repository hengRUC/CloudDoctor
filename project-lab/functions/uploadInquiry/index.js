// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext();

    if (event.msgType == 'text'){
      const result = await db.collection('chatroom').add({
        data: {
          _id: `${Math.random()}_${Date.now()}`,
          _openid: OPENID,
          groupId: event.groupId,
          avatar: event.avatar,
          nickName: event.nickName,
          msgType: event.msgType,
          textContent: event.content,
          sendTime: new Date(),
          sendTimeTS: Date.now()
        },
      });
      return result
    }
    else if (event.msgType == 'image'){
      const result = await db.collection('chatroom').add({
        data: {
          _id: `${Math.random()}_${Date.now()}`,
          _openid: OPENID,
          groupId: event.groupId,
          avatar: event.avatar,
          nickName: event.nickName,
          msgType: event.msgType,
          imgFileID: event.imgFileID,
          sendTime: new Date(),
          sendTimeTS: Date.now()
        },
      });
      return result
    }
    else{
      console.log('error msgType');
    }

    
  } catch (err) {
    console.log(err);
    return err;
  }
}