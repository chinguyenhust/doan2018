import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from "./ListEventStyle";
import IconDelete from 'react-native-vector-icons/MaterialIcons';
import IconClock from 'react-native-vector-icons/EvilIcons';
import IconLocation from 'react-native-vector-icons/EvilIcons';
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
        description: data.description,
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

  getTime = (time) => {
    var a = new Date(time.replace(/-/g, '/')).getTime();
    var b = new Date().getTime();
    if(a>b){
      var phut = (a-b)/1000/60;
      if(phut>=60){
        var gio = phut/60;
        if(gio >=24){
          var ngay = gio/24;
          return "Con " + Math.round(ngay)+ " ngay";
        }else{
          return  "Con " + Math.round(gio) + " gio";
        }
      }else{
        return  "Con" + Math.round(phut) + "phut";
      }
    }else{
      return "Ke hoach da ket thuc"
    }
  }

  render() {
    const { navigate } = { ...this.props };
    const { items } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={
            ({ item }) =>
              <View style={styles.itemStyle}>
                <TouchableOpacity style={styles.item} onPress={() => navigate("DetailEvent", { id: item.id })}>
                  <View style={{ flexDirection: "column", justifyContent: "center" }}>
                    <View style={styles.calendar}>
                      <View style={styles.year}>
                        <Text style={{ color: '#000', fontWeight: "500" }}>{new Date((item.time).replace(/-/g, '/')).getFullYear()}</Text>
                      </View>
                      <View style={styles.day}>
                        <Text>{new Date((item.time).replace(/-/g, '/')).getDate()}</Text>
                        <View style={styles.line}></View>
                      </View>
                      <View style={styles.month}>
                        <Text>{(new Date((item.time).replace(/-/g, '/')).getMonth() + 1)}</Text>
                      </View>
                    </View>
                    {(new Date((item.time).replace(/-/g, '/')).getTime()) > new Date().getTime() ?
                    <Text style={{ fontSize: 16, color: "green", fontWeight: "600", marginTop: 20 }}>ACTIVE</Text> :
                    <Text style={{ fontSize: 16, color: "red", fontWeight: "600", marginTop: 20 }}>FINISH</Text>
                    }
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.textName}>{item.name}</Text>
                    <Text style={styles.textView}>{item.description}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <IconClock name="clock" size={20} style={{ color: "#007aff", marginRight:8}} />
                      <Text style={styles.textView}>{(item.time).substr(11, (item.time).length)}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <IconLocation name="location" size={20} style={{ color: "#007aff", marginRight:8 }} />
                      <Text style={styles.textView}>{item.address}</Text>
                    </View>
                    <Text style={styles.textView}>{this.getTime(item.time)}</Text>
                  </View>
              
                  <View style={{ width: "10%", justifyContent: "center", }}>
                    <IconDelete name="delete" size={24}
                      style={{ color: "gray"}} />
                  </View>
                </TouchableOpacity>
              </View>
          }
        />
      </View>
    );
  }
}

