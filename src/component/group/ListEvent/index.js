import React, { Component } from 'react';
import { Platform, TextInput, Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from "./ListEventStyle";
import Icon from 'react-native-vector-icons/Ionicons';
import IconEvent from 'react-native-vector-icons/MaterialIcons';
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";

let events = Data.ref('/events');

export default class ListEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    var items = []
    events.orderByChild("created_at").on('child_added', (snapshot) => {
      let data = snapshot.val();
      // if (data.createdByUserId === firebase.auth().currentUser.uid) {
        items.push({
          id: snapshot.key,
          name: data.name,
          address: data.address,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          time: data.time
        })
      // }
      this.setState({ items: items });
    });
    // citys.on('value', (snapshot) => {
    //   let data = snapshot.val();
    //   let items = Object.values(data);
    //   this.setState({ items: items });
    // });

  }

  render() {
    const { navigate } = { ...this.props };
    const { items } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={
            ({ item }) => <View style={styles.itemStyle}>
              <TouchableOpacity style={styles.item} onPress={() => navigate("DetailEvent", {id: item.id})}>
                <IconEvent name="event" size={30} style={{ width: "10%", paddingTop: 5, color: "red", }} />
                <View style={styles.info}>
                  <Text style={styles.textName}>{item.name}</Text>
                  <Text style={styles.textName}>{item.time}</Text>
                </View>
              </TouchableOpacity>

            </View>
          }
        />
      </View>
    );
  }
}

