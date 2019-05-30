import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from "./NotificationStyle";
import { Data } from "../../../api/Data";
import Icon from 'react-native-vector-icons/Ionicons';
import icon from '../../../assets/icon.png';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconNotifi from 'react-native-vector-icons/Ionicons';
import IconHome from "react-native-vector-icons/Entypo";

let notifis = Data.ref('/notification');

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isHome: this.props.navigation.state.params.isHome,
      isSearch: this.props.navigation.state.params.isSearch,
      isNoti: this.props.navigation.state.params.isNoti,
      isUser: this.props.navigation.state.params.isUser,
    }
  }

  componentDidMount() {
    var items = [];

    notifis.on('child_added', (snapshot) => {
      let data = snapshot.val();
      items.push({
        id: snapshot.key,
        groupName: data.groupName,
        userAvatar: data.userAvatar,
        message: data.message,
        title: data.title,
        token: data.token,
        topic: data.topic,
        userName: data.userName,
        created_at: data.created_at
      })
      this.setState({
        items: items
      })
    });
  }

  getDate = (time) => {
    var a = new Date(time);
    var mounth = a.getMonth() + 1;
    var day = a.getDate();
    var hour = a.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }
    var minute = a.getSeconds();
    if (minute < 10) {
      minute = "0" + minute;
    }
    return "Ngày " + day + " tháng " + mounth + " lúc " + hour + ":" + minute;
  }

  getTime = (time) => {
    var a = new Date(time).getTime();
    var b = new Date().getTime();

    var giay = (b - a) / 1000;

    if (0 <= giay && giay < 60) {
      return "Vừa xong"
    } else {
      var phut = Math.round(giay / 60);
      if (0 <= phut && phut < 60) {
        return phut + " phút trước"
      }
      else {
        var gio = Math.round(phut / 60);
        if (0 <= gio && gio < 24) {
          return gio + "giờ trước"
        }
        else {
          return this.getDate(time);
        }
      }
    }
  }

  render() {
    const { items, isHome, isNoti, isSearch, isUser } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View
          style={styles.header}>
          
          <View style={{ justifyContent: "center" }}>
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "600" }}>Thông báo</Text>
          </View>
        </View>

        <FlatList
          data={items}
          renderItem={
            ({ item }) =>
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity style={styles.item} >
                  <View style={{ flex: 3 }}>
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={icon}
                    />
                  </View>

                  <View style={{ flex: 11, paddingRight: 20 }}>
                    <Text>
                      <Text style={styles.username}>{item.userName}</Text>
                      <Text style={styles.content}>{item.message}</Text>
                      <Text style={styles.username}>{item.groupName}</Text>
                    </Text>

                    <Text style={{ fontSize: 14 }}>{this.getTime(item.created_at)}</Text>
                    <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                  </View>
                </TouchableOpacity>
              </View>
          }
        />

        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tapItem}
            onPress={() => {
              navigate("MyGroup");
              this.setState({
                isHome: true,
                isSearch: false,
                isNoti: false,
                isUser: false,
              })
            }
            }>
            <View style={{ flex: 2, justifyContent: "center" }}>
              <IconHome name="home"
                style={{ fontSize: 20, color: (isHome) ? "#008605" : "#bcbcbc" }}
              />
            </View>
            <Text style={{ color: (isHome) ? "#008605" : "#bcbcbc" }}>Nhóm của tôi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tapItem}
            onPress={() => {
              navigate("SearchScreen",{
                "email": this.props.navigation.state.params.email,
                "isHome": false,
                "isSearch": true,
                "isNoti": false,
                "isUser": false
              });
              this.setState({
                isHome: false,
                isSearch: true,
                isNoti: false,
                isUser: false,
              })
            }}>
            <View style={{ flex: 2, justifyContent: "center" }}>
              <Icon name="ios-search"
                style={{ fontSize: 20, color: (isSearch) ? "#008605" : "#bcbcbc" }}
              />
            </View>
            <Text style={{ color: (isSearch) ? "#008605" : "#bcbcbc" }}>Khám phá</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tapItem}
            onPress={() => {
              navigate("Notification", {
                "email": this.props.navigation.state.params.email,
              "isHome": false,
              "isSearch": false,
              "isNoti": true,
              "isUser": false});
              this.setState({
                isHome: false,
                isSearch: false,
                isNoti: true,
                isUser: false,
              })
            }
            }>
            <View style={{ flex: 2, justifyContent: "center" }}>
              <IconNotifi name="ios-notifications"
                style={{ fontSize: 20, color: (isNoti) ? "#008605" : "#bcbcbc" }}
              />
            </View>
            <Text style={{ color: (isNoti) ? "#008605" : "#bcbcbc" }}>Thông báo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tapItem}
            onPress={() => {
              navigate("UserInfo", {
                "email": this.props.navigation.state.params.email,
                "isHome": false,
                "isSearch": false,
                "isNoti": false,
                "isUser": true
              })
              this.setState({
                isHome: false,
                isSearch: false,
                isNoti: false,
                isUser: true,
              })
            }
            }>
            <View style={{ flex: 2, justifyContent: "center" }}>
              <IconUser name="user-circle"
                style={{ fontSize: 20, color: (isUser) ? "#008605" : "#bcbcbc" }}
              />
            </View>
            <Text style={{ color: (isUser) ? "#008605" : "#bcbcbc" }}>Tôi</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

