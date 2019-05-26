import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity , Alert} from 'react-native';
import styles from "./ListSurveyStyle";
import IconDelete from 'react-native-vector-icons/MaterialIcons';
import IconNote from 'react-native-vector-icons/Foundation';
import { Data } from "../../../api/Data";
import IconAdd from 'react-native-vector-icons/MaterialIcons';

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
    var phut = (b - a) / 1000 / 60;
    if (phut >= 60) {
      var gio = phut / 60;
      if (gio >= 24) {
        var ngay = gio / 24;
        if (ngay >= 7) {
          tuan = ngay / 7;
          return Math.round(tuan) + " tuan truoc";
        } else {
          return Math.round(ngay) + " ngay truoc";
        }
      } else {
        return Math.round(gio) + " gio truoc";
      }
    } else {
      return Math.round(phut) + "phut truoc";
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
    const { items } = this.state;
    const { navigate } = { ...this.props };
    const uid = this.props.uid;
    const leaderId = this.props.leaderId;

    return (
      <View style={styles.container}>
        {(items.length > 0) ?
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
                      <Text style={styles.textView}>Created: {this.getTime(item.created_at)}</Text>
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

