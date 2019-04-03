import React, { Component } from 'react';
import { Image, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './DetailEventStyle';
import DatePicker from 'react-native-datepicker';
import RadioGroup from 'react-native-radio-buttons-group';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';

export default class DetailEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEvent: "",
      date: "",
      address: "",
      data: [
        {
          label: 'Có tham gia',
          value: 1,
          color: "#007aff"
        },
        {
          label: 'Không tham gia',
          value: 2,
          color: "#007aff"
        },
      ],
      members: []
    }
  }

  componentDidMount() {
    const eventId = this.props.navigation.state.params.id;
    var event = Data.ref("events");
    event.child(eventId).on("value", (snapshot) => {
      var data = snapshot.val();
      this.setState({
        nameEvent: data.name,
        date: data.time,
        address: data.address
      })
      // console.log("iems  ", data)
    })
  }

  onPress = (data) => {
    const eventId = this.props.navigation.state.params.id;
    const members = this.state.members;
    var user = firebase.auth().currentUser;

    data.map((item) => {
      console.log(item.selected);
      if (item.selected === true) {
        members.push(user.uid)
        Data.ref("participations").push({
          event_id: eventId,
          members: members,
        })
      }
    })
    console.log(data[0]);
    this.setState({ data });
  };

  _handleUpDate = () => {
    const {nameEvent, date, address} = this.state;
    const eventId = this.props.navigation.state.params.id;
    var event = Data.ref("events");
    event.child(eventId).update({
      name: nameEvent,
      time: date,
      address: address,
      user_update: firebase.auth().currentUser.uid,
      time_update: firebase.database.ServerValue.TIMESTAMP
    });
    this.props.navigation.navigate('DetailGroup');
  }

  render() {
    const { navigate } = this.props.navigation;
    let selectedButton = this.state.data.find(e => e.selected == true);
    selectedButton = selectedButton ? selectedButton.value : this.state.data[0].value;

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{ fontSize: 24, width: "70%" }}>Kế hoạch</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
        </View>
        <View style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 16, marginTop: 10 }}>Tên kế hoạch:</Text>
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
            format="YYYY-MM-DD hh:mm a"
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
            onDateChange={(date) => {
              this.setState({
                date: date
              })
            }}
          />

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Số người tham gia: 7/10</Text>
            <FlatList
              horizontal={true}
              data={[{ key: 'a' }, { key: 'b' }, { key: 'a' }, { key: 'b' }, { key: 'a' }, { key: 'b' }]}
              renderItem={({ item }) =>
                <View style={{ marginLeft: 15, marginTop: 20 }}>
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                  />
                </View>
              }
            />
            <View style={{ marginTop: 20, alignItems: "flex-start", }}>
              <RadioGroup
                radioButtons={this.state.data}
                onPress={this.onPress}
                color="#007aff"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.buttonCreat} onPress={this._handleUpDate}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
