import React from "react"
import { Form,Item,Input,Label,Toast,Root } from "native-base";
import { View,Text,Platform,StatusBar,StyleSheet,Keyboard } from "react-native"
import { withNavigation } from 'react-navigation'
import UserService from "../../shared/UserService"
import {Button,TextInput,HelperText,Snackbar} from "react-native-paper"

class ResetPasswordPage extends React.Component {


    state = {
        email: "",
        disabledButton:false,
        errorEmailMessage:"",
        errorNetworkMessage: "",
        showNetworkMessage: false
    }

    handleSubmit = () => {
        this.setState({errorEmailMessage:"", showNetworkMessage: false});
    
        if(this.state.email !== "") {
            this.setState({disabledButton: true})
            UserService.resetPassword(this.state.email)
                .then((res) => {
                    this.setState({disabledButton:false})
                    if(res.status === 200) {
                        this.props.navigation.navigate("ConfirmCodeResetPasswordPage", {
                            email: this.state.email
                        })
                    }
                })
                .catch((err) => {
                      this.setState({
                        errorNetworkMessage: "Cette adresse email n'existe pas",
                        disabledButton:false,
                        showNetworkMessage: true
                      })
                }).finally(() => {
                    Keyboard.dismiss()
                })
        }else{
            this.setState({errorEmailMessage:"Adresse email est invalide"})
        }
        
    }



    render() {
        return (
            <View style={styles.view_container}>
                    {/* Header title */}
                    <View>
                        <Text style={styles.header_title}>Mot de passe oublié</Text>
                    </View>

                    <Button 
                        mode="text"
                        style={{width:100,marginBottom:30}}
                        onPress= {()=>{this.props.navigation.navigate("Login")}}>
                        Retour
                    </Button>
                    
                    <View style={{paddingLeft: 10,paddingRight: 10}}>
                        <TextInput
                                label="Saisir votre adresse email"
                                defaultValue={this.state.email}
                                onChangeText={(value) => this.setState({email: value})}
                                mode="outlined"
                                error={this.state.errorEmailMessage!== "" || this.state.showNetworkMessage}
                        />
                        {this.state.errorEmailMessage!== "" && 
                            <HelperText type="error">
                                {this.state.errorEmailMessage}
                            </HelperText>}

                        <Button
                            mode="contained"
                            disabled={this.state.disabledButton}
                            onPress={this.handleSubmit}
                            loading={this.state.disabledButton}
                            style={{marginTop:15}}>
                            Mettre à jour
                        </Button>
                    </View>


                    <Snackbar
                        visible={this.state.errorNetworkMessage!== ""}
                        onDismiss={() => this.setState({errorNetworkMessage: ""})}
                        duration={3000}
                        style={{backgroundColor:"#e74c3c"}}>
                            {this.state.errorNetworkMessage}
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
        marginBottom: 60,
        marginTop: 30,
        fontWeight:"bold"
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
    }
})

export default withNavigation(ResetPasswordPage)