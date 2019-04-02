import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
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

  componentDidMount() {
    var items = [];
    const groupId = this.props.groupId;
    surveys.orderByChild("groupId").equalTo(groupId).on('child_added', (snapshot) => {
      let data = snapshot.val();
      items.push({
        id: snapshot.key,
        question: data.question,
        userId: data.createdByUserId,
        created_at: data.created_at,
        groupId: data.groupId,
        options: data.options
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
    const { items } = this.state;
    const { navigate } = { ...this.props };
    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={
            ({ item }) =>
              <View style={styles.itemStyle}>
                <TouchableOpacity style={styles.item} onPress={() => navigate("DetailSurvey", { id: item.id })}>
                  <IconNote name="clipboard-notes" size={30} style={{ width: "10%", color: "red", }} />
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

