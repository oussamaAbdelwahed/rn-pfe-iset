import React from "react"
import { StyleSheet, View,Text,Platform,StatusBar,Keyboard } from "react-native"
import { withNavigation } from 'react-navigation'
import UserService from "../../shared/UserService"
import {Button,TextInput,HelperText,Snackbar} from "react-native-paper"

class ConfirmCodeResetPasswordPage extends React.Component {

    state= {
        codeConfirmation: "",
        wrongCodeConfirmation: "",
        disabledButton:false,
        successCodeMessage: ""
    }

    handleSubmit = () => {
        
        const email = this.props.navigation.getParam("email")
        this.setState({
            wrongCodeConfirmation: "",
            disabledButton:true
        })

        UserService.verifyResetPasswordCode(this.state.codeConfirmation)
                .then((res) => {
                    if(res.status === 200) {
                        // redirect to new password page with code conf
                        this.props.navigation.navigate("SetNewPassword", {
                            code: this.state.codeConfirmation
                        })
                    }else{
                        this.setState({
                            wrongCodeConfirmation: "Code de confirmation est incorrect",
                            disabledButton:false
                        })
                    }
                })
                .catch((err) => {
                   this.setState({
                      wrongCodeConfirmation: "Code de confirmation est incorrect",
                      disabledButton:false  
                    })
                })
                .finally(() => Keyboard.dismiss())
    }




    render() {
        return (
            <View style={styles.view_container}>

                {/* Header */}
                <View>
                    <Text style={styles.header_title}>Code de confirmation</Text>
                </View>

                    <Button 
                        mode="text"
                        style={{width:100,marginBottom:30}}
                        onPress= {()=>{this.props.navigation.navigate("rp")}}>
                        Retour
                    </Button>




                <View style={{paddingLeft:10,paddingRight:10}}>

                    <Text style={styles.text_description}>Verifier votre boite email pour le code de confirmation</Text>

                    <TextInput
                        label="Code de confirmation"
                        mode="outlined"
                        defaultValue={this.state.codeConfirmation}
                        onChangeText={(value) => this.setState({codeConfirmation: value})}
                        error={this.state.wrongCodeConfirmation}/>

                    {this.state.wrongCodeConfirmation!== "" && 
                    <HelperText type="error">
                        {this.state.wrongCodeConfirmation}
                    </HelperText>}


                    <View style={{marginTop:15}}>
                        <Button
                            mode="contained"
                            onPress={this.handleSubmit}
                            loading={this.state.disabledButton}
                            disabled={this.state.disabledButton}>
                            Mettre à jour
                        </Button>
                    </View>
                </View>  

                <Snackbar 
                    visible={this.state.successCodeMessage!== ""}
                    onDismiss={()=>this.setState({successCodeMessage: ""})}
                    duration={3000}
                    style={{backgroundColor: "#27ae60"}}
                    >
                        {this.state.successCodeMessage}
                    
                </Snackbar>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    view_container: {
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight // android phones have issues with StatusBar overlap
            }
        }),
        flex: 1
    },
    header_title: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
        marginTop:30,
        fontWeight:"bold"

    },
    text_description: {
        fontSize:15,
        marginBottom: 20,
        paddingLeft: 10,
        color: "#FFC312"
    },
    button: {
        marginTop: 10,
        backgroundColor: "#e53d22",
        width: 150,
        textAlign: "center",
        flexDirection: "row",
       justifyContent: "center",
    },
    button_text: {
        color: "white",
    },
    errorMessage: {
        color: "red",
        paddingLeft: 11
    }
})



export default withNavigation(ConfirmCodeResetPasswordPage)