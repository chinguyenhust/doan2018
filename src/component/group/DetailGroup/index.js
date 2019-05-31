import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconInfo from 'react-native-vector-icons/Ionicons';
import styles from "./DetailGroupStyle";
import Map from '../../home/Map';
import Event from '../Event';
import Chat from '../Chat';
import { Data } from "../../../api/Data";

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

  handlePrivateLocation = () => {
    const uid = this.props.navigation.state.params.uid;
    Data.ref("users").child(uid).update({
      privateLocation:true,
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
          style={{ height: 56, flexDirection: "row", paddingLeft: 20, alignSelf: "stretch", alignItems: "center", backgroundColor: "#006805" }}>
          <Icon name="ios-arrow-round-back"
            size={34}
            style={{ width: "10%", color: "#ffff" }}
            onPress={() => { this.props.navigation.goBack() }} />
          <Text style={{ fontSize: 20, width: "80%", fontWeight: "500", color: "#ffffff"}} numberOfLines={1}>{this.props.navigation.state.params.name}</Text>
{/* 
          <Icon name="ios-unlock" size={26}
            style={{ color: "#ffffff",  width: "10%" }}
            onPress={this.handlePrivateLocation}
          /> */}
          <IconInfo name="ios-information-circle-outline"
            size={26}
            style={{ width: "10%", color: "#ffffff" }}
            onPress={() => { navigate("InfoGroup", { groupId: groupId, uid: uid }) }} />
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
              uid={uid}
            />
          }
          {(this.state.isMap) &&
            <Map
              groupId={groupId}
              uid={uid}
            />
          }
          {(this.state.isEvent) &&
            <Event
              navigate={navigate}
              groupId={groupId}
              uid={uid}
              userName={name}
              nameGroup={this.props.navigation.state.params.name}
            />}
        </View>
      </View>
    );
  }
}


