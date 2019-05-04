import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import { required, phone, password, Email } from '../../../util/validate';

export default class SignUp extends React.Component {
  state = {
    email: '',
    password: '',
    userName: "",
    phone: "",
    id: 1,
    errUserName: "",
    errPhone: "",
    errEmail: "",
    errPassword: "",
    errorMessage: null
  }

  _handleChangeUserName = (text) => {
    var errUserName = required(text);
    this.setState({
      userName: text,
      errUserName: errUserName
    })
  }
  _handleChangeEmail = (text) => {
    var errEmail = required(text) || Email(text);
    this.setState({
      email: text,
      errEmail: errEmail
    })
  }
  _handleChangePassword = (text) => {
    var errPassword = required(text) || password(text);
    this.setState({
      password: text,
      errPassword: errPassword
    })
  }
  _handleChangePhone = (text) => {
    var errPhone = required(text) || phone(text);
    this.setState({
      phone: text,
      errPhone: errPhone
    })
  }
  _handleCheck() {
    const { phone, email, userName, password, errEmail, errUserName, errPhone, errPassword } = this.state;
    if (phone && email && userName && password && !errEmail && !errUserName && !errPhone && !errPassword)
      return true;
    return false;
  }

  handleSignUp = () => {
    var check = this._handleCheck();
    if (check) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          var check = this._handleCheck();
          var { email, userName, phone, password, id } = this.state;
          firebase.database().ref('users/').push({
            userName: userName,
            phone: phone,
            email: email,
            password: password,
            latitude: null,
            longitude: null
          })
          this.props.navigation.navigate('Login');
          ref.childByAutoId().setValue(data)
        })
        .catch(error => this.setState({ errorMessage: error.message }))
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
  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ fontSize: 28, fontWeight: "600" }}>Đăng ký</Text>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
        </View>
        <View style={styles.viewInput}>
          <Text style={styles.titleBold}>Họ và tên (*)</Text>
          <TextInput style={styles.textInput}
            placeholder="Nhập Username"
            value={this.state.userName}
            blurOnSubmit={false}
            onSubmitEditing={() => { this.phoneInput.focus(); }}
            onChangeText={this._handleChangeUserName} />
          {this.state.errUserName ? <Text style={styles.textError}>{this.state.errUserName}</Text> : null}
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.titleBold}>Số điện thoại (*)</Text>
          <TextInput style={styles.textInput}
            ref={(input) => { this.phoneInput = input; }}
            value={this.state.phone}
            keyboardType="numeric"
            onChangeText={this._handleChangePhone}
            onSubmitEditing={() => { this.emailInput.focus(); }}
            blurOnSubmit={false}
            placeholder="Nhập số điện thoại" />
          {this.state.errPhone ? <Text style={styles.textError}>{this.state.errPhone}</Text> : null}
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.titleBold}>Email (*)</Text>
          <TextInput style={styles.textInput} keyboardType="email-address"
            ref={(input) => { this.emailInput = input; }}
            value={this.state.email}
            onChangeText={this._handleChangeEmail}
            blurOnSubmit={false}
            onSubmitEditing={() => { this.passwordInput.focus(); }}
            placeholder="Nhập email" />
          {this.state.errEmail ? <Text style={styles.textError}>{this.state.errEmail}</Text> : null}
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.titleBold}>Password (*)</Text>
          <TextInput style={styles.textInput}
            ref={(input) => { this.passwordInput = input; }}
            value={this.state.password}
            onChangeText={this._handleChangePassword}
            blurOnSubmit={false}
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            placeholder="Nhập password" />
          {this.state.errPassword ? <Text style={styles.textError}>{this.state.errPassword}</Text> : null}
        </View>

        <TouchableOpacity style={styles.buttonCreat} onPress={this.handleSignUp}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, justifyContent: "center", alignItems: 'center' }}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={{ color: "#007aff", fontSize: 16 }}>Bạn đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
        
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: "10%",
    paddingRight: "10%"
  },
  buttonCreat: {
    height: 40,
    backgroundColor: '#53ca64',
    borderRadius: 7,
    alignSelf: "stretch",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    alignItems: 'center',
    marginTop: 30
  },
  titleBold: {
    fontSize: 18,
    fontWeight: "600"
  },
  textInput: {
    fontSize: 16,
    fontWeight: "300",
    paddingHorizontal: 10,
    height: 45,
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#bcbcbc",
    marginVertical: 8
  },
  viewInput: {
    marginTop: 15,
  },
  textError: {
    color: "red"
  }
})