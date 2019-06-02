import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, StatusBar, } from 'react-native';
import styles from './MyGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import IconDescription from 'react-native-vector-icons/MaterialIcons';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconDiamond from 'react-native-vector-icons/FontAwesome';
import IconNotifi from 'react-native-vector-icons/Ionicons';
import IconHome from "react-native-vector-icons/Entypo";
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";
import { ProgressDialog } from 'react-native-simple-dialogs';
import IconClock from 'react-native-vector-icons/Entypo';
import FCM from 'react-native-fcm';
import firebase from 'react-native-firebase';
import Tabbar from 'react-native-tabbar-bottom';
import SearchScreen from "../../search/SearchScreen";
import UserInfo from "../../group//UserInfo";
import Notification from "../../group/Notification";
import Home from "../../group/Home";


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
      page: "HomeScreen",
    }
  }

  componentDidMount() {
      this.setState({
        page: this.props.navigation.state.params.page ? this.props.navigation.state.params.page : "HomeScreen"
    })
  }
  componentWillReceiveProps (){
    this.setState({
      page: this.props.navigation.state.params.page ? this.props.navigation.state.params.page : "HomeScreen"
  })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#003c00" barStyle="light-content" />

        {(this.state.page === "HomeScreen") &&
          <Home
            navigation={this.props.navigation}
            email={this.props.navigation.state.params.email}
            user_id={this.props.navigation.state.params.user_id}
          />
        }
        {this.state.page === "NotificationScreen" &&
          <Notification
            navigation={this.props.navigation}
            user_id={this.props.navigation.state.params.user_id}
            email={this.props.navigation.state.params.email}
          />
        }
        {this.state.page === "ProfileScreen" &&
          <UserInfo
            navigation={this.props.navigation}
            email={this.props.navigation.state.params.email}
            userId={this.state.userId}
          />
        }
        {this.state.page === "SearchScreen" &&
          <SearchScreen
            navigation={this.props.navigation}
            userLocation={this.state.userLocation}
          />
        }
        {/* <View style={{width:"100%", borderTopWidth: 1,}}> */}
        <Tabbar
          stateFunc={(tab) => {
            this.setState({ page: tab.page })
            //this.props.navigation.setParams({tabTitle: tab.title})
          }}
          tabbarBgColor="#ffffff"
          iconColor="#bcbcbc"
          lableColor="#bcbcbc"
          selectedLabelColor="#008605"
          selectedIconColor="#008605"
          tabbarBorderTopColor="#bcbcbc"
          activePage={this.state.page}
          tabs={[
            {
              page: "HomeScreen",
              icon: "home",
              iconText:"Nhóm của tôi"
            },
            {
              page: "SearchScreen",
              icon: "search",
              iconText:"Tìm kiếm"
            },
            {
              page: "NotificationScreen",
              icon: "notifications",
              badgeNumber: 11,
              iconText:"Thông báo"
            },
            {
              page: "ProfileScreen",
              icon: "person",
              iconText:"Tôi"
            }, 
          ]}
        />
      </View>

      // </View>
    );
  }
}