import { Platform,StyleSheet } from 'react-native'
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
        paddingLeft: 15,
        fontSize: 16,
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
        alignItems: "center",
        marginTop: 50
    },
    text :{
        color:"#000000",
        fontSize:16,
        fontWeight: "600"
    }
    
});

export default styles
