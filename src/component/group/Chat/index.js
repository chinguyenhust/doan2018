// @flow
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import{View} from 'react-native'
import Fire from '../../../api/Fire';


class Chat extends React.Component{

  state = {
    messages: [],
  };

  get user() {
    return ({
      name:this.props.name,
      _id: Fire.shared.uid,
      avatar: ""
      
    });
  }

  render() {
      console.log(this.user)
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    Fire.shared.off();
  }
}

export default Chat;
