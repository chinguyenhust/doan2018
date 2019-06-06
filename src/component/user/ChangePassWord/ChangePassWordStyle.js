import {Platform, StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        alignSelf: "stretch",
        flexDirection: 'column',
        height: 56,
        marginTop: Platform.OS === 'ios' ? 30 : 0,
        alignItems: "center",
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
    txt:{
        fontSize: 14,
        color:"#000000"
    },
    info:{
        margin:20, 
        borderRadius:4, 
        borderWidth:1, 
        borderColor:"#ebebeb", 
        shadowColor: '#b9b9b9',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 1
    },
    button: {
        alignItems: 'center',
        backgroundColor: "#006805",
        height: 40,
        justifyContent: "center",
        borderRadius: 7,
        marginLeft:25,
        marginRight:25,
        marginTop:30,
        marginBottom:40 
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
