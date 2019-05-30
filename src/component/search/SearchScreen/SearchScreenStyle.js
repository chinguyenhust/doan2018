import { StyleSheet, Platform } from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        flexDirection: 'column',
    },
    header: {
        height: 56,
        flexDirection: "row",
        paddingLeft: 20,
        alignSelf: "stretch",
        alignItems: "center",
        backgroundColor: "#006805"
    },
    item: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderTopWidth: 0,
        marginRight: 10,
        marginLeft:10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 1
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
})
export default styles