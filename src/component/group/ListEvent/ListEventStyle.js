import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        flex: 1,
        paddingTop: 10,
        flexDirection: 'column',
        backgroundColor: "#fff",
    },
    item: {
        flexDirection: "row",
    },
    info: {
        flexDirection: "column",
        width: "65%",
        marginRight:10
    },
    textName: {
        height: 25,
        fontSize: 18,
        fontWeight: "500"
    },
    textView: {
        height: 25,
        fontSize: 13,
    },
    textDescription: {
        height: 25,
        fontSize: 14,
        color: "#a9a9a9"
    },
    line: {
        height: 1,
        backgroundColor: "#000",
    },
    itemStyle: {
        flexDirection: "column",
        paddingTop: 10,
        height: 150,
        borderColor: "#F5F5F5",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: "#F5F5F5",
        marginLeft: 10,
        marginRight: 10,
    },
    calendar: {
        backgroundColor: "#ffffff",
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 15,
        fontWeight: "600",
        justifyContent: "center"
    },
    year: {
        height: 18,
        fontSize: 10,
        backgroundColor: "red",
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    day: {
        fontSize: 13,
        justifyContent: "center",
        alignItems: "center",
        
    },
    month: {
        fontSize: 10,
        justifyContent: "center",
        alignItems: "center",
    }

});

export default styles
