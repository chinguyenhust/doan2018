import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, Alert, Dimensions } from 'react-native';
import styles from './ChangePassWordStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import { required, phone, password, Email } from '../../../util/validate'
import { Data } from "../../../api/Data";
import firebase from 'react-native-firebase';

export default class ChangePassWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: "",
      newPass: "",
      confirm: "",
    }
  }

  componentDidMount() {
    // var email = this.props.navigation.state.params.email;
    // Data.ref("users").orderByChild("email").equalTo(email).on("child_added", (snapshot) => {
    //   var data = snapshot.val();
    //   console.log(data)
    //   this.setState({
    //     name: data.userName,
    //     email: data.email,
    //     phone: data.phone,
    //     avatar: data.avatar,
    //   })
    // })
  }

  _handleChangeOldPass = (text) => {
    this.setState({
      oldPass: text,
    })
  }

  _handleChangeNewPass = (text) => {
    this.setState({
      newPass: text,
    })
  }


  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
        user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }
  

  changePassword = (currentPassword, newPassword) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updatePassword(newPassword).then(() => {
        Alert.alert(
          'Thông báo',
          'Thay đổi mật khẩu thành công',
          [
            { text: 'OK', onPress: () => {
              this.props.navigation.navigate('MyGroup')
            } },
          ],
          { cancelable: false },
        );
      }).catch((error) => { 
        console.log(error); 
      });
    }).catch((error) => { 
      console.log(error);
      Alert.alert(
        'Thông báo',
        'Mật khẩu cũ không đúng',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      ); 
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ height: 56, flexDirection: "row", alignItems: "center", backgroundColor: "#006805", paddingLeft: 20 }}>

            <Icon name="ios-arrow-round-back" size={34}
              style={{ width: "10%", color: "#ffffff" }}
              onPress={() => { this.props.navigation.goBack() }}
            />

            <View style={{ width: "90%" }}>
              <Text style={{ fontSize: 20, color: "#ffffff", fontWeight: "500" }}>Thay đổi mật khẩu</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 30, flexDirection: "column", }}>

          <View style={styles.info}>
            <View style={styles.item}>
              <View style={{ flex: 4 }}>
                <Text style={styles.txt}>Mật khẩu cũ</Text>
              </View>
              <View style={{ flex: 6 }}>
                <TextInput style={styles.txt}
                  placeholder="Nhập mật khẩu cũ"
                  secureTextEntry
                  value={this.state.oldPass}
                  onChangeText={this._handleChangeOldPass}
                >
                </TextInput>
              </View>
            </View>
            <View style={styles.line}></View>

            <View style={styles.item}>
              <View style={{ flex: 4 }}>
                <Text style={styles.txt}>Mật khẩu mới</Text>
              </View>
              <View style={{ flex: 6 }}>
                <TextInput style={styles.txt}
                  placeholder="Nhập mật khẩu mới"
                  secureTextEntry
                  value={this.state.newPass}
                  onChangeText={this._handleChangeNewPass}
                >
                </TextInput>
              </View>
            </View>


          </View>

          <TouchableOpacity style={styles.button} onPress={()=>{this.changePassword(this.state.oldPass, this.state.newPass)}}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Lưu</Text>
          </TouchableOpacity>


        </View>

      </View>
    );
  }
}