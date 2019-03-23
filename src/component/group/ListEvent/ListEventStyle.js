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
        height: 55,
        flexDirection: "row",
    },
    info: {
        flexDirection: "column",
        width: "90%",
        paddingLeft:10,
    },
    textName: {
        height:25,
        fontSize:16,
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
        flexDirection: "column", 
        paddingTop: 10, 
        borderColor: "#F5F5F5", 
        borderWidth: 1 , 
        borderRadius: 8, 
        marginBottom: 20, 
        paddingLeft: 15,
        backgroundColor:"#F5F5F5",
        marginLeft:20,
        marginRight: 20,
    }

});

export default styles
