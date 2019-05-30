import { Platform, StyleSheet } from 'react-native'
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
    },
    list: {
        alignSelf: "stretch",
        flex: 8,
        flexDirection: "column"
    },
    search: {
        borderWidth: 1,
        height: 40,
        marginTop: 10,
        flexDirection: "row",
        borderColor: "#a9a9a9",
        paddingLeft: "5%",
        borderRadius: 7,
        marginLeft: "5%",
        marginRight: "5%"
    },
    item: {
        paddingLeft: 20,
        right: 0,
        alignSelf: "stretch",
        height: 85,
        flexDirection: "row",
        alignItems: "center",

    },
    lable: {
        fontSize: 17,
        fontWeight: "500",
        color: "#000000"
    },
    txtname: {
        fontSize: 16,
        fontWeight: "400",
        color: "#000000"
    },
    txtDescription: {
        fontSize: 13
    }, 
    tapbar: {
        flexDirection: "row",
        zIndex: 1000,
        bottom: 0,
        justifyContent: 'flex-end',
        height: 48,
        alignItems: "center",
        borderColor: '#ddd',
        borderTopWidth: 1,
    },
    tapItem:{
        flex: 1, 
        flexDirection: "column", 
        alignItems: "center"
    }


});

export default styles
