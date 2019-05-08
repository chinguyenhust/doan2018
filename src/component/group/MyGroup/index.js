import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, StatusBar, } from 'react-native';
import styles from './MyGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconNotifi from 'react-native-vector-icons/Ionicons';
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";
import { ProgressDialog } from 'react-native-simple-dialogs';
import IconClock from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window')
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATTITUDE_DETA = 0.0922;
const LONGTITUDE_DETA = LATTITUDE_DETA * ASPECT_RATIO;

let groups = Data.ref('/groups');
let group_user = Data.ref('/group_users');
let users = Data.ref('users');

export default class MyGroup extends Component {
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
      // message: ""
    }
  }

  _handleClickItem = (name, groupId) => {
    this.props.navigation.navigate('DetailGroup', {
      name: name,
      groupId: groupId,
      userName: this.state.userName,
    })
  }

  toDate = (dateStr) => {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0])
  }

  watchID: ?number = null;

  componentDidMount() {
    var { items, groupActive, groupDone, groupFuture } = this.state;
    var email = this.props.navigation.state.params.email;

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
      // (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);
      // console.log(lat + "    " + long)

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
            let data = snapshot.val();
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
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }



  render() {
    const { navigate } = this.props.navigation;
    const { groupActive, searchTerm, searchAttribute, ignoreCase, groupFuture, groupDone } = this.state;
    var uid = this.props.navigation.state.params.uid;


    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#003c00" barStyle="light-content" />
        <View style={styles.header}>
          <View style={{ height: 56, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#006805" }}>
            <View style={{ flex: 7, alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "600", color: "#ffffff" }}>Nhóm của tôi</Text>
            </View>
            <Icon name="ios-search"
              style={{ fontSize: 24, color: "#ffffff", flex: 1 }}
              onPress={() => navigate("SearchScreen")}
            />
            <IconNotifi name="ios-notifications"
              style={{ fontSize: 24, flex: 1, color: "#ffffff" }}
            />
            <IconUser name="user-circle"
              style={{ fontSize: 24, flex: 1, color: "#ffffff" }}
              onPress={() => navigate("UserInfo", {
                "email": this.props.navigation.state.params.email,
                "userId": this.state.userId
              })}
            />
          </View>
          {/* <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View> */}
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
          activityIndicatorColor="#00ff00"
          activityIndicatorSize="large"
          message="Please, wait..."
          activityIndicatorStyle={{ justifyContent: "center" }}
        />

        <ScrollView style={{}}>
          <View style={{ paddingLeft: 20, marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Nhóm đang diễn ra</Text>
          </View>
          <SearchableFlatList
            data={groupActive}
            searchTerm={searchTerm}
            ignoreCase={ignoreCase}
            searchAttribute={searchAttribute}
            renderItem={
              ({ item }) => <View style={{ flexDirection: "column",  }}>
                <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >
                  {(item.avatar === "") ?
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                    />
                    :
                    <View style={{ flex: 3 }}>
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{ uri: item.avatar }}
                      />
                    </View>
                  }
                  <View style={{ flex: 11, paddingTop: 7 }}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: "#000000" }}>{item.name}</Text>
                    <Text style={{ fontSize: 14 }} numberOfLines={1}>{item.description}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
                      <Text>{item.startDate} -> {item.untilDate}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                  </View>
                </TouchableOpacity>
                <View ></View>
              </View>
            }
            keyExtractor={item => item.id}
          />

          <View style={{ paddingLeft: 20 , marginTop: 20}}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Nhóm sắp tới</Text>
          </View>
          <SearchableFlatList
            data={groupFuture}
            searchTerm={searchTerm}
            ignoreCase={ignoreCase}
            searchAttribute={searchAttribute}
            renderItem={
              ({ item }) => <View style={{ flexDirection: "column", }}>
                <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >
                  {(item.avatar === "") ?
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                    />
                    :
                    <View style={{ flex: 3 }}>
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{ uri: item.avatar }}
                      />
                    </View>
                  }
                  <View style={{ paddingTop: 7, flex: 11 }}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: "#000000" }}>{item.name}</Text>
                    <Text style={{ fontSize: 14 }} numberOfLines={1}>{item.description}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
                      <Text>{item.startDate} -> {item.untilDate}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                  </View>
                </TouchableOpacity>
                <View ></View>
              </View>
            }
            keyExtractor={item => item.id}
          />

          <View style={{ paddingLeft: 20,marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Nhóm đã kết thúc</Text>
          </View>
          <SearchableFlatList
            data={groupDone}
            searchTerm={searchTerm}
            ignoreCase={ignoreCase}
            searchAttribute={searchAttribute}
            renderItem={
              ({ item }) => <View style={{ flexDirection: "column",}}>
                <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >
                  {(item.avatar === "") ?
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                    />
                    :
                    <View style={{ flex: 3 }}>
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{ uri: item.avatar }}
                      />
                    </View>
                  }
                  <View style={{ flex: 11, paddingTop: 7 }}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: "#000000" }}>{item.name}</Text>
                    <Text style={{ fontSize: 14 }} numberOfLines={1}>{item.description}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
                      <Text>{item.startDate} -> {item.untilDate}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: "#bcbcbc", marginTop: 5 }}></View>
                  </View>
                </TouchableOpacity>
                <View ></View>
              </View>
            }
            keyExtractor={item => item.id}
          />


        </ScrollView>

        <TouchableOpacity
          style={{ zIndex: 1000, bottom: 30, justifyContent: 'flex-end', marginLeft: "80%", position: 'absolute' }}
          onPress={() => navigate("CreatGroup", { uid: uid })}>
          <IconAdd name="add-circle" size={60} style={{ color: "#006805" }} />
        </TouchableOpacity>
      </View>
    );
  }
}