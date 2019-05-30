import { StyleSheet, Platform} from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#fff",
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 0,
        left: 0
    },
    header: {
        alignSelf: "stretch",
        flexDirection: 'column',
        height: 56,
        marginTop: Platform.OS === 'ios' ? 30 : 0,
        alignItems: "center",
        backgroundColor:"#006805"
    },
    tap: {
        height: 56, 
        flexDirection: "row", 
        alignItems: "center"
    },
    item: {
        flexDirection:"row", 
        paddingLeft: 20, 
        paddingRight: 20,
        height: 60, 
        justifyContent: "center", 
        alignItems: "center",
    },
    line: {
        paddingLeft: 10, 
        paddingRight: 10,
        width: "100%",
        height: 1,
        backgroundColor: "#bcbcbc"
    },
    button: {
        alignItems: 'center', 
        backgroundColor:"#006805", 
        height:40, 
        justifyContent: "center",
        borderRadius: 7,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    info:{
        margin:25, 
        borderRadius:4, 
        borderWidth:1, 
        borderColor:"#ebebeb", 
        shadowColor: '#b9b9b9',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 1
    },
    input:{
        fontSize: 20
    }

});

export default styles