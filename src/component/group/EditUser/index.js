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

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      phone: this.props.navigation.state.params.phone,
      avatar: this.props.navigation.state.params.avatar,
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
      }, (error) =>{
        // Handle unsuccessful uploads
      }, ()=> {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then((downloadURL) =>{
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
        this.setState({
          avatar: source,
          isLoad: true,
        });
        this.uploadImage(response.uri);
      }
    });
  };

  render() {
    const { name, phone, avatar, email } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34}
              style={{ width: "15%", paddingLeft: 20 }}
              onPress={() => { this.props.navigation.goBack() }}
            />
            <View style={{ alignItems: "center", width: "70%" }}>
              <Text style={{ fontSize: 20 }}>Chỉnh sửa thông tin</Text>
            </View>
            <View style={{ width: "15%", alignItems: "center" }}>
              <IconEdit name="edit" style={{ fontSize: 24, color: "#007aff" }} />
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: "#bcbcbc", alignSelf: "stretch" }}></View>
        </View>

        <View style={{ paddingTop: 20, flexDirection: "column" }}>
          <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
            onPress={this.chooseFile.bind(this)}>
            {(!avatar) ?
              <IconUser name="user-circle" size={150} style={{ color: "#bcbcbc" }} /> :
              <Image
                source={{ uri: avatar }}
                style={{ width: 130, height: 130, borderRadius: 65, marginTop: 10 }}
              />
            }
          </TouchableOpacity>
          <View style={styles.item}>
            <IconUser name="user-circle" size={24} style={{ color: "#007aff", flex: 2 }} />
            <View style={{ flex: 8 }}>
              <TextInput
                //   style={styles.inputName}
                onChangeText={(name) => {
                  this.setState({ name });
                }}
                value={this.state.name}
              />
            </View>
          </View>
          <View style={styles.line}></View>

          <View style={styles.item}>
            <IconPhone name="phone" size={24} style={{ color: "#007aff", flex: 2 }} />
            <View style={{ flex: 8 }}>
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
            <IconMail name="ios-mail" size={24} style={{ color: "#007aff", flex: 2 }} />
            <View style={{ flex: 8 }}>
              <TextInput
                //   style={styles.inputName}
                onChangeText={(email) => {
                  this.setState({ email });
                }}
                value={this.state.email}
              />
            </View>
          </View>
          <View style={styles.line}></View>


          <TouchableOpacity style={styles.button} onPress={this._handleCreatGroup}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Cập nhật</Text>
          </TouchableOpacity>


        </View>

      </View>
    );
  }
}