import React, { Component } from 'react';
import { Alert, Text, View, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import styles from './EditGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import IconPicture from 'react-native-vector-icons/FontAwesome';
import MultiSelect from '../../home/MultiSelect';
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';
import ImageResizer from 'react-native-image-resizer';
import { required } from '../../../util/validate';
import FCM from 'react-native-fcm';

let users = Data.ref('/users');

export default class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.state.params.name,
      errGroupName: "",
      schedule: this.props.navigation.state.params.schedule,
      errSchedule: "",
      description: this.props.navigation.state.params.description,
      selectedItems: [],
      items: [],
      created_at: "",
      avatar: this.props.navigation.state.params.avatar,
      image: this.props.navigation.state.params.avatar,
      group_id: this.props.navigation.state.params.groupId,
      startDate: this.props.navigation.state.params.startDate,
      errStartDate: "",
      untilDate: this.props.navigation.state.params.untilDate,
      errUntilDate: "",
      uid: this.props.navigation.state.params.uid,
      members: this.props.navigation.state.params.members
    };
    this.uploadImage = this.uploadImage.bind(this);
  }

  componentWillMount() {
    var items = []
    var members = this.state.members;
    users.on('child_added', (snapshot) => {
      let data = snapshot.val();
      items.push({
        id: snapshot.key,
        name: data.userName,
        avatar: data.avatar,
        phone: data.phone
      })
      this.setState({ items: items });
    });  
  }

_handleUpDateInfoGroup = () => {
  var { name, schedule, image, selectedItems, description, uid, group_id, avatar } = this.state;
  const startDate = this.props.navigation.getParam("startDate", null);
  const untilDate = this.props.navigation.getParam("untilDate", null);
  this.setState({
    startDate: startDate,
    untilDate: untilDate
  })
  var check = this._handleCheck();
  if (check) {
    Data.ref("groups").child(group_id).update(
      {
        name: name,
        schedule: schedule,
        avatar: image,
        updateByUserId: uid,
        startDate: startDate,
        untilDate: untilDate,
        description: description,
        timeUpdate: firebase.database.ServerValue.TIMESTAMP,
      }
    ).then((snapshot) => {
      
      if (selectedItems) {
        selectedItems.map((item) => {
          Data.ref("group_users").push(
            {
              group_id: group_id,
              user_id: item
            }
          ).then(() => {
            console.log("Success !");
            Data.ref("notification").push({
              topic: group_id,
              groupName: name,
              userName: uid,
              token: "",
              title: "Nhóm mới",
              message: "Bạn vừa được thêm vào nhóm ",
              created_at: firebase.database.ServerValue.TIMESTAMP,
              userAvatar: "https://facebook.github.io/react-native/docs/assets/favicon.png"
            })
          }).catch((error) => {
            console.log(error);
          });
        })
      }
    }).catch((error) => {
      console.log(error);
    });
    this.props.navigation.navigate("MyGroup", { name: name, groupId: this.state.group_id })
  } else {
    Alert.alert(
      'Thông báo',
      'Vui lòng điền đầy đủ thông tin!',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
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
      // cameraRoll: true,
      path: 'images',
    },
  };

  ImagePicker.showImagePicker(options, response => {
    console.log("options  ", options.takePhotoButtonTitle)
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

onSelectedItemsChange = selectedItems => {
  this.setState({ selectedItems });
};

_handleChangeGroupName = (text) => {
  var errGroupName = required(text);
  this.setState({
    name: text,
    errGroupName: errGroupName
  })
}

_handleChangeSchulde = (text) => {
  var errSchedule = required(text);
  this.setState({
    schedule: text,
    errSchedule: errSchedule
  })
}

_handleCheck() {
  const { name, errGroupName, schedule,
    errSchedule, startDate, errStartDate, untilDate, errUntilDate, selectedItems } = this.state;
  if (name && !errGroupName && schedule && !errSchedule && startDate && !errStartDate && untilDate && !errUntilDate && (selectedItems !== []))
    return true;
  return false;
}
_handleAddMember = () => {
  this.setState({
    isAddMember: true
  })
}

render() {
  const { selectedItems, items, avatar } = this.state;
  const { navigate } = this.props.navigation;
  const startDate = this.props.navigation.getParam("startDate", null);
  const untilDate = this.props.navigation.getParam("untilDate", null);

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: "column" }}>
        <View style={styles.tab}>
          <TouchableOpacity style={{ width: "15%", justifyContent: "center" }} onPress={() => { this.props.navigation.goBack() }}>
            <Icon name="ios-arrow-round-back" size={34} style={{ color: "#ffffff", }} />
          </TouchableOpacity>
          <View style={{ width: "75%", justifyContent: "center", }}>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#ffffff" }}>Chỉnh sửa thông tin nhóm</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 40 }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: "center", height: 100 }} onPress={this.chooseFile.bind(this)}>
          {(avatar) ?
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
            /> :
            <IconPicture name="picture-o" size={60} style={{ color: "#ebebeb" }} />
          }
        </TouchableOpacity>

        <View style={styles.viewInput}>
          <Text style={styles.titleBold}>Tên nhóm (*)</Text>
          <TextInput style={styles.textInput}
            placeholder="Nhập tên nhóm"
            value={this.state.name}
            blurOnSubmit={false}
            onSubmitEditing={() => { this.descriptionInput.focus(); }}
            onChangeText={this._handleChangeGroupName} />
          {this.state.errGroupName ? <Text style={styles.textError}>{this.state.errGroupName}</Text> : null}
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.titleBold}>Mô tả</Text>
          <TextInput
            ref={(input) => { this.descriptionInput = input; }}
            placeholder="Mô tả nhóm"
            style={styles.textInput}
            onChangeText={(description) => {
              this.setState({ description });
            }}
            value={this.state.description}
          />
        </View>

        <View style={styles.dateTime}>
          <TouchableOpacity style={styles.date} onPress={() => navigate('DatePicker', { "isEdit": true })}>
            <Text style={styles.titleBold}>Ngày đi (*)</Text>
            {(startDate === null || startDate === "Invalid date") ?
              <Text style={{ color: "#A9A9A9", paddingTop: 5, fontSize: 16 }}>Chọn ngày đến</Text> :
              <Text style={{ color: "#000", paddingTop: 5, fontSize: 16 }}>{startDate}</Text>
            }
            {this.state.errStartDate ? <Text style={styles.textError}>{this.state.errStartDate}</Text> : null}
          </TouchableOpacity>
          <View style={styles.line}>
          </View>
          <TouchableOpacity style={styles.time} onPress={() => navigate('DatePicker', { "isEdit": true })}>
            <Text style={styles.titleBold}>Ngày về (*)</Text>
            {(untilDate === null || untilDate === "Invalid date") ?
              <Text style={{ color: "#A9A9A9", paddingTop: 5, fontSize: 16 }}>Chọn ngày về</Text> :
              <Text style={{ color: "#000", paddingTop: 5, fontSize: 16 }}>{untilDate}</Text>
            }
            {this.state.errUntilDate ? <Text style={styles.textError}>{this.state.errUntilDate}</Text> : null}
          </TouchableOpacity>
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.titleBold}>Kế hoạch cho chuyến đi (*)</Text>
          <TextInput
            placeholder="Nhập kế hoạch"
            style={styles.inputSchedule}
            onChangeText={this._handleChangeSchulde}
            value={this.state.schedule}
            numberOfLines={3}
            multiline={true}
          />
          {this.state.errSchedule ? <Text style={styles.textError}>{this.state.errSchedule}</Text> : null}
        </View>
        {
          <View>
            <View style={{ marginBottom: 5 }}>
              <Text style={styles.titleBold}>Thêm thành viên (*) </Text>
            </View>
            <MultiSelect
              hideTags
              items={items}
              uniqueKey="id"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={selectedItems}
              selectText="Chọn thành viên nhóm"
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
          </View>
        }

        <TouchableOpacity style={styles.button} onPress={this._handleUpDateInfoGroup}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Cập nhật</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
}
