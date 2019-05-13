import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconInfo from 'react-native-vector-icons/Ionicons';
import styles from "./DetailGroupStyle";
import Map from '../../home/Map';
import Event from '../Event';
import Chat from '../Chat';

export default class DetailGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChat: true,
      isMap: false,
      isEvent: false,
      name: ""
    }
  }

  handleClickMap = () => {
    this.setState({
      isMap: true,
      isChat: false,
      isEvent: false
    })
  }
  handleClickChat = () => {
    this.setState({
      isMap: false,
      isChat: true,
      isEvent: false
    })
  }
  handleClickEvent = () => {
    this.setState({
      isMap: false,
      isChat: false,
      isEvent: true
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    const name = this.props.navigation.state.params.userName;
    const groupId = this.props.navigation.state.params.groupId;
    const uid = this.props.navigation.state.params.uid;

    return (
      <View style={styles.container}>

        <View
          style={{ height: 56, flexDirection: "row", paddingLeft: 20, alignSelf: "stretch", justifyContent: "center", alignItems: "center",backgroundColor: "#006805" }}>
          <Icon name="ios-arrow-round-back"
            size={34}
            style={{ width: "15%", color:"#ffff" }}
            onPress={() => { this.props.navigation.goBack() }} />
          <Text style={{ fontSize: 20, width: "70%", fontWeight: "600", color: "#ffffff" }}>{this.props.navigation.state.params.name}</Text>
          <IconInfo name="ios-information-circle-outline"
            size={30}
            style={{ width: "10%", color:"#ffffff"}}
            onPress={() => { navigate("InfoGroup", { groupId: groupId, uid: uid}) }} />
        </View>


        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tapbarItem} onPress={this.handleClickChat}>
            <Text style={(this.state.isChat) ? styles.lableAfter : styles.lableBefore}>Chat nhóm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tapbarItem} onPress={this.handleClickMap}>
            <Text style={(this.state.isMap) ? styles.lableAfter : styles.lableBefore}>Bản đồ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tapbarItem} onPress={this.handleClickEvent}>
            <Text style={(this.state.isEvent) ? styles.lableAfter : styles.lableBefore}>Sự kiện</Text>
          </TouchableOpacity>

        </View>

        <View style={{ flex: 15 }}>
          {(this.state.isChat) &&
            <Chat
              name={name}
              groupId={groupId}
            />
          }
          {(this.state.isMap) &&
            <Map
              groupId={groupId}
            />
          }
          {(this.state.isEvent) &&
            <Event
              navigate={navigate}
              groupId={groupId}
              uid={uid}
              nameGroup={this.props.navigation.state.params.name}
            />}
        </View>
      </View>
    );
  }
}


