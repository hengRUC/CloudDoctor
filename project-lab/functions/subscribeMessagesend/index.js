// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext();
    // console.log(OPENID)
    // 从云开数据库中查询等待发送的消息列表
    const messages = await db
      .collection('SubscribeMessage')
      .where({
        touser: OPENID,
        done: false,
      })
      .get();
    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser[0],
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser[1],
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('SubscribeMessage')
          .doc(message._id)
          .update({
            data: {
              done: true,
            },
          });
      } catch (e) {
        console.log("what happen")
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};
