import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from "./ListSurveyStyle";
import IconDelete from 'react-native-vector-icons/MaterialIcons';
import IconNote from 'react-native-vector-icons/Foundation';
import { Data } from "../../../api/Data";
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';

let surveys = Data.ref('/surveys');

export default class ListSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true
    }
  }

  async componentDidMount() {
    var items = [];
    const groupId = this.props.groupId;
    const uid = this.props.uid;

    await surveys.orderByChild("groupId").equalTo(groupId).on('child_added', (snapshot) => {
      let data = snapshot.val();
      if (uid === snapshot.val().createdByUserId) {
        items.push({
          id: snapshot.key,
          question: data.question,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          options: data.options,
          isDelete: true
        })
      } else {
        items.push({
          id: snapshot.key,
          question: data.question,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          options: data.options,
          isDelete: false
        })
      }
      this.setState({ items: items.sort(this.compare), loading: false });
    });
    this.closeActivityIndicator();
    

    surveys.orderByChild("groupId").equalTo(groupId).on("child_removed", (snapshot) => {
      var items = this.state.items;
      var arr = [];

      items.map(item => {
        if (item.id !== snapshot.key) {
          arr.push({
            id: item.id,
            question: item.question,
            userId: item.createdByUserId,
            created_at: item.created_at,
            groupId: item.groupId,
            options: item.options,
            isDelete: item.isDelete
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
    surveys.orderByChild("groupId").equalTo(groupId).on('child_added', (snapshot) => {
      let data = snapshot.val();
      if (uid === snapshot.val().createdByUserId) {
        items.push({
          id: snapshot.key,
          question: data.question,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          options: data.options,
          isDelete: true
        })
      } else {
        items.push({
          id: snapshot.key,
          question: data.question,
          userId: data.createdByUserId,
          created_at: data.created_at,
          groupId: data.groupId,
          options: data.options,
          isDelete: false
        })
      }
      this.setState({ items: items.sort(this.compare) });
    });

    surveys.orderByChild("groupId").equalTo(groupId).on("child_removed", (snapshot) => {
      var items = this.state.items;
      var arr = [];

      items.map(item => {
        if (item.id !== snapshot.key) {
          arr.push({
            id: item.id,
            question: item.question,
            userId: item.createdByUserId,
            created_at: item.created_at,
            groupId: item.groupId,
            options: item.options,
            isDelete: item.isDelete
          })
          this.setState({ items: arr })
        } else {

          this.setState({ items: arr })
        }
      })
    });
  }

  closeActivityIndicator = () => setTimeout(() => this.setState({
    loading: false }), 500)

  compare = (a, b) => {
    var time1 = new Date(a.created_at).getTime();
    var time2 = new Date(b.created_at).getTime();
    if (time2 < time1)
      return -1;
    if (time2 > time1)
      return 1;
    return 0;
  }

  getDate = (time) => {
    var a = new Date(time);
    var mounth = a.getMonth() + 1;
    var day = a.getDate();
    var hour = a.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }
    var minute = a.getSeconds();
    if (minute < 10) {
      minute = "0" + minute;
    }
    return "Ngày " + day + " tháng " + mounth + " lúc " + hour + ":" + minute;
  }

  getTime = (time) => {
    var a = new Date(time).getTime();
    var b = new Date().getTime();

    var giay = (b - a) / 1000;

    if (0 <= giay && giay < 60) {
      return "Vừa xong"
    } else {
      var phut = Math.round(giay / 60);
      if (0 < phut && phut < 60) {
        return phut + " phút trước"
      }
      else {
        var gio = Math.round(phut / 60);
        if (0 <= gio && gio < 24) {
          return gio + "giờ trước"
        }
        else {
          return this.getDate(time);
        }
      }
    }
  }

  hanldeDelete = (id) => {
    Alert.alert(
      'Thông báo',
      'Bạn chắc chắn muốn xoá khảo sát này',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            surveys.child(id).remove();
          }
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    const { items, loading } = this.state;
    const { navigate } = { ...this.props };
    const uid = this.props.uid;
    const leaderId = this.props.leaderId;

    return (
      (loading) ?
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color="#008605" />
        </View>
        :

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
                        <View style={{ width: "10%", justifyContent: "center", }}>
                          <IconNote name="clipboard-notes" size={30} style={{ color: "red", }} />
                        </View>
                        <TouchableOpacity style={styles.info} onPress={() => navigate("DetailSurvey", { id: item.id, leaderId: leaderId, uid: uid })}>
                          <Text style={styles.textName}>{item.question}</Text>
                          <Text style={styles.textView}>{this.getTime(item.created_at)}</Text>
                        </TouchableOpacity>
                        {(uid === leaderId) &&
                          <View style={{ width: "10%", justifyContent: "center", }}>
                            <IconDelete name="delete" size={24}
                              style={{ color: "gray" }}
                              onPress={() => this.hanldeDelete(item.id)} />
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
              <Text style={{ fontSize: 20 }}>Nhóm chưa có khảo sát nào</Text>
              {(uid === leaderId) &&
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Chọn nút  </Text>
                  <IconAdd name="add-circle" size={25} style={{ color: "#006805" }} />
                  <Text>  để tạo khảo sát</Text>
                </View>
              }
            </View>

          }

        </View>

    );
  }
}

