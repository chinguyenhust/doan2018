import React, { Component } from 'react';
import { Alert, Text, View, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import styles from './CreatGroupStyle';
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
      avatar: null,
      image: null,
      description: "",
      errGroupName: "",
      group_id: null,
      isAddMember: false
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
        avatar: data.avatar,
        phone: data.phone
      })
      this.setState({ items: items });
    });
  }

  _handleCreatGroup = () => {
    var { name, schedule, image, selectedItems, description } = this.state;
    var user = firebase.auth().currentUser;
    var uid = this.props.navigation.state.params.uid;
    // var uid = user.uid;
    const startDate = this.props.navigation.getParam("startDate", null);
    const untilDate = this.props.navigation.getParam("untilDate", null);
    var check = this._handleCheck();
    if (check) {
      Data.ref("groups").push(
        {
          name: name,
          schedule: schedule,
          avatar: image,
          createdByUserId: uid,
          startDate: startDate,
          untilDate: untilDate,
          description: description,
          created_at: firebase.database.ServerValue.TIMESTAMP,
          isOnMap: false
        }
      ).then((snapshot) => {
        this.setState({
          group_id: snapshot.key,
        })
        if (selectedItems) {
          selectedItems.map((item) => {
            Data.ref("group_users").push(
              {
                group_id: snapshot.key,
                user_id: item
              }
            ).then(() => {
              console.log("Success !");
            }).catch((error) => {
              console.log(error);
            });
          })
        }
      }).catch((error) => {
        console.log(error);
      });
      this.props.navigation.navigate("DetailGroup", { name: name, groupId: this.state.group_id })
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

  _handleCheck() {
    const { name, errGroupName, } = this.state;
    if (name && !errGroupName)
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
              <Text style={{ fontSize: 20, fontWeight: "600", color: "#ffffff" }}>Tạo nhóm mới</Text>
            </View>
          </View>
          {/* <View style={{ backgroundColor: "#000", height: 1, marginTop: 5 }}></View> */}
        </View>

        <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 40 }}>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent:"center", height:100 }} onPress={this.chooseFile.bind(this)}>
            {(!this.state.isLoad) ?
              <IconPicture name="picture-o" size={60} style={{ color: "#ebebeb" }} /> :
              <Image
                source={{ uri: avatar }}
                style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
              />
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
            <TouchableOpacity style={styles.date} onPress={() => navigate('DatePicker')}>
              <Text style={styles.titleBold}>Ngày đi (*)</Text>
              {(startDate === null || startDate === "Invalid date") ?
                <Text style={{ color: "#A9A9A9", paddingTop: 5, fontSize: 16 }}>Chọn ngày đến</Text> :
                <Text style={{ color: "#000", paddingTop: 5, fontSize: 16 }}>{startDate}</Text>
              }
            </TouchableOpacity>
            <View style={styles.line}>
            </View>
            <TouchableOpacity style={styles.time} onPress={() => navigate('DatePicker')}>
              <Text style={styles.titleBold}>Ngày về (*)</Text>
              {(untilDate === null || untilDate === "Invalid date") ?
                <Text style={{ color: "#A9A9A9", paddingTop: 5, fontSize: 16 }}>Chọn ngày về</Text> :
                <Text style={{ color: "#000", paddingTop: 5, fontSize: 16 }}>{untilDate}</Text>
              }
            </TouchableOpacity>
          </View>

          <View style={styles.viewInput}>
            <Text style={styles.titleBold}>Kế hoạch cho chuyến đi (*)</Text>
            <TextInput
              placeholder="Nhập kế hoạch"
              style={styles.inputSchedule}
              onChangeText={(schedule) => {
                this.setState({ schedule });
              }}
              value={this.state.schedule}
              numberOfLines={3}
              multiline={true}
            />
          </View>
          {
            // (!this.state.isAddMember)
            //   ?
            //   <TouchableOpacity style={{ height: 40, backgroundColor: "#53ca64", width: 150, borderRadius: 4 , justifyContent: "center"}} onPress={this._handleAddMember}>
            //     <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "500" }}>Thêm thành viên</Text>
            //   </TouchableOpacity>
            //   :
              <View>
                <View style={{marginBottom:5}}>
                  <Text style={styles.titleBold}>Thêm thành viên </Text>
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

          <TouchableOpacity style={styles.button} onPress={this._handleCreatGroup}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Tạo nhóm</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}
