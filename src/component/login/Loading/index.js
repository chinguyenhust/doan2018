import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

export default class Loading extends React.Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      (user ?
        this.props.navigation.navigate('MyGroup', {"email": user.email}) :
        // this.props.navigation.navigate('Login') :
        this.props.navigation.navigate('Login')
      )
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})