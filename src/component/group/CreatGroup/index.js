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
    var { name, schedule, avatar} = this.state;
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
      }
    });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const { selectedItems, items } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity style={{ height: 30, flexDirection: "row" }}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{ fontSize: 24 }}>Tạo nhóm mới</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: "#000", height: 1, marginTop: 5 }}></View>
        </View>

        <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.chooseFile.bind(this)}>
          {(!this.state.isLoad) ?
            <IconAdd name="add-circle" size={150} style={{ color: "gray", marginTop: 10 }} /> :
            <Image
              source={this.state.avatar}
              style={{ width: 130, height: 130, borderRadius: 65, marginTop: 20 }}
            />
          }
        </TouchableOpacity>

        <View style={{ flexDirection: "column", marginTop: 20 }}>
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

        <ScrollView style={{ marginTop: 20, height: 250 }}>
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
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={this._handleCreatGroup}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Tạo nhóm</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
