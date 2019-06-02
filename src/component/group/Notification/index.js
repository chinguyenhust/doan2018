import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from "./NotificationStyle";
import { Data } from "../../../api/Data";
import icon from '../../../assets/icon.png';
import { ScrollView } from 'react-native-gesture-handler';

let notifis = Data.ref('/notification');

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],

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
        items: items.sort(this.compare)
      })
    });
  }

  compare = (a, b) => {
    var time1 = new Date(a.created_at).getTime();
    var time2 = new Date(b.created_at).getTime();
    if (time2 < time1)
      return -1;
    if (time2 > time1)
      return 1;
    return 0;
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

  handleClickItem = ( title, groupId, groupName, userName) => {
    const navigation  = this.props.navigation;
    if(title === "Nhóm mới"){
      navigation.navigate('MyGroup', {
         "email": this.props.email, 
         "user_id": this.props.user_id ,
         "page": "HomeScreen"
        });
    }else{
      navigation.navigate('DetailGroup', {
        name: groupName,
        groupId: groupId,
        uid: this.props.user_id,
        userName: userName,
      })
    }
  }

  render() {
    const { items} = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View
          style={styles.header}>

          <View style={{ justifyContent: "center" }}>
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "500" }}>Thông báo</Text>
          </View>
        </View>
        
        <ScrollView>
        <FlatList
          data={items}
          renderItem={
            ({ item }) =>
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity style={styles.item} onPress={()=>{this.handleClickItem(item.title, item.topic, item.groupName, item.userName)}}>
                  <View style={{ flex: 3 }}>
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={icon}
                    />
                  </View>

                  <View style={{ flex: 11, paddingRight: 20 }}>
                    <Text>
                      {(item.title !== "Nhóm mới") &&
                        <Text style={styles.username}>{item.userName}</Text>
                      }
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
        <View style={{height:100}}></View>
        </ScrollView>
      </View>
    );
  }
}

