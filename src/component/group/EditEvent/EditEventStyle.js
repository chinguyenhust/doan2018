import { StyleSheet, Platform} from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        flexDirection: 'column',
    },
    tapbar: {
        height: 56,
        flexDirection:"column",
        backgroundColor: "#006805"
    },
    tap: {
        flex:1,
        flexDirection: "row", 
        paddingLeft: 20, 
        paddingTop: 5, 
        alignSelf: "stretch",
    },
    input: {
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
        marginTop:40
    },
    titleBold: {
        fontSize: 18,
        fontWeight: "600",
        color:"#000000"
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