import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from "./ListEventStyle";
import IconDelete from 'react-native-vector-icons/MaterialIcons';
import IconClock from 'react-native-vector-icons/Entypo';
import IconLocation from 'react-native-vector-icons/Entypo';
import { Data } from "../../../api/Data";
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import IconEdit from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import IconDescription from 'react-native-vector-icons/MaterialIcons';

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
    const uid = this.props.uid;
    await events.orderByChild("groupId").equalTo(groupId).on('child_added', (snapshot) => {
      let data = snapshot.val();
      if (uid === snapshot.val().createdByUserId) {
        items.push({
          id: snapshot.key,
          name: data.name,
          address: data.address,
          description: data.description,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          time: data.time,
          isDelete: true,
          location: data.location
        })
      } else {
        items.push({
          id: snapshot.key,
          name: data.name,
          address: data.address,
          description: data.description,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          time: data.time,
          isDelete: false,
          location: data.location
        })
      }
      this.setState({ items: items.sort(this.compare) });
    });

    events.orderByChild("groupId").equalTo(groupId).on("child_removed", (snapshot) => {
      var items = this.state.items;
      var arr = [];

      items.map(item => {
        if (item.id !== snapshot.key) {
          arr.push({
            id: item.id,
            name: item.name,
            address: item.address,
            description: item.description,
            userId: item.createdByUserId,
            created_at: item.created_at,
            groupId: item.groupId,
            time: item.time,
            isDelete: item.isDelete,
            location: item.location
          })
          this.setState({ items: arr })
        } else {
          this.setState({ items: arr })
        }
      })
    });
  }

  componentWillReceiveProps() {
    var items = [];
    const groupId = this.props.groupId;
    const uid = this.props.uid;
    events.orderByChild("groupId").equalTo(groupId).on("child_added", (snapshot) => {
      let data = snapshot.val();
      if (uid === snapshot.val().createdByUserId) {
        items.push({
          id: snapshot.key,
          name: data.name,
          address: data.address,
          description: data.description,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          time: data.time,
          isDelete: true,
          location: data.location
        })
      } else {
        items.push({
          id: snapshot.key,
          name: data.name,
          address: data.address,
          description: data.description,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          time: data.time,
          isDelete: false,
          location: data.location
        })
      }
      this.setState({ items: items.sort(this.compare) });
    });

    events.orderByChild("groupId").equalTo(groupId).on("child_removed", (snapshot) => {
      var items = this.state.items;
      var arr = [];

      items.map(item => {
        if (item.id !== snapshot.key) {
          arr.push({
            id: item.id,
            name: item.name,
            address: item.address,
            description: item.description,
            userId: item.createdByUserId,
            created_at: item.created_at,
            groupId: item.groupId,
            time: item.time,
            isDelete: item.isDelete,
            location: item.location
          })
          this.setState({ items: arr })
        } else {
          this.setState({ items: arr })
        }
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

  getTime = (time) => {
    var a = new Date(time.replace(/-/g, '/')).getTime();
    var b = new Date().getTime();
    if (a > b) {
      var phut = (a - b) / 1000 / 60;
      if (phut >= 60) {
        var gio = phut / 60;
        if (gio >= 24) {
          var ngay = gio / 24;
          return "Còn " + Math.round(ngay) + " ngày";
        } else {
          return "Còn " + Math.round(gio) + " giờ";
        }
      } else {
        return "Còn" + Math.round(phut) + "phút";
      }
    } else {
      return "Kế hoạch đã kết thúc"
    }
  }

  hanldeDelete = (id) => {
    Alert.alert(
      'Thông báo',
      'Bạn chắc chắn muốn xoá kế hoạch này',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            events.child(id).remove();
          }
        },
      ],
      { cancelable: false },
    );
  }

  handleEdit = () => {

  }

  render() {
    const { navigate } = { ...this.props };
    const { items } = this.state;
    const uid = this.props.uid;
    const leaderId = this.props.leaderId;
    const userName = this.props.userName;
    const groupName = this.props.groupName;
    return (
      <View style={styles.container}>
        {(items.length > 0) ?
          <ScrollView>
            <FlatList
              data={items}
              extraData={this.state.items}
              renderItem={
                ({ item }) =>
                  <View style={styles.itemStyle}>
                    <View style={styles.item} >
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

                      <TouchableOpacity style={styles.info}
                        onPress={() =>this.props.handleClickEvent(item)}>
                        {/* onPress={() => navigate("DetailEvent", { id: item.id , uid: uid})} */}
                        <Text style={styles.textName} numberOfLines={2}>{item.name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <IconDescription name="description" size={14} style={{ marginRight: 8 }} />
                          <Text style={styles.textView} numberOfLines={2}>{item.description}</Text>
                        </View>
                        <View style={{ flexDirection: "row", paddingTop: 6, paddingBottom: 3 }}>
                          <IconClock name="clock" size={14} style={{ marginRight: 8 }} />
                          <Text style={styles.textView}>{(item.time).substr(11, (item.time).length)}</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "90%", paddingTop: 3, paddingBottom: 3 }}>
                          <IconLocation name="location-pin" size={14} style={{ marginRight: 8 }} />
                          <View>
                            <Text style={styles.textView} numberOfLines={2}>{item.address}</Text>
                          </View>
                        </View>
                        <Text style={styles.textView}>{this.getTime(item.time)}</Text>
                      </TouchableOpacity>

                      {(uid === leaderId) &&
                        <View style={{ flexDirection: "column" }}>
                          <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}
                            onPress={() => this.hanldeDelete(item.id)}>
                            <IconDelete name="delete" size={24}
                              style={{ color: "gray" }}
                            />
                          </TouchableOpacity >
                          <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}
                            onPress={() => {
                              navigate('EditEvent', {
                                "name": item.name,
                                "description": item.description,
                                "time": item.time,
                                "address": item.address,
                                "id": item.id,
                                "groupId": item.groupId
                              });
                            }}>
                            <IconEdit name="edit"
                              style={{ fontSize: 24, color: "gray" }}
                            />
                          </TouchableOpacity>
                        </View>
                      }
                    </View>
                  </View>
              }
            />
            <View style={{ height: 100 }}></View>
          </ScrollView>
          :
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 170 }}>
            <Text style={{ fontSize: 20 }}>Nhóm chưa có kế hoạch nào</Text>
            {(uid === leaderId) &&
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Chọn nút  </Text>
                <IconAdd name="add-circle" size={25} style={{ color: "#006805" }} />
                <Text>  để tạo kế hoạch</Text>
              </View>
            }
          </View>

        }
      </View>
    );
  }
}

