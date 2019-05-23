import { StyleSheet, Platform} from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        flexDirection: 'column',
        backgroundColor: "#fff",
        left: 0,
        right: 0,
    },
    inputName: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 5,
    },
    inputSchedule: {
        height: 100,
        borderColor: '#bcbcbc',
        borderWidth: 0.5,
        marginTop: 10,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 5,
        textAlignVertical: "top",
        marginBottom: 8,
        paddingTop: 2
    },
    button: {
        alignItems: 'center',
        backgroundColor: "#006805",
        height: 40,
        justifyContent: "center",
        borderRadius: 7,
        marginTop: 20,
        marginBottom: 30
    },
    tab: {
        height: 56,
        flexDirection: "row",
        paddingLeft: 20,
        backgroundColor: "#006805"
    },
    dateTime: {
        backgroundColor: '#fff',
        borderRadius: 7,
        height: 60,
        alignSelf: "stretch",
        paddingTop: 5,
        flexDirection: "row",
        fontSize: 16,
        fontWeight: "300",
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: "#bcbcbc",
        marginVertical: 8
    },
    date: {
        width: "49%",

    },
    time: {
        marginLeft: 10,

    },
    line: {
        width: "1%",
        height: 50,
        backgroundColor: "#a9a9a9"
    },
    titleBold: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000000"
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
        marginTop: 5,
    },
    textError: {
        color: "red"
    }

});

export default styles
