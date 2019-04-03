import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from "./ListEventStyle";
import IconDelete from 'react-native-vector-icons/MaterialIcons';
import IconEvent from 'react-native-vector-icons/MaterialIcons';
import IconStatus from 'react-native-vector-icons/Ionicons';
import { Data } from "../../../api/Data";

let events = Data.ref('/events');

export default class ListEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    }
  }

  componentDidMount = async () => {
    var items = [];
    const groupId = this.props.groupId;
    await events.orderByChild("groupId").equalTo(groupId).on('child_added', (snapshot) => {
      let data = snapshot.val();
      items.push({
        id: snapshot.key,
        name: data.name,
        address: data.address,
        userId: data.createdByUserId,
        created_at: data.created_at,
        groupId: data.groupId,
        time: data.time
      })
      this.setState({ items: items.sort(this.compare) });
    });
  }

  componentWillReceiveProps() {
    var items = [];
    const groupId = this.props.groupId;
    events.orderByChild("groupId").equalTo(groupId).on('child_added', (snapshot) => {
      let data = snapshot.val();
      items.push({
        id: snapshot.key,
        name: data.name,
        address: data.address,
        userId: data.createdByUserId,
        created_at: data.created_at,
        groupId: data.groupId,
        time: data.time
      })
      this.setState({ items: items.sort(this.compare) });
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


  render() {
    const { navigate } = { ...this.props };
    const { items } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={
            ({ item }) => <View style={styles.itemStyle}>
              <TouchableOpacity style={styles.item} onPress={() => navigate("DetailEvent", { id: item.id })}>
                <IconEvent name="event" size={30} style={{ width: "10%", paddingTop: 5, color: "red", }} />
                <View style={styles.info}>
                  <Text style={styles.textName}>{item.name}</Text>
                  <Text style={styles.textName}>{item.time}</Text>
                </View>
                {(new Date(item.time).getTime()) > new Date().getTime() &&
                  <IconStatus name="md-radio-button-on" size={20}
                    style={{ width: "7%", paddingTop: 10, color: "green", }} />
                }
                <IconDelete name="delete" size={24}
                  style={{ width: "10%", paddingTop: 8, color: "gray", right: 0 }} />

              </TouchableOpacity>

            </View>
          }
        />
      </View>
    );
  }
}

