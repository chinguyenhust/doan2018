const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


/**
 * Triggers when new subject added in the list and sends a notification.
 */
exports.sendNotification = functions.database.ref('/events/{id}').onCreate((change, context) => {

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

  const topic = '/topics/' + subject.group_id;
  return admin.messaging().sendToTopic(topic, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return null;
    });
});

exports.updateGroup = functions.database.ref('/groups/{id}').onUpdate((change, context) => {

  const subject = change.val();

  const payload = {
    notification: {
      title: `${subject.name}`,
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

  const topic = '/topics/' + subject.group_id;
  return admin.messaging().sendToTopic(topic, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return null;
    });
});