import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from "./NotificationStyle";
import { Data } from "../../../api/Data";
import Icon from 'react-native-vector-icons/Ionicons';

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
        userName: data.userName
      })
      this.setState({
        items: items
      })
    });

  }



  render() {
    const { items } = this.state;
    const { navigate } = { ...this.props };
    return (
      <View style={styles.container}>
        <View
          style={styles.header}>
          <Icon name="ios-arrow-round-back"
            size={34}
            style={{ width: "15%", color: "#ffff" }}
            onPress={() => { this.props.navigation.goBack() }} />
          <View style={{justifyContent:"center"}}>
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "600" }}>Thông goBack</Text>
          </View>
        </View>

        <FlatList
          data={items}
          renderItem={
            ({ item }) =>
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity style={styles.item} >

                  <View style={{ flex: 2 }}>
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: item.userAvatar }}
                    />
                  </View>

                  <View style={{ paddingTop: 8, flex: 11 ,paddingRight:20}}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#000000" }}>{item.userName}{item.message}{item.groupName}</Text>
                    <Text style={{ fontSize: 14 }}>1 gio truoc</Text>
                    <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                  </View>
                </TouchableOpacity>
              </View>
          }
        />

      </View>
    );
  }
}

