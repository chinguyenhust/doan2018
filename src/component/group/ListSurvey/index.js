import React, { Component } from 'react';
import {  Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from "./ListSurveyStyle";
import Icon from 'react-native-vector-icons/Ionicons';
import IconNote from 'react-native-vector-icons/Foundation';

import { Data } from "../../../api/Data";

let citys = Data.ref('/citys');

export default class ListSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],

    }
  }

//   _handleClickItem = (name) => {
//     this.props.navigation.navigate('Home', { city: name })
//   }

  componentDidMount() {
    citys.on('value', (snapshot) => {
      let data = snapshot.val();
      let items = Object.values(data);
      this.setState({ items: items });
    });

  }

  render() {
    const { items} = this.state;
    const { navigate } = { ...this.props };
    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={
            ({ item }) => <View style={styles.itemStyle}>
              <TouchableOpacity style={styles.item} onPress={() => navigate("DetailSurvey")}>
                <IconNote name="clipboard-notes" size={30} style={{ width: "10%",  color: "red", }} />
                <View style={styles.info}>
                  <Text style={styles.textName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
             
            </View>
          }
        />

      </View>
    );
  }
}

