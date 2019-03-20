import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ScrollView} from 'react-native';
import styles from './InfoGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconLocation from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-picker';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import MultiSelect from 'react-native-multiple-select';

export default class InfoGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      filePath: {},
      isLoad: false,
      schedule: "",
      selectedItems: [],
      items: [{
        id: '92iijs7yta',
        name: 'Ondo',
      }, {
        id: 'a0s0a8ssbsd',
        name: 'Ogun',
      }, {
        id: '16hbajsabsd',
        name: 'Calabar',
      }, {
        id: 'nahs75a5sg',
        name: 'Lagos',
      }, {
        id: '667atsas',
        name: 'Maiduguri',
      }, {
        id: 'hsyasajs',
        name: 'Anambra',
      }, {
        id: 'djsjudksjd',
        name: 'Benue',
      }, {
        id: 'sdhyaysdj',
        name: 'Kaduna',
      }, {
        id: 'suudydjsjd',
        name: 'Abuja',
      }]
    };
  }
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
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
          isLoad: true
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
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.chooseFile.bind(this)}>
          {(!this.state.isLoad) ?
            <IconAdd name="add-circle" size={150} style={{ color: "gray", marginTop: 10 }} /> :
            <Image
              source={{ uri: this.state.filePath.uri }}
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

        <ScrollView style={{ marginTop: 20 , height: 250}}>
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
            displayKey="name"
            searchInputStyle={{ color: '#CCC' ,height:40}}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
            fontSize={16}
          />
          <View>
            {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={()=>navigate("DetailGroup")}>
          <Text style={{color: "#fff", fontSize: 20}}>Tạo nhóm</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
