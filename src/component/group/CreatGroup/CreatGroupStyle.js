import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        paddingTop: 30,
        flexDirection: 'column',
        backgroundColor: "#fff",
        left: 0,
        right: 0,
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
        alignItems: 'center', 
        backgroundColor:"green", 
        height:40, 
        justifyContent: "center",
        borderRadius: 7,
        marginTop: 20
    }
    
});

export default styles
