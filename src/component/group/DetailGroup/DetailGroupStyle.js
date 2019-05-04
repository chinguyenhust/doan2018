import {Platform ,StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        flexDirection: 'column',
    },
    tapbar: {
        height:50,
        flexDirection:"row",
        backgroundColor: "#58d669",
    },
    tapbarItem: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    lableBefore: {
        fontSize: 18,
        color: "#c7c7c7"
    },
    lableAfter: {
        fontSize: 18,
        color: "#ffffff"
    }
});

export default styles
