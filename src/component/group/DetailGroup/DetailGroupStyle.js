import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        paddingTop: 40,
        flexDirection: 'column',
    },
    tapbar: {
        flex: 1,
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
