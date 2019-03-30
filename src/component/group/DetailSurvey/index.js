import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/Ionicons';
import styles from './DetailSurveyStyle';
import { CheckBox } from 'react-native-elements';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';

var survey = Data.ref("surveys");
var answers = Data.ref("answers");

export default class DetailSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      isAdd: false,
      options: [],
      optionValue: "",
      checked: []
    }
  }

  componentDidMount() {
    const surveyId = this.props.navigation.state.params.id;
    var user = firebase.auth().currentUser;
    var checked = this.state.checked;
    const options = this.state.options;
    survey.child(surveyId).on("value", (snapshot) => {
      var data = snapshot.val();
      this.setState({
        question: data.question,
      });
    })

    const arrSurvey = [];
    answers.orderByChild("survey_id").equalTo(surveyId).on("child_added", (snapshot, index) => {
      var data = snapshot.val();
      arrSurvey.push({
        key: snapshot.key,
        value: data.value,
        members: data.members
      })
      this.setState({
        options: arrSurvey
      });
    });

    if (options) {
      options.map((item, index) => {
        var arrMember = item.members;
        if (arrMember) {
          if (arrMember.includes(user.uid)) {
            checked[index] = true;
          } else {
            checked[index] = false;
          }
        }else{
          checked[index] = false;
        }
      });
      console.log(checked);
    }
  }

  _handleAddOption = () => {
    var { options, optionValue } = this.state;
    if (optionValue === "") {
      alert("Nhập giá trị của tuỳ chọn")
    } else {
      options.push({ value: optionValue, members: [] });
    }

    this.setState({
      options: options,
      isAdd: true,
      optionValue: ""
    })
  }

  _handeSend() {
    var user = firebase.auth().currentUser;
    var check = this.state.checked;
    check.map((item, index) => {
    })
    const surveyId = this.props.navigation.state.params.id;
    var survey = Data.ref("surveys");
    survey.child(surveyId).on("value", (snapshot) => {
      var data = snapshot.val();
      this.setState({
        question: data.question,
        options: data.options
      })
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    const { options, question, checked } = this.state;
    const surveyId = this.props.navigation.state.params.id;
    var user = firebase.auth().currentUser;

    if (options) {
      options.map((item, index) => {
        var arrMember = item.members;
        if (arrMember) {
          if (arrMember.includes(user.uid)) {
            checked[index] = true;
          } else {
            checked[index] = false;
          }
        }else{
          checked[index] = false;
        }
      });
      console.log(checked);
    }
    this.setState({
      checked: checked
    });

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

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Câu hỏi: </Text>
            <Text style={{ fontSize: 16, color: "red", marginLeft: 20 }}> {question} </Text>
          </View>

          {(options.length > 0) &&
            options.map((option, index) =>
              <View style={styles.checkbox}>
                <CheckBox
                  center
                  title={option.value}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={this.state.checked[index]}
                  containerStyle={{ borderWidth: 0, backgroundColor: "#fff", width: "80%", alignItems: "flex-start" }}
                  onPress={() => {
                    if (option.members) {
                      if (option.members.includes(user.uid)) {
                        var indexOf = option.members.indexOf(user.uid)
                        answers.child(option.key).child("members").child(indexOf).remove();
                        // checked[index] = !checked[index];
                      } else {
                        var arr = option.members.push(user.uid);
                        answers.child(option.key).update({
                          members: arr
                        })
                        // checked[index] = !checked[index];
                        // (checked[index]) ? checked[index] : ((option.members) ? option.members.includes(user.uid): false)
                      }
                    } else {
                      var arr = (option.members ? option.members : []);
                      arr.push(user.uid);
                      answers.child(option.key).update({
                        members: arr
                      });
                      // checked[index] = !checked[index];
                    }
                    checked[index] = !checked[index];
                    this.setState({
                      checked: checked
                    })
                    // if (checked[index] === true) {
                    //   var arr = (option.members ? option.members : []);
                    //   arr.push(user.uid);
                    //   answers.child(option.key).update({
                    //     members: arr
                    //   })
                    // } else {
                    //   answers.child(option.key).child("members").child(user.uid).on("value",(snap) => {
                    //     console.log(snap.val())
                    //     })
                    // }
                  }}
                />
                <Text style={{ fontSize: 16, marginTop: 10 }}> 0 vote</Text>
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

          <TouchableOpacity style={styles.buttonCreat} onPress={() => navigate('DetailGroup')}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Gửi lựa chọn</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
