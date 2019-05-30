import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, StatusBar, } from 'react-native';
import styles from './HomeStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import IconDescription from 'react-native-vector-icons/MaterialIcons';
import IconDiamond from 'react-native-vector-icons/FontAwesome';
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";
import { ProgressDialog } from 'react-native-simple-dialogs';
import IconClock from 'react-native-vector-icons/Entypo';
import FCM from 'react-native-fcm';
import firebase from 'react-native-firebase';

const { width, height } = Dimensions.get('window')
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATTITUDE_DETA = 0.0922;
const LONGTITUDE_DETA = LATTITUDE_DETA * ASPECT_RATIO;

let groups = Data.ref('/groups');
let group_user = Data.ref('/group_users');
let users = Data.ref('users');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      searchAttribute: "name",
      ignoreCase: true,
      items: [],
      groupDone: [],
      groupActive: [],
      groupFuture: [],
      user: null,
      userName: "",
      userId: "",
      initialPosition: {
        latitude: 21.026339,
        longitude: 105.832758,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markerPosition: {
        latitude: 0,
        longtitude: 0
      },
      progressVisible: true,
      countNotifi: 0,
      userLocation: {
        latitude: 0,
        longtitude: 0
      },
      page: "HomeScreen",
    }
  }

  _handleClickItem = (name, groupId) => {
      var navigation = this.props.navigation
    navigation.navigate('DetailGroup', {
      name: name,
      groupId: groupId,
      uid: this.props.user_id,
      userName: this.state.userName,
    })
  }

  toDate = (dateStr) => {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0])
  }

  watchID: ?number = null;

  async componentDidMount() {
    var items = [];
    var groupActive = [];
    var groupDone = [];
    var groupFuture = [];
    var email = this.props.email;
    var user_id = this.props.user_id;
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);

      var initalRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATTITUDE_DETA,
        longitudeDelta: LONGTITUDE_DETA,
      }

      this.setState({ initialPosition: initalRegion });
      this.setState({ markerPosition: initalRegion });
    },
      (error) => alert(JSON.stringify(error)),
      // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);

      var userLocation = {
        latitude: lat,
        longitude: long
      }
      this.setState({
        userLocation: userLocation
      })

      users.orderByChild("email").equalTo(email).on("child_added", (snapshot) => {
        users.child(snapshot.key).update({
          latitude: lat,
          longitude: long
        })
      })

      var lastRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATTITUDE_DETA,
        longitudeDelta: LONGTITUDE_DETA
      }
      this.setState({ initialPosition: lastRegion });
      this.setState({ markerPosition: lastRegion });

    })

    users.orderByChild("email").equalTo(email).on("child_added", (snapshot) => {
      this.setState({
        userName: snapshot.val().userName,
        userId: snapshot.key
      });
      group_user.orderByChild("user_id").equalTo(snapshot.key).on("child_added", (snapshot) => {
        var data = snapshot.val();
        groups.on('child_added', (snapshot) => {
          if (snapshot.key === data.group_id) {
            FCM.subscribeToTopic("/topics/" + snapshot.key);
            let data = snapshot.val();
            if ((this.toDate(data.startDate).getTime() > new Date().getTime()) || (new Date().getTime() > (this.toDate(data.untilDate).getTime()))) {
              Data.ref("groups").child(snapshot.key).update(
                {
                  isOnMap: false,
                }
              ).then(() => {
                // console.log("Success !");
              }).catch((error) => {
                console.log(error);
              });
            }
            if ((this.toDate(data.untilDate)).getTime() < new Date().getTime()) {
              groupDone.push({
                id: snapshot.key,
                name: data.name,
                chedule: data.schedule,
                description: data.description,
                startDate: data.startDate,
                untilDate: data.untilDate,
                userId: data.createdByUserId,
                created_at: data.created_at,
                avatar: data.avatar,

              })
            } else if ((this.toDate(data.startDate).getTime() < new Date().getTime()) && (new Date().getTime() < (this.toDate(data.untilDate).getTime()))) {
              groupActive.push({
                id: snapshot.key,
                name: data.name,
                chedule: data.schedule,
                description: data.description,
                startDate: data.startDate,
                untilDate: data.untilDate,
                userId: data.createdByUserId,
                created_at: data.created_at,
                avatar: data.avatar,

              })
            } else {
              groupFuture.push({
                id: snapshot.key,
                name: data.name,
                chedule: data.schedule,
                description: data.description,
                startDate: data.startDate,
                untilDate: data.untilDate,
                userId: data.createdByUserId,
                created_at: data.created_at,
                avatar: data.avatar,

              })
            }
            this.setState({
              groupDone: groupDone,
              groupActive: groupActive,
              groupFuture: groupFuture
            });
          }
        });
        this.setState({
          progressVisible: false
        })
      });
      this.setState({
        progressVisible: false
      })
    })

    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken', value);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  ////////////////////// Add these methods //////////////////////

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = () => firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);

    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = () => firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);

    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  componentWillReceiveProps() {
    var groupActive = [];
    var groupDone = [];
    var groupFuture = [];
    var email = this.props.email;
    users.orderByChild("email").equalTo(email).on("child_added", (snapshot) => {
      this.setState({
        userName: snapshot.val().userName,
        userId: snapshot.key
      });
      group_user.orderByChild("user_id").equalTo(snapshot.key).on("child_added", (snapshot) => {
        var data = snapshot.val();
        groups.on('child_added', (snapshot) => {
          if (snapshot.key === data.group_id) {
            FCM.subscribeToTopic("/topics/" + snapshot.key);
            let data = snapshot.val();
            if ((this.toDate(data.startDate).getTime() > new Date().getTime()) || (new Date().getTime() > (this.toDate(data.untilDate).getTime()))) {
              Data.ref("groups").child(snapshot.key).update(
                {
                  isOnMap: false,
                }
              ).then(() => {
                // console.log("Success !");
              }).catch((error) => {
                console.log(error);
              });
            }
            if ((this.toDate(data.untilDate)).getTime() < new Date().getTime()) {
              groupDone.push({
                id: snapshot.key,
                name: data.name,
                chedule: data.schedule,
                description: data.description,
                startDate: data.startDate,
                untilDate: data.untilDate,
                userId: data.createdByUserId,
                created_at: data.created_at,
                avatar: data.avatar,

              })
            } else if ((this.toDate(data.startDate).getTime() < new Date().getTime()) && (new Date().getTime() < (this.toDate(data.untilDate).getTime()))) {
              groupActive.push({
                id: snapshot.key,
                name: data.name,
                chedule: data.schedule,
                description: data.description,
                startDate: data.startDate,
                untilDate: data.untilDate,
                userId: data.createdByUserId,
                created_at: data.created_at,
                avatar: data.avatar,

              })
            } else {
              groupFuture.push({
                id: snapshot.key,
                name: data.name,
                chedule: data.schedule,
                description: data.description,
                startDate: data.startDate,
                untilDate: data.untilDate,
                userId: data.createdByUserId,
                created_at: data.created_at,
                avatar: data.avatar,

              })
            }
            this.setState({
              groupDone: groupDone,
              groupActive: groupActive,
              groupFuture: groupFuture
            });
          }
        });
        this.setState({
          progressVisible: false
        })
      });
      this.setState({
        progressVisible: false
      })
    })

    this.checkPermission();
    this.createNotificationListeners();
  }

  render() {
    const { navigate } = this.props.navigation;
    const { groupActive, searchTerm, searchAttribute,
      ignoreCase, groupFuture, groupDone, userLocation } = this.state;
    var uid = this.props.navigation.state.params.user_id;
   
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#003c00" barStyle="light-content" />
        <View style={styles.header}>
          <View style={{ height: 56, flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "#006805", paddingLeft: 20 }}>

            <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#ffffff" }}>Nhóm của tôi</Text>

          </View>
        </View>

        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity style={styles.search}>
            <TextInput style={{ fontSize: 16, width: "84%", }} placeholder="Tìm kiếm"
              onChangeText={searchTerm => this.setState({ searchTerm })}
            ></TextInput>
            <Icon name="ios-search" style={{ fontSize: 24, color: "#a9a9a9", width: "6%", marginTop: 5, }} />
          </TouchableOpacity>
        </View>

        <ProgressDialog
          visible={this.state.progressVisible}
          title="Loading"
          activityIndicatorColor="#008605"
          activityIndicatorSize="large"
          message="Please, wait..."
          activityIndicatorStyle={{ justifyContent: "center" }}
        />

        {(groupActive || groupDone || groupFuture) ?

          <ScrollView style={{}}>
            {(groupActive.length > 0) &&
              <View style={{ paddingLeft: 20, marginTop: 20 }}>
                <Text style={styles.lable}>Nhóm đang diễn ra</Text>
              </View>
            }
            <SearchableFlatList
              data={groupActive}
              searchTerm={searchTerm}
              ignoreCase={ignoreCase}
              searchAttribute={searchAttribute}
              renderItem={
                ({ item }) => <View style={{ flexDirection: "column", }}>
                  <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >

                    <View style={{ flex: 3 }}>
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{ uri: (item.avatar) ? item.avatar : 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                      />
                    </View>

                    <View style={{ flex: 11, paddingTop: 7 }}>
                      <Text style={styles.txtname}>{item.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconDescription name="description" size={14} style={{ marginRight: 10 }} />
                        <Text style={styles.txtDescription} numberOfLines={1}>{item.description}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
                        <Text>{item.startDate} -> {item.untilDate}</Text>
                      </View>
                      {(uid === item.userId) &&
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <IconDiamond name="diamond" size={14} style={{ marginRight: 10, color: "#006805" }} />
                          <Text>Nhóm trưởng</Text>
                        </View>
                      }
                      <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                    </View>
                  </TouchableOpacity>
                  <View ></View>
                </View>
              }
              keyExtractor={item => item.id}
            />
            {(groupFuture.length > 0) &&
              <View>
                <View style={{ height: 5, backgroundColor: "#ebebeb", marginTop: 5 }}></View>
                <View style={{ paddingLeft: 20, marginTop: 20 }}>
                  <Text style={styles.lable}>Nhóm sắp tới</Text>
                </View>
              </View>}
            <SearchableFlatList
              data={groupFuture}
              searchTerm={searchTerm}
              ignoreCase={ignoreCase}
              searchAttribute={searchAttribute}
              renderItem={
                ({ item }) => <View style={{ flexDirection: "column", }}>
                  <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >

                    <View style={{ flex: 3 }}>
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{ uri: (item.avatar) ? item.avatar : 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                      />
                    </View>

                    <View style={{ paddingTop: 7, flex: 11 }}>
                      <Text style={styles.txtname}>{item.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconDescription name="description" size={14} style={{ marginRight: 10 }} />
                        <Text style={styles.txtDescription} numberOfLines={1}>{item.description}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
                        <Text>{item.startDate} -> {item.untilDate}</Text>
                      </View>
                      {(uid === item.userId) &&
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <IconDiamond name="diamond" size={14} style={{ marginRight: 10, color: "#006805" }} />
                          <Text>Nhóm trưởng</Text>
                        </View>
                      }
                      <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                    </View>
                  </TouchableOpacity>
                  <View ></View>
                </View>
              }
              keyExtractor={item => item.id}
            />

            {(groupDone.length > 0) &&
              <View>
                <View style={{ height: 5, backgroundColor: "#ebebeb", marginTop: 5 }}></View>
                <View style={{ paddingLeft: 20, marginTop: 20 }}>
                  <Text style={styles.lable}>Nhóm đã kết thúc</Text>
                </View>
              </View>
            }
            <SearchableFlatList
              data={groupDone}
              searchTerm={searchTerm}
              ignoreCase={ignoreCase}
              searchAttribute={searchAttribute}
              renderItem={
                ({ item }) => <View style={{ flexDirection: "column", }}>
                  <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >

                    <View style={{ flex: 3 }}>
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{ uri: (item.avatar) ? item.avatar : 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                      />
                    </View>

                    <View style={{ flex: 11, paddingTop: 7 }}>
                      <Text style={styles.txtname}>{item.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconDescription name="description" size={14} style={{ marginRight: 10 }} />
                        <Text style={styles.txtDescription} numberOfLines={1}>{item.description}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
                        <Text>{item.startDate} -> {item.untilDate}</Text>
                      </View>
                      {(uid === item.userId) &&
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <IconDiamond name="diamond" size={14} style={{ marginRight: 10, color: "#006805" }} />
                          <Text>Nhóm trưởng</Text>
                        </View>
                      }
                      <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                    </View>
                  </TouchableOpacity>

                </View>
              }
              keyExtractor={item => item.id}
            />

            <View style={{ height: 50 }}></View>
          </ScrollView>
          :
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 170 }}>
            <Text style={{ fontSize: 20 }}>Bạn chưa có nhóm nào</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>Chọn nút  </Text>
              <IconAdd name="add-circle" size={25} style={{ color: "#006805" }} />
              <Text>  để tạo nhóm</Text>
            </View>
          </View>
        }

        <TouchableOpacity
          style={{ zIndex: 1000, bottom: 50, justifyContent: 'flex-end', marginLeft: "80%", position: 'absolute' }}
          onPress={() => navigate("CreatGroup", { uid: uid })}>
          <IconAdd name="add-circle" size={60} style={{ color: "#006805" }} />
        </TouchableOpacity>


      </View>
    );
  }
}