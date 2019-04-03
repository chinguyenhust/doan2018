import React, { Component } from 'react';
import {Text, View,TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import styles from './InfoGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import MultiSelect from '../../home/MultiSelect';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';

let users = Data.ref('/users');

export default class InfoGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isLoad: false,
      schedule: "",
      selectedItems: [],
      items: [],
      created_at: "",
      avatar: null,
      image: null,
      leader: "",
    };
    this.uploadImage = this.uploadImage.bind(this);
  }

  componentWillMount() {
    var items = []
    users.on('child_added', (snapshot) => {
      let data = snapshot.val();
      items.push({
        id: snapshot.key,
        name: data.userName,
      })
      this.setState({ items: items });
    });

    const groupId = this.props.navigation.state.params.groupId;
    Data.ref("groups").child(groupId).on("child_added", (snapshot) => {
      var data = snapshot.val();
      console.log(data)
      this.setState({
        name: data.name,
        schedule: data.schedule,
        avatar: data.avatar
      })
    })
  }

  componentDidMount(){
    const groupId = this.props.navigation.state.params.groupId;
    Data.ref("groups").child(groupId).on("value", (snapshot) => {
      var data = snapshot.val();
      console.log(data)
      this.setState({
        name: data.name,
        schedule: data.schedule,
        avatar: data.avatar
      })
    })
  }

  _handleCreatGroup = () => {
    var { name, schedule, image, selectedItems } = this.state;
    var user = firebase.auth().currentUser;
    Data.ref("groups").push(
      {
        name: name,
        schedule: schedule,
        avatar: image,
        createdByUserId: user.uid,
        members: selectedItems,
        created_at: firebase.database.ServerValue.TIMESTAMP
      }
    ).then(() => {
      console.log("Success !");
    }).catch((error) => {
      console.log(error);
    });
    this.props.navigation.navigate("DetailGroup", { name: name })
  }

  uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref('avatar').child(new Date().getTime() + "");
      const task = ref.put(blob);
      
      task.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const { selectedItems, items, avatar, name, schedule } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity style={{ height: 30, flexDirection: "row", paddingLeft: 20 }}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 40 }}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.chooseFile.bind(this)}>
            {(avatar === null) ?
              <IconAdd name="add-circle" size={120} style={{ color: "gray" }} /> :
              <Image
                source={{ uri: avatar }}
                style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
              />
            }
          </TouchableOpacity>

          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 16 }}>Tên nhóm</Text>
            <TextInput
              style={styles.inputName}
              onChangeText={(name) => {
                this.setState({ name });
              }}
              value={this.state.name}
            />
          </View>

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Kế hoạch cho chuyến đi</Text>
            <TextInput
              style={styles.inputSchedule}
              onChangeText={(schedule) => {
                this.setState({ schedule });
              }}
              value={this.state.schedule}
              numberOfLines={4}
              multiline={true}
            />
          </View>

          <MultiSelect
            hideTags
            items={items}
            uniqueKey="id"
            ref={(component) => { this.multiSelect = component }}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Thành viên nhóm"
            searchInputPlaceholderText="Tìm kiếm thành viên"
            onChangeInput={(text) => console.log(text)}
            altFontFamily="Cochin"
            tagRemoveIconColor="#007aff"
            tagBorderColor="#007aff"
            tagTextColor="#007aff"
            selectedItemTextColor="#000"
            selectedItemIconColor="#000"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC', height: 40, fontSize: 16 }}
            submitButtonColor="#007aff"
            submitButtonText="Submit"
            fontSize={16}
          />
          <View>
            {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}
          </View>

          <TouchableOpacity style={styles.button} onPress={this._handleCreatGroup}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Tạo nhóm</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}
