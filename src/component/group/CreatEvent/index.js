import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './CreatEventStyle';
import DatePicker from 'react-native-datepicker'

export default class CreatEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEvent: "",
      date: "",
      address: "",

    }
  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{ fontSize: 24, width: "70%" }}>Tạo kế hoạch</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
        </View>
        <View style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Tên kế hoach</Text>
            <TextInput
              placeholder="Đặt tên kế hoạch"
              style={styles.input}
              onChangeText={(nameEvent) => {
                this.setState({ nameEvent });
              }}
              value={this.state.nameEvent}
            />
          </View>

          <Text style={{ fontSize: 16, marginTop: 20 }}>Thời gian</Text>
          <DatePicker
            style={{ marginTop: 10, width: "100%" }}
            date={this.state.date}
            mode="datetime"
            placeholder="Chọn thời gian"
            format="YYYY-MM-DD hh:mm AM/PM"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
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
            onDateChange={(date) => { this.setState({ date: date }) }}
          />

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Địa điểm</Text>
            <TextInput
              placeholder="Nhập địa điểm"
              style={styles.input}
              onChangeText={(address) => {
                this.setState({ address });
              }}
              value={this.state.address}
            />
          </View>

          <TouchableOpacity style={styles.buttonCreat} onPress={() => navigate('DetailGroup')}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Tạo ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
