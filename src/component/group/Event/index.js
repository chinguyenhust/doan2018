import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import styles from './EventStyle';
import ListEvent from '../ListEvent';
import ListSurvey from '../ListSurvey';
import IconAdd from 'react-native-vector-icons/MaterialIcons';


export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEvent: true,
      isSurvey: false,
    }
  }

  handleClickEvent = () => {
    this.setState({
      isEvent: true,
      isSurvey: false,
    })
  }

  handleClickSurvey = () => {
    this.setState({
      isEvent: false,
      isSurvey: true,
    })
  }


  render() {

    const { navigate } = {...this.props};
    const groupId = this.props.groupId;
    return (
      <View style={styles.container}>
        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tapbarItem} onPress={this.handleClickEvent}>
            <Text style={(this.state.isEvent) ? styles.lableAfter : styles.lableBefore}>Kế Hoạch</Text>
            {(this.state.isEvent) && <View style={styles.line}></View>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tapbarItem} onPress={this.handleClickSurvey}>
          <Text style={(this.state.isSurvey) ? styles.lableAfter : styles.lableBefore}>Khảo sát</Text>
            {(this.state.isSurvey) && <View style={styles.line}></View>}
          </TouchableOpacity>
        </View>
        <View style={{flex: 11}}>
            {(this.state.isEvent) && <ListEvent 
            navigate={navigate}
            groupId={groupId}
            />}
            {(this.state.isSurvey) && <ListSurvey 
            navigate={navigate}
            groupId={groupId}
            />}
        </View>

        <TouchableOpacity style={{ zIndex: 1000, bottom: 30, justifyContent: 'flex-end', marginLeft: "80%", position: 'absolute' }} 
        onPress={()=>{
          (this.state.isEvent)? 
          navigate("CreatEvent",{groupId: groupId}) : 
          navigate("CreatSurvey", {groupId: groupId})}}>
          <IconAdd name="add-circle" size={60} style={{ color: "#006805" }} />
        </TouchableOpacity>
      </View>
    );
  }
}


