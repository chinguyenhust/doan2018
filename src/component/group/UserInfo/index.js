import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions } from 'react-native';
import styles from './UserInfoStyle';
import IconMail from 'react-native-vector-icons/Ionicons';
import IconEdit from 'react-native-vector-icons/MaterialIcons';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconPhone from 'react-native-vector-icons/FontAwesome5';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';
import FCM from 'react-native-fcm';
import { Dialog } from 'react-native-simple-dialogs';


let group_user = Data.ref('/group_users');

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      avatar: "",
      dialogVisible: false
    }
  }

  componentDidMount() {
    var email = this.props.email;
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
    var uid = this.props.userId;
    var navigation = this.props.navigation;
    firebase.auth().signOut().then(() => {
      navigation.navigate('Login');
    }).catch((error) => {
      alert("Đã có lỗi xảy ra trong quá trình logout. Xin thử lại")
    });
    group_user.orderByChild("user_id").equalTo(uid).on("child_added", (snapshot) => {
      var data = snapshot.val();
      FCM.unsubscribeFromTopic(data.group_id);
    })
  }

  _handleEdit = () => {
    this.props.navigation.navigate('EditUser', {
      "name": this.state.name,
      "phone": this.state.phone,
      "email": this.state.email,
      "avatar": this.state.avatar,
      "userId": this.props.userId
    });
  }

  handleImage = () => {
    this.setState({
      dialogVisible: true
    })
  }

  render() {
    const { name, phone, avatar, email, isHome, isNoti, isSearch, isUser } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ height: 56, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#006805" }}>

            <View style={{ paddingLeft: 25, width: "85%" }}>
              <Text style={{ fontSize: 20, color: "#ffffff", fontWeight: "600" }}>Thông tin tài khoản</Text>
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

        <ScrollView style={{ paddingTop: 20, flexDirection: "column", }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {(avatar) ?
              <TouchableOpacity onPress={this.handleImage}>
                <Image
                  source={{ uri: avatar }}
                  style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
                />
              </TouchableOpacity> :
              <IconUser name="user-circle" size={120} style={{ color: "#ebebeb", }} />
            }
          </View>

          <Dialog
            visible={this.state.dialogVisible}
            contentStyle={
              {
                alignItems: "center",
                justifyContent: "center",
            }
            }
            onTouchOutside={() => this.setState({ dialogVisible: false })} 
            >
            <Image
              source={{ uri:  avatar }}
              style={{ width: 250, height: 250 }}
            />
          </Dialog>

          <View style={styles.info}>
            <View style={styles.item}>
              <IconUser name="user-circle" size={24} style={{ color: "#006805", flex: 2 }} />
              <View style={{ flex: 10 }}>
                <Text style={styles.txt}> {name}</Text>
              </View>
            </View>
            <View style={styles.line}></View>

            <View style={styles.item}>
              <IconPhone name="phone" size={24} style={{ color: "#006805", flex: 2 }} />
              <View style={{ flex: 10 }}>
                <Text style={styles.txt}> {phone}</Text>
              </View>
            </View>
            <View style={styles.line}></View>

            <View style={styles.item}>
              <IconMail name="ios-mail" size={24} style={{ color: "#006805", flex: 2 }} />
              <View style={{ flex: 10 }}>
                <Text style={styles.txt}> {email}</Text>
              </View>
            </View>
            {/* <View style={styles.line}></View> */}
          </View>

          <TouchableOpacity style={styles.button} onPress={this._handleLogout}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>


      </View>
    );
  }
}