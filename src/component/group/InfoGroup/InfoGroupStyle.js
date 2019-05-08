import { Platform, StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        flexDirection: 'column',
        backgroundColor: "#f2f3f6",
        left: 0,
        right: 0,
        paddingBottom:50
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
        backgroundColor: "#006805",
        height: 40,
        justifyContent: "center",
        borderRadius: 7
    },
    time: {
        height: 70,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        borderWidth: 1,
        paddingTop: 5,
        borderColor: "#e8ecf7",
        backgroundColor: "#ffffff",
        borderRadius: 3,
        flexDirection: "column",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 1
    },
    schedule: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom:10,
        borderColor: "#e8ecf7",
        backgroundColor: "#ffffff",
        borderRadius: 3,
        flexDirection: "column",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 1
    }


});

export default styles
