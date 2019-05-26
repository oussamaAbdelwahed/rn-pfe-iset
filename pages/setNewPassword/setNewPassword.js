import React from "react"
import { View, Text,StyleSheet,Platform,StatusBar,Keyboard} from "react-native"
import UserService from "../../shared/UserService"
import {withNavigation} from "react-navigation"
import {Button, TextInput, Snackbar, HelperText} from "react-native-paper"


class SetNewPasswordPage extends React.Component {

    state = {
        newPassword: "",
        confirmPassword: "",
        newPasswordError: "",
        confirmPasswordError: "",
        isLoading:false,
        errorNetwork: "",
        successNetwork: ""
    }


    handleSubmit = () => {
        this.setState({
            newPasswordError: "",
            confirmPasswordError:""
        })

        if(this.state.newPassword === "") {
            this.setState({
                newPasswordError: "Champs obligatoire"
            })
        }else if(this.state.newPassword.length < 7){
            this.setState({
                newPasswordError: "Le mot de passe doit avoir une  longueur de 7 caractéres au minimum"
            })
        }else {
            this.setState({
                newPasswordError: ""
            })
        }




        if(this.state.confirmPassword === "") {
            this.setState({
                confirmPasswordError: "Champs obligatoire"
            })
        }else {
            this.setState({
                confirmPasswordError: ""
            })
        }



        if(this.state.newPassword !== "" && this.state.confirmPassword !== ""){
            if(this.state.newPassword === this.state.confirmPassword ) {
                let code = this.props.navigation.getParam("code")
                // send query
                this.setState({isLoading:true});
                UserService.setNewPasswordReset(this.state.newPassword,code)
                    .then((res) => {
                        if(res.status === 200) {
                            this.setState({
                                successNetwork: "Vos modifications ont été mises à jour. Vous devez vous connecter maintenant",
                                isLoading:false
                            })
                            setTimeout(() => {
                                this.props.navigation.navigate("Login")
                            },3050)
                        
                        }else {
                            this.setState({
                                errorNetwork: "Erreur Interne du Serveur!.Veuillez ressayer plus tard..."
                            })
                        }
                    })
                    .catch((err) =>{
                        this.setState({isLoading:false})
                        this.setState({
                            errorNetwork: "Erreur Interne du Serveur"
                        })
                    })
                    .finally(()=>Keyboard.dismiss())
            }else {
                this.setState({
                    newPasswordError: "Rétaper votre mot de passe",
                    isLoading:false
                })
            }
        }
    }


    render() {
        return (
            <View style={styles.view_container}>
                    {/* Title */}
                    
                    <View>
                        <Text style={styles.header_title}>Réinitialiser le mot de passe</Text>
                    </View>

                    <Button 
                        style={{width:100,marginBottom:30}} 
                        onPress= {()=>{this.props.navigation.navigate("ConfirmCodeResetPasswordPage")}}
                        mode="text">
                       Retour
                   </Button>

                   <View style={{paddingRight:10, paddingLeft: 10}}>
                        <TextInput 
                            secureTextEntry={true}
                            label="Saisir votre nouveau mot de passe"
                            value={this.state.newPassword}
                            onChangeText={(value) => this.setState({newPassword: value})}
                            error={this.state.newPasswordError!== ""}
                            mode="outlined"
                            style={{marginBottom: 10}}
                            
                        />
                    </View>
                        {this.state.newPasswordError!== "" && 
                            <HelperText visible={this.state.newPasswordError !== ""} type="error">
                                {this.state.newPasswordError}
                            </HelperText>
                        }

                    <View style={{paddingRight:10, paddingLeft: 10}}>
                        <TextInput 
                            secureTextEntry={true}
                            label="Rétaper votre nouveau mot de passe"
                            value={this.state.confirmPassword}
                            onChangeText={(value) => this.setState({confirmPassword: value})}
                            error={this.state.confirmPasswordError!== ""}
                            mode="outlined"
                            style={{marginBottom: 10}}
                        />
                    </View>
                        {this.state.confirmPasswordError!== "" && 
                            <HelperText visible={this.state.confirmPasswordError !== ""} type="error">
                                {this.state.confirmPasswordError}
                            </HelperText>
                        }
                   


                    <View style={{paddingLeft:10, paddingRight:10}}>
                        <Button 
                            mode="contained"
                            onPress={this.handleSubmit}
                            loading={this.state.isLoading}
                            disabled={this.state.isLoading}>
                                Mettre à jour
                        </Button>
                    </View>


                    {/* Error snackbar */}
                    <Snackbar
                        visible={this.state.errorNetwork !== ""}
                        onDismiss={() => this.setState({errorNetwork: ""})}
                        duration={3000}
                        style={{backgroundColor: "#e74c3c"}}>
                            {this.state.errorNetwork}
                    </Snackbar>


                    {/* Success snackbar */}
                    <Snackbar
                        visible={this.state.successNetwork !== ""}
                        onDismiss={() => this.setState({successNetwork: ""})}
                        duration={3000}
                        style={{backgroundColor: "#27ae60"}}>
                            {this.state.successNetwork}
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
    header_title: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
        fontWeight:"bold"
    },
    errorMessage: {
        color: "red",
        paddingLeft: 11
    }
})

export default withNavigation(SetNewPasswordPage)