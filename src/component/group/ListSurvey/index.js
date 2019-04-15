import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from "./ListSurveyStyle";
import IconDelete from 'react-native-vector-icons/MaterialIcons';
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

  componentWillReceiveProps() {
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

  getTime = (a) => {
    var b = new Date().getTime();
    var phut = (b-a) / 1000 / 60;
    if (phut >= 60) {
      var gio = phut / 60;
      if (gio >= 24) {
        var ngay = gio / 24;
        if(ngay >= 7){
          tuan = ngay/7;
          return  Math.round(tuan) + " tuan truoc";
        }else{
          return  Math.round(ngay) + " ngay truoc";
        }
      } else {
        return  Math.round(gio) + " gio truoc";
      }
    } else {
      return Math.round(phut) + "phut truoc";
    }

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
                  <View style={{ width: "10%", justifyContent: "center", }}>
                    <IconNote name="clipboard-notes" size={30} style={{ color: "red", }} />
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.textName}>{item.question}</Text>
                    <Text style={styles.textView}>Created: {this.getTime(item.created_at)}</Text>
                  </View>
                  <View style={{ width: "10%", justifyContent: "center", }}>
                    <IconDelete name="delete" size={24}
                      style={{ color: "gray" }} />
                  </View>
                </TouchableOpacity>
              </View>
          }
        />

      </View>
    );
  }
}

