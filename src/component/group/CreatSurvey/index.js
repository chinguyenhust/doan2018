import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/Ionicons';
import styles from './CreatSurveyStyle';
import { CheckBox } from 'react-native-elements';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';

export default class CreatSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      isAdd: false,
      options: [],
      optionValue: "",
      checked: false
    }
  }

  _handleAddOption = () => {
    var { options, optionValue } = this.state;
    if(optionValue === ""){
      alert("Nhập giá trị của tuỳ chọn")
    }else{
      options.push({ 
        value: optionValue, 
        members: [] 
      });
    }
    this.setState({
      options: options,
      isAdd: true,
      optionValue: ""
    })
  }

  _handleChecked = () => {
    this.setState({
      checked: true,
      })
  }

  _handleCreatSurvey = () =>{
    var { question, options } = this.state;
    var user = firebase.auth().currentUser;
    Data.ref("surveys").push(
      {
        question: question,
        options: options,
        createdByUserId: user.uid,
        groupId: this.props.navigation.state.params.groupId, 
        created_at: firebase.database.ServerValue.TIMESTAMP
      }
    ).then((snapshot) => {
        if(options){
          options.map((item) => {
            Data.ref("answers").push(
              {
                survey_id: snapshot.key,
                value: item.value,
                members: item.members
              }
            ).then(() => {
              console.log("Success !");
            }).catch((error) => {
              console.log(error);
            });
          })
        }
    }).catch((error) => {
      console.log(error);
    });

    this.props.navigation.navigate("DetailGroup", { name: this.props.nameGroup })
  }

  render() {
    const { navigate } = this.props.navigation;
    const { options } = this.state;
    console.log("length ", options.length)

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{ fontSize: 24, width: "70%" }}>Khảo sát ý kiến</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
        </View>
        <View style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Câu hỏi</Text>
            <TextInput
              placeholder="Nhập câu hỏi khảo sát"
              style={styles.inputQuestion}
              onChangeText={(question) => {
                this.setState({ question });
              }}
              value={this.state.question}
            />
          </View>

          {(options.length > 0) &&
            options.map((option) =>
              <View style={styles.checkbox}>
                <CheckBox
                  center
                  title={option.value}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={this.state.checked}
                  containerStyle={{borderWidth: 0,backgroundColor: "#fff"}}
                  // onPress={this._handleChecked}
                />
              </View>
            )}

          <View style={styles.option}>
            <IconAdd name="ios-add" style={styles.icon} size={30} onPress={this._handleAddOption} />
            <TextInput placeholder="Thêm option"
              style={styles.input}
              onChangeText={(optionValue) => {
                this.setState({ optionValue });
              }}
              value={this.state.optionValue}
            />
          </View>

          <TouchableOpacity style={styles.buttonCreat} onPress={this._handleCreatSurvey}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Tạo ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
