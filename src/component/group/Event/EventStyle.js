import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        flexDirection: 'column',
    },
    tapbar: {
        flex:1,
        flexDirection:"row",
        backgroundColor: "#FFF"
    },
    tapbarItem: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    lableBefore: {
        fontSize: 18,
        color: "#000000"
    },
    lableAfter: {
        fontSize: 18,
        color: "#008605"
    },
    line: {
        height: 1,
        width: "100%",
        backgroundColor: "#008605",
        marginTop: 5,
    }
});

export default styles
