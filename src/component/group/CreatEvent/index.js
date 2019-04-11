import React, { Component } from 'react';
import { Alert, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './CreatEventStyle';
import DatePicker from 'react-native-datepicker';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';
import { required } from '../../../util/validate';

export default class CreatEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEvent: "",
      date: "",
      address: "",
      description: "",
      errName: "",
      errDate: "",
    }
  }

  componentWillMount() {

  }

  _handleCreatEvent = () => {
    var check = this._handleCheck();
    var { nameEvent, date, address, description } = this.state;
    var user = firebase.auth().currentUser;
    if (check) {
      Data.ref("events").push(
        {
          name: nameEvent,
          time: date,
          description: description,
          address: address,
          createdByUserId: user.uid,
          groupId: this.props.navigation.state.params.groupId,
          created_at: firebase.database.ServerValue.TIMESTAMP
        }
      ).then(() => {
        console.log("Success !");
      }).catch((error) => {
        console.log(error);
      });
      this.props.navigation.navigate("DetailGroup", { name: this.props.nameGroup });
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

  _handleChangeEventName = (text) => {
    var errName = required(text);
    this.setState({
      nameEvent: text,
      errName: errName
    })
  }

  _handleCheck() {
    const { nameEvent, errName, date, errDate } = this.state;
    if (nameEvent && date && !errName && !errDate)
      return true;
    return false;
  }

  render() {

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34}
              style={{ width: "15%" }}
              onPress={() => { this.props.navigation.goBack() }} />
            <View style={{ width: "75%", justifyContent: "center", }}>
              <Text style={{ fontSize: 24, width: "70%", fontWeight: "600" }}>Tạo kế hoạch</Text>
            </View>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
        </View>
        <View style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>

          <View style={styles.viewInput}>
            <Text style={styles.titleBold}>Tên kế hoach (*)</Text>
            <TextInput style={styles.textInput}
              placeholder="Đặt tên kế hoạch"
              value={this.state.nameEvent}
              blurOnSubmit={false}
              onSubmitEditing={() => { this.descriptionInput.focus(); }}
              onChangeText={this._handleChangeEventName} />
            {this.state.errName ? <Text style={styles.textError}>{this.state.errName}</Text> : null}
          </View>

          <View style={styles.viewInput}>
            <Text style={styles.titleBold}>Mô tả</Text>
            <TextInput
              ref={(input) => { this.descriptionInput = input; }}
              placeholder="Mô tả"
              style={styles.textInput}
              onChangeText={(description) => {
                this.setState({ 
                  description: description 
                });
              }}
              value={this.state.description}
            />
          </View>

          <Text style={{ fontSize: 16, marginTop: 20, fontWeight: "600" }}>Thời gian (*)</Text>
          <DatePicker
            style={{ marginTop: 10, width: "100%" }}
            date={this.state.date}
            mode="datetime"
            placeholder="Chọn thời gian"
            format="YYYY-MM-DD hh:mm a"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            is24Hour={true}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
                display: "none"
              },
              dateInput: {
                alignItems: "flex-start",
                paddingLeft: 20,
                fontSize: 16,
                borderRadius: 7
              }
            }}
            onDateChange={(date) => {
              var errDate = required(date)
              this.setState({
                date: date,
                errDate: errDate
              })
            }}
          />

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Địa điểm</Text>
            <TextInput
              placeholder="Nhập địa điểm"
              style={styles.textInput}
              onChangeText={(address) => {
                this.setState({ address });
              }}
              value={this.state.address}
            />
          </View>

          <TouchableOpacity style={styles.buttonCreat} onPress={this._handleCreatEvent}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Tạo ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
