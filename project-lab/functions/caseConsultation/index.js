// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext();

    if (event.optype == 'query'){
      const messages = await db
        .collection('caseConsultation')
        .where({
          groupId: event.groupId,
        })
        .get();
      return messages.data
    }
    else if (event.optype == 'add') {
      const result = await db.collection('caseConsultation').add({
        data: {
          groupId: event.groupId,
          haveCase: false
        },
      });
      return result
    }
    else if (event.optype == 'update') {
      const result = await db.collection('caseConsultation')
        .doc(event.id)
        .update({
          data: {
            groupId: event.groupId,
            haveCase: event.haveCase
          },
        });
      return result
    }
    else {
      console.log("Wrong operation")
    }

    
  } catch (err) {
    console.log(err);
    return err;
  }
}