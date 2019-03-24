import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import styles from './CreatGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import MultiSelect from 'react-native-multiple-select';
import { Data } from "../../../api/Data";

let users = Data.ref('/users');

export default class CreatGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isLoad: false,
      schedule: "",
      selectedItems: [],
      items: [],
      created_at: "",
      avatar: null
    };
  }

  componentDidMount() {
    users.on('value', (snapshot) => {
      let data = snapshot.val();
      let items = Object.values(data);
      this.setState({ items: items });
    });

  }

  _handleCreatGroup = () => {
    var { name, schedule, avatar } = this.state;
    Data.ref("groups").push(
      {
        name: name,
        schedule: schedule,
        avatar: avatar
      }
    ).then(() => {
      console.log("Success !");
    }).catch((error) => {
      console.log(error);
    });
    this.props.navigation.navigate("DetailGroup")

  }

  // componentWillMount() {
  //   Data.ref("users/001").set(
  //     {
  //       name: "chi",
  //       age: 23
  //     }
  //   ).then(() => {
  //     console.log("Success !");
  //   }).catch((error) => {
  //     console.log(error);
  //   });

  // }
  chooseFile = () => {
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
        // let source = response.uri;
        // You can also display the image using data:
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log("source  ", source);
        this.setState({
          avatar: source,
          isLoad: true,
        });
        // Data.ref('AlbumImg/').push({
        //   uri: source
        // })
      }
    });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };
  uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref('avatar').child(uuid.v4());
      const task = ref.put(blob);
      return new Promise((resolve, reject) => {
        task.on('state_changed', () => { }, reject,
          () => resolve(task.snapshot.downloadURL));
      });
    } catch (err) {
      console.log('uploadImage error: ' + err.message);
    }
  }

  render() {
    const { selectedItems, items } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity style={{ height: 30, flexDirection: "row", paddingLeft: 20 }}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{ fontSize: 24 }}>Tạo nhóm mới</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: "#000", height: 1, marginTop: 5 }}></View>
        </View>
        <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 40 }}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.chooseFile.bind(this)}>
            {(!this.state.isLoad) ?
              <IconAdd name="add-circle" size={120} style={{ color: "gray" }} /> :
              <Image
                source={this.state.avatar}
                style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
              />
            }
          </TouchableOpacity>

          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 16 }}>Tên nhóm</Text>
            <TextInput
              placeholder="Đặt tên nhóm"
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
              placeholder="Nhập kế hoạch"
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
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="userName"
            searchInputStyle={{ color: '#CCC', height: 40 }}
            submitButtonColor="#CCC"
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
