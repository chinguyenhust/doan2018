import React, { Component } from 'react';
import { Image, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './DetailEventStyle';
import DatePicker from 'react-native-datepicker';
import RadioGroup from 'react-native-radio-buttons-group';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';

let users = Data.ref('/users');

export default class DetailEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEvent: "",
      description: "",
      date: "",
      address: "",
      data: [
        {
          label: 'Có tham gia',
          value: 1,
          color: "#006805"
        },
        {
          label: 'Không tham gia',
          value: 2,
          color: "#006805"
        },
      ],
      members: []
    }
  }

  componentDidMount() {

    var items = []
    users.on('child_added', (snapshot) => {
      let data = snapshot.val();
      items.push({
        id: snapshot.key,
        name: data.userName,
        avatar: data.avatar,
        phone: data.phone
      })
      this.setState({ members: items });
    }); 


    const eventId = this.props.navigation.state.params.id;
    var event = Data.ref("events");
    event.child(eventId).on("value", (snapshot) => {
      var data = snapshot.val();
      this.setState({
        nameEvent: data.name,
        description: data.description,
        date: data.time,
        address: data.address
      })
    })
  }

  onPress = (data) => {
    const eventId = this.props.navigation.state.params.id;
    const uid = this.props.navigation.state.params.uid;
    const members = [];

    data.map((item) => {
      
      if (item.selected === true && item.value ==1) {
        members.push(uid);
        Data.ref("events").child(eventId).update({
          members: members,
        })
      }
      else {
        var indexOf = members.indexOf(uid)
        Data.ref("events").child(eventId).child("members").child(indexOf).remove()
      }
      
    })
    this.setState({ data });
  };

  _handleUpDate = () => {
    const { nameEvent, date, address } = this.state;
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
          <View style={styles.tap}>
            <TouchableOpacity style={{ width: "10%", alignItems:"center" }}
              onPress={() => { this.props.navigation.goBack() }} >
              <Icon name="ios-arrow-round-back" size={34} style={{ color: "#ffffff" }} />
            </TouchableOpacity>
            <View style={{ width: "80%", alignItems: "center", }}>
              <Text style={{ fontSize: 20, width: "70%", fontWeight: "500", color: "#ffffff" }}>Kế hoạch</Text>
            </View>
          </View>
          {/* <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View> */}
        </View>
        <View style={{ paddingLeft: 20, paddingRight: 20, flexDirection: "column", }}>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Tên kế hoạch:</Text>
            <Text numberOfLines={2} style={styles.text}>  {this.state.nameEvent}</Text>
            {/* <TextInput
              style={styles.input}
              onChangeText={(nameEvent) => {
                this.setState({ nameEvent });
              }}
              value={this.state.nameEvent}
            /> */}
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Mô tả:</Text>
            <View>
              <Text numberOfLines={2} style={styles.text}>  {this.state.description}</Text>
            </View>
            {/* <TextInput
              style={styles.input}
              onChangeText={(description) => {
                this.setState({ description });
              }}
              value={this.state.description}
            /> */}
          </View>

          <View style={{ flexDirection: "row", marginTop: 20, }}>
            <Text style={{ fontSize: 16 }}>Địa điểm: </Text>
            <View style={{paddingLeft:10, width:"80%"}}>
              <Text numberOfLines={3} style={styles.text}>{this.state.address}</Text>
            </View>
            {/* <TextInput
              style={styles.input}
              onChangeText={(address) => {
                this.setState({ address });
              }}
              value={this.state.address}
            /> */}
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
              data={this.state.members}
              renderItem={({ item }) =>
                <View style={{ marginLeft: 15, marginTop: 20 }}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: (item.avatar) ? item.avatar :'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                  />
                </View>
              }
            />
            <View style={{ marginTop: 20, alignItems: "flex-start", }}>
              <RadioGroup
                radioButtons={this.state.data}
                onPress={this.onPress}
                color="#006805"
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
