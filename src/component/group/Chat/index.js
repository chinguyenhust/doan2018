import React from 'react';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'; // 0.3.0
import { View } from 'react-native'
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
    }
    this.observeAuth();
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  // get uid() {
  //   return (firebase.auth().currentUser || {}).uid;
  // }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user, groupId } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
      groupId
    };
    return message;
  };

  on = (callback) =>
    this.ref
      .orderByChild("groupId")
      .equalTo(this.props.groupId)
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const groupId = this.props.groupId;
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        groupId,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = (message) => {
    this.ref.push(message)
  };

  // close the connection to the Backend
  off() {
    this.ref.off();
  }

  get user() {
    return ({
      name: this.props.name,
      _id: this.props.uid,
      avatar: null,
    });
  }

  renderSend(props) {
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 15, alignItems: "center", marginBottom: 8 }}>
          <Icon name="ios-send" style={{ color: "#008605" }} size={30} />
        </View>
      </Send>
    );
  }

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#008605"
          }
        }}
      />
    )
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
        alwaysShowSend
        renderUsernameOnMessage
        renderSend={this.renderSend}
        renderBubble={this.renderBubble}
        placeholder="Nhập tin nhắn"
      />
    );
  }

  componentDidMount() {
    this.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  // componentWillReceiveProps(){
  //   this.on(message =>
  //     this.setState(previousState => ({
  //       messages: GiftedChat.append(previousState.messages, message),
  //     }))
  //   );
  // }
  componentWillUnmount() {
    this.off();
  }
}

export default Chat;
