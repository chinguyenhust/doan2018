import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        flex: 1,
        paddingTop: 10,
        flexDirection: 'column',
        backgroundColor: "#fff",
    },
    item: {
        flexDirection: "row",
    },
    info: {
        flexDirection: "column",
        width: "80%",
        paddingLeft: 8,
        justifyContent: "center"
    },
    textName: {
        height: 25,
        fontSize: 20,
        fontWeight: "500"
    },
    textView: {
        height: 25,
        fontSize: 14,
    },
    textDescription: {
        height:25,
        fontSize:14,
        color: "#a9a9a9"
    },
    line:{
        height:1,
        backgroundColor:"#000",
    }, 
    itemStyle: {
        height: 70,
        flexDirection: "column", 
        borderColor: "#F5F5F5", 
        borderWidth: 1 , 
        borderRadius: 8, 
        marginBottom: 20, 
        paddingLeft: 15,
        marginLeft:20,
        marginRight: 20,
        backgroundColor:"#F5F5F5",
        justifyContent: "center"
    }

});

export default styles
