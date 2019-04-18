import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, } from 'react-native';
import styles from './MyGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconNotifi from 'react-native-vector-icons/Ionicons';
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";
import { ProgressDialog } from 'react-native-simple-dialogs';

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

  watchID: ?number = null;

  componentDidMount() {
    var items = [];
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
      (error) => alert(JSON.stringify(error)),
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
            Data.ref("messages")
              .orderByChild("groupId")
              .equalTo(snapshot.key)
              .limitToLast(1)
              .on("child_added", (snapshot) => {
                console.log(snapshot.val().timestamp);
                // this.setState({
                //   message: snapshot.val().text,
                // })
              });
            items.push({
              id: snapshot.key,
              name: data.name,
              chedule: data.schedule,
              userId: data.createdByUserId,
              created_at: data.created_at,
              avatar: data.avatar,
              // message: message
            })
            this.setState({ items: items });
          }
        });
        this.setState({
          progressVisible: false
        })
        console.log("1111111")
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
    const { items, searchTerm, searchAttribute, ignoreCase } = this.state;
    var uid = this.props.navigation.state.params.uid;
    

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={{ height: 39, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <View style={{ flex: 8, alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>Nhóm của tôi</Text>
            </View>
            <IconNotifi name="ios-notifications"
              style={{ fontSize: 24, flex: 1, color: "#007aff" }}
            />
            <IconUser name="user-circle"
              style={{ fontSize: 24, flex: 1, color: "#007aff" }}
              onPress={() => navigate("UserInfo", {
                "email": this.props.navigation.state.params.email,
                "userId": this.state.userId
              })}
            />
          </View>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
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
          <SearchableFlatList
            data={items}
            searchTerm={searchTerm}
            ignoreCase={ignoreCase}
            searchAttribute={searchAttribute}
            renderItem={
              ({ item }) => <View style={{ flexDirection: "column", paddingTop: 10 }}>
                <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >
                  {(item.avatar === "") ?
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                    />
                    :
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: item.avatar }}
                    />
                  }
                  <View style={{ paddingLeft: 20, paddingTop: 7 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
                    <Text style={{ fontSize: 14 }}>{item.created_at}</Text>
                  </View>
                </TouchableOpacity>
                <View ></View>
              </View>
            }
            keyExtractor={item => item.id}
          />
        </ScrollView>

        <TouchableOpacity
          style={{ zIndex: 1000, bottom: 60, justifyContent: 'flex-end', marginLeft: "80%", position: 'absolute' }}
          onPress={() => navigate("CreatGroup", { uid: uid })}>
          <IconAdd name="add-circle" size={60} style={{ color: "green" }} />
        </TouchableOpacity>
      </View>
    );
  }
}