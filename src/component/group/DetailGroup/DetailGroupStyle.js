import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        paddingTop: 30,
        flexDirection: 'column',
    },
    tapbar: {
        height:40,
        flexDirection:"row",
        backgroundColor: "green"
    },
    tapbarItem: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    lableBefore: {
        fontSize: 18,
        color: "#fff"
    },
    lableAfter: {
        fontSize: 18,
        color: "#000"
    }
});

export default styles
