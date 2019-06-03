import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, StatusBar, } from 'react-native';
import styles from './MyGroupStyle';
import { Data } from "../../../api/Data";
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
      user_id:"",
      sum:0,
      userLocation:""
    }
  }

  componentDidMount() {
    var email = this.props.navigation.state.params.email;
      this.setState({
        page: this.props.navigation.state.params.page ? this.props.navigation.state.params.page : "HomeScreen",
        sum:this.props.navigation.state.params.sum
    })
    users.orderByChild("email").equalTo(email).on("child_added", (snapshot) => {
      this.setState({
        user_id:snapshot.key,
        userLocation:{
          latitude:snapshot.val().latitude,
          longitude: snapshot.val().longitude
        }
      })
    })

  }
  componentWillReceiveProps (){
    this.setState({
      page: this.props.navigation.state.params.page ? this.props.navigation.state.params.page : "HomeScreen",
      sum:this.props.navigation.state.params.sum
  })
  }

  render() {
    console.log(this.state.userLocation)
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#003c00" barStyle="light-content" />

        {(this.state.page === "HomeScreen") &&
          <Home
            navigation={this.props.navigation}
            email={this.props.navigation.state.params.email}
            user_id={this.state.user_id}
          />
        }
        {this.state.page === "NotificationScreen" &&
          <Notification
            navigation={this.props.navigation}
            user_id={this.state.user_id}
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
              badgeNumber: this.state.sum,
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