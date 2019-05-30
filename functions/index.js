const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


/**
 * Triggers when new subject added in the list and sends a notification.
 */
exports.addEvent = functions.database.ref('/events/{id}').onCreate((change, context) => {

  const subject = change.val();

  // Notification details.
  const payload = {
    notification: {
      title: 'Kế hoạch mới',
      body: `${subject.userNameCreated} vừa tạo kế hoạch ${subject.name} trong nhóm ${subject.groupName}`,
      sound: 'default',
      //   clickAction: 'fcm.ACTION.HELLO',
      // badge: '1'
    },
  };

  // Set the message as high priority and have it expire after 24 hours.
  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  // Send a message to devices subscribed to the provided topic.
  const topic = '/topics/' + subject.groupId;
  return admin.messaging().sendToTopic(topic, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return null;
    });
});

exports.addSurvey = functions.database.ref('/surveys/{id}').onCreate((change, context) => {

  const subject = change.val();

  const payload = {
    notification: {
      title: 'Khảo sát mới',
      body: `${subject.userNameCreated} vừa tạo một cuộc thăm dò ý kiến ${subject.question} trong nhóm ${subject.groupName}`,
      sound: 'default',
      badge: '1'
    },
  };

  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  const topic = '/topics/' + subject.groupId;
  return admin.messaging().sendToTopic(topic, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return null;
    });
});

exports.addMessage = functions.database.ref('/messages/{id}').onCreate((change, context) => {

  const subject = change.val();

  const payload = {
    notification: {
      title: 'Tin nhắn mới',
      body: `${subject.user.name} vừa gửi 1 tin nhắn trong nhóm.`,
      sound: 'default',
      badge: '1'
    },
  };

  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  const topic = '/topics/' + subject.groupId;
  return admin.messaging().sendToTopic(topic, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return null;
    });
});


exports.addMember = functions.database.ref('/group_users/{id}').onCreate((change, context) => {

  const subject = change.val();

  const payload = {
    notification: {
      title: 'Doan2018',
      body: ` Bạn vừa được thêm vào nhóm mới.`,
      sound: 'default',
      badge: '1'
    },
  };

  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  return admin.database().ref('tokenFCM').child(subject.user_id)
    .once('value', (snapshot1) => {
      token = snapshot1.val().token
      return admin.messaging().sendToDevice(token, payload, options);
    })

});

exports.updateEvent = functions.database.ref('/events/{id}').onUpdate((change, context) => {

  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };
  const topic = '/topics/' + change.after.val().groupId;

  if (change.after.val().name !== change.before.val().name){
    const payload = {
      notification: {
        title: 'Doan2018',
        body: ` ${change.before.val().name} đã đổi tên là ${change.after.val().name}.`,
        sound: 'default',
        badge: '1'
      },
    };
    
    return admin.messaging().sendToTopic(topic, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      });
  } else if(change.after.val().time !== change.before.val().time){
    const payload = {
      notification: {
        title: 'Doan2018',
        body: ` ${change.after.val().name} đã đổi thời gian kế hoạch sang ${change.after.val().time}.`,
        sound: 'default',
        badge: '1'
      },
    };
    
    return admin.messaging().sendToTopic(topic, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      });
  }else if(change.after.val().address !== change.before.val().address){
    const payload = {
      notification: {
        title: 'Doan2018',
        body: ` ${change.after.val().name} đã đổi địa chỉ kế hoạch sang ${change.after.val().address}.`,
        sound: 'default',
        badge: '1'
      },
    };
    
    return admin.messaging().sendToTopic(topic, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      });
  }else if(change.after.val().description !== change.before.val().description){
    const payload = {
      notification: {
        title: 'Doan2018',
        body: ` ${change.after.val().name} đã đổi mô tả kế hoạch là ${change.after.val().description}.`,
        sound: 'default',
        badge: '1'
      },
    };
    
    return admin.messaging().sendToTopic(topic, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      });
  }
});

exports.updateGroup = functions.database.ref('/groups/{id}').onUpdate((change, context) => {

  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  const topic = '/topics/' + context.params.id;
  if (change.after.val().isOnMap !== change.before.val().isOnMap) {
    if (change.after.val().isOnMap === true) {
      const payload = {
        notification: {
          title: `Doan 2018`,
          body: ` ${change.after.val().name} đã được bật định vị nhóm`,
          sound: 'default',
          badge: '1'
        },
      };

      return admin.messaging().sendToTopic(topic, payload, options)
        .then((response) => {
          console.log('Successfully sent message:', response);
          return null;
        });

    } else {
      const payload = {
        notification: {
          title: `Doan 2018`,
          body: ` ${change.after.val().name} đã tắt bật định vị nhóm`,
          sound: 'default',
          badge: '1'
        },
      };

      return admin.messaging().sendToTopic(topic, payload, options)
        .then((response) => {
          console.log('Successfully sent message:', response);
          return null;
        });
    }
  } else if (change.after.val().name !== change.before.val().name) {
    const payload = {
      notification: {
        title: `Doan 2018`,
        body: ` ${change.before.val().name} đã thay đổi tên nhóm thành ${change.after.val().name}`,
        sound: 'default',
        badge: '1'
      },
    };

    return admin.messaging().sendToTopic(topic, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      });
  }else if (change.after.val().schedule !== change.before.val().schedule) {
    const payload = {
      notification: {
        title: `Doan 2018`,
        body: ` ${change.after.val().name} đã thay đổi lịch trình nhóm`,
        sound: 'default',
        badge: '1'
      },
    };

    return admin.messaging().sendToTopic(topic, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      });
  }

});

exports.addSurvey = functions.database.ref('/surveys/{id}').o((change, context) => {

  const subject = change.val();

  const payload = {
    notification: {
      title: 'Khảo sát mới',
      body: `${subject.userNameCreated} vừa tạo một cuộc thăm dò ý kiến ${subject.question} trong nhóm ${subject.groupName}`,
      sound: 'default',
      badge: '1'
    },
  };

  const options = {
    collapseKey: 'demo',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  const topic = '/topics/' + subject.groupId;
  return admin.messaging().sendToTopic(topic, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return null;
    });
});

