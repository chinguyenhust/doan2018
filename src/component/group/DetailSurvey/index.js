import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/Ionicons';
import styles from './DetailSurveyStyle';
import { CheckBox } from 'react-native-elements'

export default class DetailSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      isAdd: false,
      options: [
        {
          value: "Có",
          vote: 0
        },
        {
          value: "Không",
          vote: 1
        },
        {
          value: "Tuỳ",
          vote: 2
        },
      ],
      optionValue: "",
      checked: false
    }
  }

  _handleAddOption = () => {
    var { options, optionValue } = this.state;
    if(optionValue === ""){
      alert("Nhập giá trị của tuỳ chọn")
    }else{
      options.push({ value: optionValue, vote: 0 });
    }

    this.setState({
      options: options,
      isAdd: true,
      optionValue: ""
    })
  }

  _handleChecked = () => {
    this.setState({
      checked: true,
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    const { options } = this.state;

    return (
      <View style={styles.container} >
        <View style={styles.tapbar}>
          <TouchableOpacity style={styles.tap}>
            <Icon name="ios-arrow-round-back" size={34} style={{ width: "15%" }} onPress={() => { this.props.navigation.goBack() }} />
            <Text style={{ fontSize: 24, width: "70%" }}>Khảo sát ý kiến</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
        </View>
        <View style={{ flex: 16, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>Câu hỏi: </Text>
            <Text style={{ fontSize: 20, color: "red", marginLeft: 20}}> Đi chơi không sdsdfd dfdf ? </Text>
          </View>

          {(options.length > 0) &&
            options.map((option) =>
              <View style={styles.checkbox}>
                <CheckBox
                  center
                  title={option.value}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={this.state.checked}
                  containerStyle={{ borderWidth: 0, backgroundColor: "#fff", width: "80%", alignItems:"flex-start"}}
                // onPress={this._handleChecked}
                />
                <Text style={{fontSize: 16, marginTop: 10}}>{option.vote} vote</Text>
              </View>
            )}

          <View style={styles.option}>
            <IconAdd name="ios-add" style={styles.icon} size={30} onPress={this._handleAddOption} />
            <TextInput placeholder="Thêm option"
              style={styles.input}
              onChangeText={(optionValue) => {
                this.setState({ optionValue });
              }}
              value={this.state.optionValue}
            />
          </View>

          <TouchableOpacity style={styles.buttonCreat} onPress={() => navigate('DetailGroup')}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Gửi lựa chọn</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
