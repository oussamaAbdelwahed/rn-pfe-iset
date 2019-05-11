import { StyleSheet,Platform,StatusBar } from "react-native"

const styles = StyleSheet.create({
    view_container: {
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight // android phones have issues with StatusBar overlap
            }
        }),
        flex: 1,
    },
    logo_view_container: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop:40,
        marginBottom: 40,
        backgroundColor: "white"
    },
    email_input :{
        marginBottom: 20,
    },
    password_input: {
        marginBottom: 20,
    },
    submit_button :{
        marginLeft:15,
        marginRight:15,
    },
    button: {
       borderRadius:0
    },
    view_spinner_container: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: "center",
        alignItems: "center"
    }
})

export default styles;
