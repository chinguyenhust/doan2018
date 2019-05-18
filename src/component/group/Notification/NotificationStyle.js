import { Platform, StyleSheet } from 'react-native'
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
        paddingLeft: 20,
        right: 0,
        alignSelf: "stretch",
        height: 85,
        flexDirection: "row",
        alignItems: "center",
    }
});

export default styles
