import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './DetailEventStyle';
import DatePicker from 'react-native-datepicker';
import RadioGroup from 'react-native-radio-buttons-group';

export default class DetailEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEvent: "Về ăn cơm",
      date: "2019-03-14 00:00",
      address: "KTX Bách Khoa",
      data: [
        {
          label: 'Có tham gia',
          value: 1
        },
        {
          label: 'Không tham gia',
          value: 0,
        },
      ],
    }
  }

  onPress = data => this.setState({ data });

  render() {
    const { navigate } = this.props.navigation;
    let selectedButton = this.state.data.find(e => e.selected == true);
    selectedButton = selectedButton ? selectedButton.value : this.state.data[0].label;

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{ fontSize: 24, width: "70%" }}>kế hoạch</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
        </View>
        <View style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 16, marginTop: 10 }}>Tên kế hoach:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(nameEvent) => {
                this.setState({ nameEvent });
              }}
              value={this.state.nameEvent}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, marginTop: 10 }}>Địa điểm: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(address) => {
                this.setState({ address });
              }}
              value={this.state.address}
            />
          </View>

          <DatePicker
            style={{ marginTop: 10, width: "100%" }}
            date={this.state.date}
            mode="datetime"
            format="YYYY-MM-DD hh:mm AM/PM"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(date) => { this.setState({ date: date }) }}
          />

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Số người tham gia: 7/10</Text>
            <FlatList
              horizontal={true}
              data={[{ key: 'a' }, { key: 'b' }, { key: 'a' }, { key: 'b' }, { key: 'a' }, { key: 'b' }]}
              renderItem={({ item }) => <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "red", marginLeft: 15, marginTop: 20 }}></View>}
            />
            <View style={{ marginTop: 20, alignItems: "flex-start", }}>
              <RadioGroup
                radioButtons={this.state.data}
                onPress={this.onPress}
              />
            </View>
          </View>


          <TouchableOpacity style={styles.buttonCreat} onPress={() => navigate('DetailGroup')}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
