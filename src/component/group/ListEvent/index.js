import React, { Component } from 'react';
import { Platform, TextInput, Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from "./ListEventStyle";
import Icon from 'react-native-vector-icons/Ionicons';
import IconEvent from 'react-native-vector-icons/MaterialIcons';
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";

let citys = Data.ref('/citys');

export default class ListEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],

    }
  }

  componentDidMount() {
    citys.on('value', (snapshot) => {
      let data = snapshot.val();
      let items = Object.values(data);
      this.setState({ items: items });
    });

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
              <TouchableOpacity style={styles.item} onPress={() => navigate("DetailEvent")}>
                <IconEvent name="event" size={30} style={{ width: "10%", paddingTop: 5, color: "red", }} />
                <View style={styles.info}>
                  <Text style={styles.textName}>{item.name}</Text>
                  <Text style={styles.textName}>{item.description}</Text>
                </View>
              </TouchableOpacity>

            </View>
          }
        />

      </View>
    );
  }
}

