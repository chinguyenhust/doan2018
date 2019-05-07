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
})
export default styles
