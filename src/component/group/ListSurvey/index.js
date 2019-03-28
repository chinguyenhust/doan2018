import React, { Component } from 'react';
import {  Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from "./ListSurveyStyle";
import Icon from 'react-native-vector-icons/Ionicons';
import IconNote from 'react-native-vector-icons/Foundation';

import { Data } from "../../../api/Data";

let surveys = Data.ref('/surveys');

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
    var items = []
    surveys.on('child_added', (snapshot) => {
      let data = snapshot.val();
      // if (data.createdByUserId === firebase.auth().currentUser.uid) {
        items.push({
          id: snapshot.key,
          question: data.question,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          options: data.options
        })
      // }
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
              <TouchableOpacity style={styles.item} onPress={() => navigate("DetailSurvey", {id: item.id})}>
                <IconNote name="clipboard-notes" size={30} style={{ width: "10%",  color: "red", }} />
                <View style={styles.info}>
                  <Text style={styles.textName}>{item.question}</Text>
                </View>
              </TouchableOpacity>
             
            </View>
          }
        />

      </View>
    );
  }
}

