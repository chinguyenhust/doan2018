import React, { Component } from 'react';
import { Alert, Text, View, TouchableOpacity, TextInput , Switch} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/Ionicons';
import styles from './CreatSurveyStyle';
import { CheckBox } from 'react-native-elements';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';
import { required } from '../../../util/validate';

export default class CreatSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      errQuestion: "",
      isAdd: false,
      options: [],
      optionValue: "",
      checked: false,
      vote: [],
      isAccept: false,
    }
  }

  _handleAddOption = () => {
    var { options, optionValue } = this.state;
    if (optionValue === "") {
      alert("Nhập giá trị của tuỳ chọn")
    } else {
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
      checked: !this.state.checked,
    })
  }

  _handleCreatSurvey = () => {
    var { question, options } = this.state;
    var check = this._handleCheck();
    const uid = this.props.navigation.state.params.uid;
    const groupId = this.props.navigation.state.params.groupId;
    const userName = this.props.navigation.state.params.userName;
    const groupName = this.props.navigation.state.params.groupName;
    if (check) {
      Data.ref("surveys").push(
        {
          question: question,
          options: options,
          createdByUserId: uid,
          groupId: this.props.navigation.state.params.groupId,
          created_at: firebase.database.ServerValue.TIMESTAMP,
          userNameCreated: userName,
          groupName: groupName,
          isAccept: this.state.isAccept
        }
      ).then((snapshot) => {
        if (options) {
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

      Data.ref("notification").push({
        topic: groupId,
        groupName: groupName,
        userName: userName,
        token: "",
        title: "Khảo sát mới",
        message: " vừa tạo một cuộc thăm dò ý kiến trong ",
        created_at: firebase.database.ServerValue.TIMESTAMP,
        userAvatar: "https://facebook.github.io/react-native/docs/assets/favicon.png"
      })

      this.props.navigation.navigate("DetailGroup", { name: groupName });
    } else {
      Alert.alert(
        'Thông báo',
        'Vui lòng điền đầy đủ thông tin!',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    }
  }

  _handleChangeQuestionName = (text) => {
    var errQuestion = required(text);
    this.setState({
      question: text,
      errQuestion: errQuestion
    })
  }

  _handleCheck() {
    const { question, errQuestion, } = this.state;
    if (question && !errQuestion)
      return true;
    return false;
  }

  handleToggle = () => {
    this.setState({
      isAccept: !this.state.isAccept
    })
  }


  render() {
    const { navigate } = this.props.navigation;
    const { options } = this.state;
    console.log("length ", options.length)

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <View style={styles.tap}>
            <TouchableOpacity style={{ width: "15%", justifyContent: "center" }}
              onPress={() => { this.props.navigation.goBack() }}>
              <Icon name="ios-arrow-round-back" size={34} style={{ color: "#ffffff" }} />
            </TouchableOpacity>
            <View style={{ width: "75%", justifyContent: "center", }}>
              <Text style={{ fontSize: 20, width: "70%", fontWeight: "600", color: "#ffffff" }}>Khảo sát ý kiến</Text>
            </View>
          </View>
          {/* <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View> */}
        </View>
        <View style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>

          <View style={styles.viewInput}>
            <Text style={styles.titleBold}>Câu hỏi (*)</Text>
            <TextInput style={styles.textInput}
              placeholder="Nhập câu hỏi khảo sát"
              value={this.state.question}
              blurOnSubmit={false}
              onChangeText={this._handleChangeQuestionName} />
            {this.state.errQuestion ? <Text style={styles.textError}>{this.state.errQuestion}</Text> : null}
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
                  containerStyle={{ borderWidth: 0, backgroundColor: "#fff" }}
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

          {/* <View style={styles.schedule}>
            <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }} >
              <View style={{ flex: 4 }}>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: "600" }}>Cho phép thành viên thêm lựa chọn</Text>
              </View>

              <View style={{ flex: 1, alignItems: "center", }} >
                <Switch
                  thumbColor="#006805"
                  onValueChange={this.handleToggle}
                  value={this.state.isAccept} />
              </View>
            </View>
          </View> */}

          <TouchableOpacity style={styles.buttonCreat} onPress={this._handleCreatSurvey}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Tạo ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
