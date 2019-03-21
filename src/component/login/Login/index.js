import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity} from 'react-native';
import firebase from 'react-native-firebase'

export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const { email, password } = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('Home'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center',marginBottom: 30 }}>
                    <Text style={{ fontSize: 28, }}>Đăng nhập</Text>
                    {this.state.errorMessage &&
                        <Text style={{ color: 'red' }}>
                            {this.state.errorMessage}
                        </Text>}
                </View>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <TouchableOpacity style={styles.buttonCreat} onPress={this.handleLogin}>
                    <Text style={{ color: "#fff", fontSize: 20 }}>Đăng Nhập</Text>
                </TouchableOpacity>

                <Button
                    title="Bạn chưa có tài khoản? Đăng ký"
                    onPress={() => this.props.navigation.navigate('SignUp')}
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
        marginTop: 20,
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