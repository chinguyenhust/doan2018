import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import styles from './EditUserStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMail from 'react-native-vector-icons/Ionicons';
import IconEdit from 'react-native-vector-icons/MaterialIcons';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconPhone from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase';
import ImageResizer from 'react-native-image-resizer';
import { Data } from "../../../api/Data";

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      phone: this.props.navigation.state.params.phone,
      avatar: this.props.navigation.state.params.avatar,
      image: ""
    }
  }

  uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref('avatar').child(new Date().getTime() + "");
      const task = ref.put(blob);

      task.on('state_changed', (snapshot) => {

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

  _handleUpDate = () => {
    const { name, phone, avatar, email, image } = this.state;
    const userId = this.props.navigation.state.params.userId;
    console.log(userId)
    var user = Data.ref("users");
    user.child(userId).update({
      userName: name,
      phone: phone,
      avatar: image,
      email: email,
    });
    this.props.navigation.navigate('MyGroup');
  }

  render() {
    const { name, phone, avatar, email } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34}
              style={{ width: "15%", paddingLeft: 20, color: "#ffffff" }}
              onPress={() => { this.props.navigation.goBack() }}
            />
            <View style={{ alignItems: "center", width: "85%" }}>
              <Text style={{ fontSize: 20, color: "#ffffff", fontWeight: "600" }}>Chỉnh sửa thông tin</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 20, flexDirection: "column" }}>
          <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
            onPress={this.chooseFile.bind(this)}>
            {(!avatar) ?
              <IconUser name="user-circle" size={120} style={{ color: "#bcbcbc" }} /> :
              <Image
                source={{ uri: avatar }}
                style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
              />
            }
          </TouchableOpacity>
          <View style={styles.info}>
            <View style={styles.item}>
              <IconUser name="user-circle" size={24} style={{ color: "#006805", flex: 2 }} />
              <View style={{ flex: 10 }}>
                <TextInput
                  //   style={styles.inputName}
                  onChangeText={(name) => {
                    this.setState({ name: name });
                  }}
                  value={this.state.name}
                />
              </View>
            </View>
            <View style={styles.line}></View>

            <View style={styles.item}>
              <IconPhone name="phone" size={24} style={{ color: "#006805", flex: 2 }} />
              <View style={{ flex: 10 }}>
                <TextInput
                  //   style={styles.inputName}
                  onChangeText={(phone) => {
                    this.setState({ phone });
                  }}
                  value={this.state.phone}
                />
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

          <TouchableOpacity style={styles.button} onPress={this._handleUpDate}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Cập nhật</Text>
          </TouchableOpacity>


        </View>

      </View>
    );
  }
}