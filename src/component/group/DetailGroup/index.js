import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconInfo from 'react-native-vector-icons/Ionicons';
import styles from "./DetailGroupStyle";
import Map from '../../home/Map';
import Event from '../Event';
import Chat from '../Chat';
import Data from '../../../api/Data';
import firebase from 'firebase'; // 4.8.1

export default class DetailGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChat: true,
      isMap: false,
      isEvent: false,

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

  componentDidMount(){
    const groupId = this.props.navigation.state.params.id;
  }

  render() {
    const { navigate } = this.props.navigation;
    const name = "Chi";
    const groupId = this.props.navigation.state.params.groupId;

    return (
      <View style={styles.container}>

        <TouchableOpacity style={{ height: 40, flexDirection: "row", paddingLeft: 20, alignSelf: "stretch" }}>
          <Icon name="ios-arrow-round-back"
            size={34}
            style={{ width: "15%" }}
            onPress={() => { this.props.navigation.goBack() }} />
          <Text style={{ fontSize: 24, width: "70%" }}>{this.props.navigation.state.params.name}</Text>
          <IconInfo name="ios-information-circle-outline"
            size={30}
            style={{ width: "10%" }}
            onPress={() => { navigate("InfoGroup"), {id: groupId}}} />
        </TouchableOpacity>


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
          {(this.state.isChat) && <Chat name={name} groupId={groupId} />}
          {(this.state.isMap) && <Map />}
          {(this.state.isEvent) && <Event 
          navigate={navigate} 
          groupId={groupId} 
          nameGroup={this.props.navigation.state.params.name}
          />}
        </View>
      </View>
    );
  }
}


