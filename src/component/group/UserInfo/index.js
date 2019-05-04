import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions } from 'react-native';
import styles from './UserInfoStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMail from 'react-native-vector-icons/Ionicons';
import IconEdit from 'react-native-vector-icons/MaterialIcons';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconPhone from 'react-native-vector-icons/FontAwesome5';
import IconLogOut from 'react-native-vector-icons/AntDesign';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      avatar: null,
    }
  }

  componentDidMount() {
    var email = this.props.navigation.state.params.email;
    Data.ref("users").orderByChild("email").equalTo(email).on("child_added", (snapshot) => {
      var data = snapshot.val();
      console.log(data)
      this.setState({
        name: data.userName,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
      })
    })
  }

  _handleLogout = () => {
    firebase.auth().signOut().then( () => {
      this.props.navigation.navigate('Login');
    }).catch((error) =>{
      alert("Đã có lỗi xảy ra trong quá trình logout. Xin thử lại")
    });
    FCM.unsubscribeFromTopic("test");
  }

  _handleEdit = () => {
    this.props.navigation.navigate('EditUser',{
      "name" : this.state.name,
      "phone": this.state.phone,
      "email": this.state.email,
      "avatar": this.state.avatar,
      "userId": this.props.navigation.state.params.userId
    });
  }

  render() {
    const { name, phone, avatar, email } = this.state;
    console.log(avatar);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ height: 56, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#53ca64"}}>
            <Icon name="ios-arrow-round-back" size={34}
              style={{ width: "15%", paddingLeft: 20, color: "#ffffff"}}
              onPress={() => { this.props.navigation.goBack() }}
            />
            <View style={{ alignItems: "center", width: "70%" }}>
              <Text style={{ fontSize: 20, color: "#ffffff", fontWeight:"600" }}>Thông tin tài khoản</Text>
            </View>
            <View style={{ width: "15%", alignItems: "center" }}>
              <IconEdit name="edit" 
              style={{ fontSize: 24, color: "#ffffff" }} 
              onPress={this._handleEdit}
              />
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: "#bcbcbc", alignSelf: "stretch" }}></View>
        </View>

        <View style={{ paddingTop: 20, flexDirection: "column" }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {(!avatar) ?
              <IconUser name="user-circle" size={150} style={{ color: "#bcbcbc" }} /> :
              <Image
                source={{ uri: avatar }}
                style={{ width: 130, height: 130, borderRadius: 65, marginTop: 10 }}
              />
            }
          </View>
          <View style={styles.item}>
            <IconUser name="user-circle" size={24} style={{ color: "#007aff", flex: 2 }} />
            <View style={{ flex: 8 }}>
              <Text style={{ fontSize: 20, }}> {name}</Text>
            </View>
          </View>
          <View style={styles.line}></View>

          <View style={styles.item}>
            <IconPhone name="phone" size={24} style={{ color: "#007aff", flex: 2 }} />
            <View style={{ flex: 8 }}>
              <Text style={{ fontSize: 20, }}> {phone}</Text>
            </View>
          </View>
          <View style={styles.line}></View>

          <View style={styles.item}>
            <IconMail name="ios-mail" size={24} style={{ color: "#007aff", flex: 2 }} />
            <View style={{ flex: 8 }}>
              <Text style={{ fontSize: 20, }}> {email}</Text>
            </View>
          </View>
          <View style={styles.line}></View>

          <TouchableOpacity style={styles.item} onPress={this._handleLogout}>
            <IconLogOut name="logout" size={24} style={{ color: "#007aff", flex: 2 }} />
            <View style={{ flex: 8 }}>
              <Text style={{ fontSize: 20, }}> Đăng xuất</Text>
            </View>
          </TouchableOpacity>


        </View>

      </View>
    );
  }
}