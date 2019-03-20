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
        marginTop: 35,
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
        flexDirection: "row" ,
        borderColor: "#a9a9a9", 
        paddingLeft: "5%",
        borderRadius: 7,
        marginLeft: "5%",
        marginRight: "5%"
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20,
        alignSelf: "stretch",
        height: 60,
        flexDirection: "row"
    }


});

export default styles
