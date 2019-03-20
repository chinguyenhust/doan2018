import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 40,
        flexDirection: 'column',
        backgroundColor: "#fff",
        paddingBottom: 20,
        position: "absolute",
        left: 0,
        right: 0
    },
    inputName: {
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1, 
        marginTop: 10,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 5,
    },
    inputSchedule: {
        height: 100, 
        borderColor: 'gray', 
        borderWidth: 1, 
        marginTop: 10,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 5,
    },
    button: {
        bottom: 0, 
        alignItems: 'center', 
        backgroundColor:"green", 
        alignSelf: "stretch",
        height:40, 
        width: "100%", 
        justifyContent: "center",
        borderRadius: 7
    }
    
});

export default styles
