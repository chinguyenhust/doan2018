import { StyleSheet } from 'react-native'
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
        height: 40,
        marginTop: 30,
        alignItems: "center",
    },
    tap: {
        height: 39, 
        flexDirection: "row", 
        justifyContent: "center", 
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
        backgroundColor:"green", 
        height:40, 
        justifyContent: "center",
        borderRadius: 7,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    }


});

export default styles
