import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, FlatList, Switch } from 'react-native';
import styles from './InfoGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconDropDown from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import MultiSelect from '../../home/MultiSelect';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';
import ImageResizer from 'react-native-image-resizer';

let users = Data.ref('/users');

export default class InfoGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isLoad: false,
      schedule: "",
      description: "",
      startDate: "",
      untilDate: "",
      selectedItems: [],
      items: [],
      created_at: "",
      avatar: null,
      image: null,
      leader_name: "",
      leader_sdt: "",
      isDropDown: false,
      enableScrollViewScroll: true,
      isOn: false,
      isSchedule: true,
      isSwitch: false,
    };
    this.uploadImage = this.uploadImage.bind(this);
  }

  componentWillMount() {
    var items = [];
    const groupId = this.props.navigation.state.params.groupId;
    const uid = this.props.navigation.state.params.uid;
    var userGroup = Data.ref("group_users")
      .orderByChild("group_id")
      .equalTo(groupId)
      .on("child_added", (snapshot) => {
        users.orderByKey().equalTo(snapshot.val().user_id).on("child_added", (snapshot) => {
          let data = snapshot.val();
          // if (uid === snapshot.key) {
          //   this.setState({
          //     leader_name: data.userName,
          //     leader_sdt: data.phone,
          //     isSwitch: true,
          //   });
          // }
          items.push({
            id: snapshot.key,
            name: data.userName,
            phone: data.phone,
            avatar: data.avatar
          })
          this.setState({ items: items });
        })
      });

    Data.ref("groups").child(groupId).on("child_added", (snapshot) => {
      var data = snapshot.val();
      this.setState({
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        untilDate: data.untilDate,
        schedule: data.schedule,
        avatar: data.avatar,
        leaderId: data.createdByUserId
      })
    })
  }

  componentDidMount() {
    const groupId = this.props.navigation.state.params.groupId;
    const uid = this.props.navigation.state.params.uid;
    Data.ref("groups").child(groupId).on("value", (snapshot) => {
      var data = snapshot.val();
      // console.log(data);
      // console.log(snapshot.val().createdByUserId)
      if (uid === snapshot.val().createdByUserId) {
        this.setState({
          isSwitch: true
        })
      }
      users.orderByKey().equalTo(snapshot.val().createdByUserId).on("child_added", (snap) => {
        this.setState({
          leader_name: snap.val().userName,
          leader_sdt: snap.val().phone
        })
      })
      this.setState({
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        untilDate: data.untilDate,
        schedule: data.schedule,
        avatar: data.avatar
      })
    })
  }

  _handleEdit = () => {
    const groupId = this.props.navigation.state.params.groupId;
    var { name, schedule, image, selectedItems } = this.state;
    var user = firebase.auth().currentUser;
    Data.ref("groups").child(groupId).update(
      {
        name: name,
        schedule: schedule,
        avatar: image,
        // members: selectedItems,
        created_update: firebase.database.ServerValue.TIMESTAMP,
        userUpdate: user.uid
      }
    ).then(() => {
      console.log("Success !");
    }).catch((error) => {
      console.log(error);
    });
    this.props.navigation.navigate("DetailGroup", { name: name })
  }

  uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref('avatar').child(new Date().getTime() + "");
      const task = ref.put(blob);

      task.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        // Handle unsuccessful uploads
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          this.setState({
            image: downloadURL,
          })
        }).bind(this);
      });
    } catch (err) {
      console.log('uploadImage error: ' + err.message);
    }
  }

  chooseFile = async () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response.uri;
        ImageResizer.createResizedImage(response.uri, 500, 500, "JPEG", 50)
          .then((response) => {
            this.uploadImage(response.uri);
          })
          .catch(err => {
            console.log(err);
          });
        this.setState({
          avatar: source,
          isLoad: true,
        });
      }
    });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  handleDropDown = () => {
    this.setState({
      isDropDown: !this.state.isDropDown
    })
  }

  handleClickSchedule = () => {
    this.setState({
      isSchedule: !this.state.isSchedule
    })
  }

  onEnableScroll = (value) => {
    this.setState({
      enableScrollViewScroll: value,
    });
    
  };

  handleToggle = () => {
    this.setState({
      isOn: !this.state.isOn
    })
    const groupId = this.props.navigation.state.params.groupId;
    Data.ref("groups").child(groupId).update(
      {
        isOnMap: !this.state.isOn,
      }
    ).then(() => {
      console.log("Success !");
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { selectedItems, items, avatar, name, schedule, isSwitch,
      description, startDate, untilDate, leader_name, leader_sdt } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={{ height: 56, flexDirection: "row", paddingLeft: 20, backgroundColor: "#006805", alignItems: "center" }}>
          <Icon name="ios-arrow-round-back" size={34}
            style={{ width: "15%", color: "#ffffff" }} onPress={() => { this.props.navigation.goBack() }} />

        </View>

        <ScrollView
          style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 40 }}
        // scrollEnabled={this.state.enableScrollViewScroll}
        >
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.chooseFile.bind(this)}>
            {(avatar === null) ?
              <IconAdd name="add-circle" size={120} style={{ color: "gray" }} /> :
              <Image
                source={{ uri: avatar }}
                style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
              />
            }
          </TouchableOpacity>

          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#000000" }} numberOfLines={1}>{name}</Text>
            <Text style={{ fontSize: 16 }}>{description}</Text>
          </View>

          <View style={styles.time}>
            <View style={{ height: 30, justifyContent: "center", }}>
              <Text style={{ color: "#000000", fontSize: 16, fontWeight: "600" }}>Thời gian </Text>
            </View>
            <View style={{ height: 30, justifyContent: "center", }}>
              <Text style={{ fontSize: 14 }}>Từ {startDate} đến {untilDate}</Text>
            </View>
          </View>

          <View style={styles.schedule}>
            <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }} >
              <View style={{ flex: 10 }}>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: "600" }}>Lịch trình </Text>
              </View>
              <TouchableOpacity style={{ flex: 1, alignItems: "center", }} onPress={this.handleClickSchedule}>
                <IconDropDown name="md-arrow-dropdown" size={24}
                  style={{ color: "#000000", }}
                />
              </TouchableOpacity>
            </View>
            {(this.state.isSchedule) &&
              <View style={{}}>
                <Text style={{ fontSize: 14 }}>{schedule}</Text>
              </View>
            }
          </View>

          <View style={styles.time}>
            <View style={{ height: 30, justifyContent: "center", }}>
              <Text style={{ color: "#000000", fontSize: 16, fontWeight: "600" }}>Nhóm trưởng</Text>
            </View>
            <View style={{ height: 30, justifyContent: "center", }}>
              <Text style={{ fontSize: 14 }}>{leader_name} ({leader_sdt})</Text>
            </View>
          </View>

          <View style={styles.schedule}>
            <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }} >
              <View style={{ flex: 10 }}>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: "600" }}>Thành viên </Text>
              </View>
              <TouchableOpacity style={{ flex: 1, alignItems: "center", }} onPress={this.handleDropDown}>
                <IconDropDown name="md-arrow-dropdown" size={24}
                  style={{ color: "#000000", }}
                />
              </TouchableOpacity>
            </View>
            {(this.state.isDropDown) &&
              <View style={{ height: 200 }}>
                <FlatList
                  data={items}
                  // onTouchStart={() => {
                  //   this.onEnableScroll(false);
                  // }}
                  // onMomentumScrollEnd={() => {
                  //   this.onEnableScroll(true);
                  // }}
                  renderItem={
                    ({ item }) =>
                      <View style={{ flexDirection: 'row', }}>
                        <View style={{ flex: 9, flexDirection: 'row', height: 55 }}>
                          <Image
                            style={{ width: 40, height: 40, borderRadius: 20, marginTop: 8 }}
                            source={{ uri: (item.avatar) ? item.avatar : 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                          />
                          <View style={{ flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                            <Text>
                              {item.name}
                            </Text>
                            <Text>{item.phone}</Text>
                          </View>
                        </View>
                      </View>
                  }
                />
              </View>
            }
          </View>
          {(isSwitch) &&
            <View style={styles.schedule}>
              <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }} >
                <View style={{ flex: 4 }}>
                  <Text style={{ color: "#000000", fontSize: 16, fontWeight: "600" }}>Bật định vị nhóm </Text>
                </View>

                <View style={{ flex: 1, alignItems: "center", }} >
                  <Switch
                    thumbColor="#006805"
                    onValueChange={this.handleToggle}
                    value={this.state.isOn} />
                </View>
              </View>
            </View>
          }

        </ScrollView>
      </View>
    );
  }
}
