import { StyleSheet, Platform} from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        paddingTop: Platform.OS === 'ios' ? 30 : 5,
        flexDirection: 'column',
    },
    tapbar: {
        height: 40,
        flexDirection: "column",
    },
    tap: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 20,
        paddingTop: 5,
        alignItems: "stretch"
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
        backgroundColor: 'green',
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
        paddingLeft: 12
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

});

export default styles
