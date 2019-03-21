import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase'

export default class SignUp extends React.Component {
  state = {
    email: '',
    password: '',
    userName: "",
    phone: "",
    id: 1,
    errorMessage: null
  }

  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        var {email, userName, phone, password, id}= this.state;
        
        firebase.database().ref('users/').push({
          userName: userName,
          phone: phone,
          email: email,
          password: password
        })
        this.props.navigation.navigate('Login');
        ref.childByAutoId().setValue(data)
      })
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ fontSize: 28, }}>Đăng ký</Text>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
        </View>
        <View style={{ alignItems: "flex-start", marginTop: 30 }}>
          <Text style={{ fontSize: 16 }}>User Name</Text>
        </View>
        <TextInput
          placeholder="User Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={userName => this.setState({ userName })}
          value={this.state.userName}
        />

        <View style={{ alignItems: "flex-start", marginTop: 15 }}>
          <Text style={{ fontSize: 16 }}>Email</Text>
        </View>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <View style={{ alignItems: "flex-start", marginTop: 15 }}>
          <Text style={{ fontSize: 16 }}>Phone</Text>
        </View>
        <TextInput
          placeholder="Phone"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={phone => this.setState({ phone })}
          value={this.state.phone}
        />

        <View style={{ alignItems: "flex-start", marginTop: 15 }}>
          <Text style={{ fontSize: 16 }}>Password</Text>
        </View>
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TouchableOpacity style={styles.buttonCreat} onPress={this.handleSignUp}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Đăng ký</Text>
        </TouchableOpacity>
        <Button
          title="Bạn đã có tài khoản? Đăng nhập"
          onPress={() => this.props.navigation.navigate('Login')}
        />
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
  textInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 20,
    fontSize: 16,
    borderRadius: 8
  },
  buttonCreat: {
    height: 40,
    backgroundColor: 'green',
    borderRadius: 7,
    alignSelf: "stretch",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    alignItems: 'center',
    marginTop: 30

  }
})