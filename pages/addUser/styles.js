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
    title :{
        fontSize:20,
        textAlign:'center',
        color: "#2c3e50"
    
    },
    title_container: {
        marginBottom:20
    },
    form_item_margin: {
        marginBottom:20
    },
    submit_button: {
        marginLeft:15,
        marginRight:15,
    },
    button: {
        borderRadius:0
    },

    label_admin: {
        marginLeft: 11
    },

    view_admin_switch: {
        marginBottom: 40
    },
    errorMessage: {
        color:'#c0392b',
        textAlign:'center'
    }
});

export default styles;