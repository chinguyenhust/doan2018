import { Platform,StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        flexDirection: 'column',
    },
    tapbar: {
        height: 56,
        flexDirection: "column",
        backgroundColor:"#006805"
    },
    tap: {
        flex: 1,
        flexDirection: "row",
        alignItems:"center", paddingLeft:20
    },
    inputQuestion: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 5,
    },
    buttonCreat: {
        height: 40,
        backgroundColor: '#006805',
        borderRadius: 7,
        alignSelf: "stretch",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        alignItems: 'center',
        marginTop: 50
    },
    option: {
        marginTop: 20,
        height: 40,
        flexDirection: "row",
    },
    icon: {
        width: "15%",
        justifyContent: "center",
        alignItems: 'center',
        color: "gray",
        paddingLeft: 10,
        paddingTop: 5
    },
    input: {
        width: "75%",
        fontSize: 16,
    },
    checkbox: {
        height:55,
        alignItems: "flex-start",
       flexDirection: "row",
    }

});

export default styles
