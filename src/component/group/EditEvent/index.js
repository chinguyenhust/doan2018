import React, { Component } from 'react';
import { Alert, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './EditEventStyle';
import DatePicker from 'react-native-datepicker';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';
import { required } from '../../../util/validate';
import PlaceAutoComplete from '../../home/GoogleMapInput/index';

export default class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEvent: this.props.navigation.state.params.name,
      date: this.props.navigation.state.params.time,
      address: this.props.navigation.state.params.address,
      description: this.props.navigation.state.params.description,
      errName: "",
      errDate: "",
      minDate: "",
      maxDate:"",
      groupName: ""
    }
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
  }

  componentDidMount() {
    var groupId = this.props.navigation.state.params.groupId;
    Data.ref("groups").orderByKey().equalTo(groupId).on("child_added", (snapshot) => {
      var data = snapshot.val();
      this.setState({
        minDate: data.startDate,
        maxDate:data.untilDate,
        groupName:data.name
      })
    })
  }

  _handleEditEvent = () => {
    var check = this._handleCheck();
    var id = this.props.navigation.state.params.id;
    var { nameEvent, date, address, description, groupName } = this.state;
    // const uid = this.props.navigation.state.params.uid;
    if (check) {
      Data.ref("events").child(id).update(
        {
          name: nameEvent,
          time: date,
          description: description,
          address: address,
          // editByUserId: uid,
          created_edit: firebase.database.ServerValue.TIMESTAMP,
        }
      ).then(() => {
        // Data.ref("notification").push({
        //   topic: groupId,
        //   groupName: groupName,
        //   userName: userName,
        //   token: "",
        //   title: "Chỉnh sửa kế hoạch",
        //   message: " vừa tạo một kế hoạch mới trong ",
        //   created_at: firebase.database.ServerValue.TIMESTAMP,
        //   userAvatar: "https://facebook.github.io/react-native/docs/assets/favicon.png"
        // })
      }).catch((error) => {
        console.log(error);
      });
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

  _handleChangeEventName = (text) => {
    var errName = required(text);
    this.setState({
      nameEvent: text,
      errName: errName
    })
  }

  handleSelectAddress(data, details) {
    this.setState({
      address: details.formatted_address
    })
  }

  _handleCheck() {
    const { nameEvent, errName, date, errDate } = this.state;
    if (nameEvent && date && !errName && !errDate)
      return true;
    return false;
  }

  toDate = (dateStr) => {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0])
  }

  render() {
    var {groupName, maxDate} = this.state;

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <View style={styles.tap}>
            <TouchableOpacity style={{ width: "15%", justifyContent: "center" }}
              onPress={() => { this.props.navigation.goBack() }} >
              <Icon name="ios-arrow-round-back" size={34} style={{ color: "#ffffff" }} />
            </TouchableOpacity>
            <View style={{ width: "75%", justifyContent: "center", }}>
              <Text style={{ fontSize: 20, width: "70%", fontWeight: "600", color: "#ffffff" }}>Chỉnh sửa kế hoạch</Text>
            </View>
          </View>
          {/* <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View> */}
        </View>

        <ScrollView style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>
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

          <Text style={{ fontSize: 16, marginTop: 20, fontWeight: "600", color:"#000000" }}>Thời gian (*)</Text>
          <DatePicker
            style={{ marginTop: 10, width: "100%" }}
            date={this.state.date}
            mode="datetime"
            placeholder="Chọn thời gian"
            format="YYYY-MM-DD hh:mm a"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minDate={new Date()}
            maxDate={this.toDate(maxDate)}
            is24Hour={true}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                right: 5,
                marginTop: 10,
                display: "none"
              },
              dateInput: {
                alignItems: "flex-start",
                fontSize: 16,
                fontWeight: "300",
                paddingHorizontal: 10,
                height: 45,
                borderWidth: 0.5,
                borderRadius: 4,
                borderColor: "#bcbcbc",
                marginVertical: 8
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
            <Text style={{ fontSize: 16, fontWeight: "600", color:"#000000" }}>Địa điểm</Text>
          </View>
          <PlaceAutoComplete handleSelectAddress={this.handleSelectAddress}  address = {this.state.address}/>

          <TouchableOpacity style={styles.buttonCreat} onPress={this._handleEditEvent}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Cập nhật</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
