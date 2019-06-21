import React from "react"
import { StyleSheet, View,Text,Platform,StatusBar,ScrollView } from "react-native"
import {connect} from "react-redux"
import Header from "../../components/header/header"
import UserService from "../../shared/UserService"
import {withNavigation} from "react-navigation"
import {Button,TextInput,Snackbar,HelperText, Banner} from "react-native-paper"
import {SecureStore} from "expo"

class UpdatePasswordPage extends React.Component {

    state = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        oldPasswordError: "",
        newPasswordError: "",
        confirmPasswordError: "",
        isLoading:false,
        errorNetworkPassword: "",
        successNetworkPassword: ""

    }


    handleSubmit = () => {
        this.setState({
            oldPasswordError: "",
            newPasswordError: "",
            confirmPasswordError: ""
        })
        if(this.state.oldPassword === "") {
            this.setState({
                oldPasswordError: "Champs obligatoire"
            })
        }

        if(this.state.newPassword === "") {
            this.setState({
                newPasswordError: "Champs obligatoire"
            })
        }

        if(this.state.newPassword && this.state.newPassword.length <7) {
            this.setState({
                newPasswordError: "Le mot de passe doit avoir au minimum 7 caractères"
            })
        }


        if(this.state.confirmPassword === "") {
            this.setState({
                confirmPasswordError: "Champs obligatoire"
            })
        }

        if(this.state.newPassword !== "" && this.state.confirmPassword !== "") {
            if(this.state.newPassword !== this.state.confirmPassword){
                this.setState({
                    newPasswordError: "Rétaper votre nouveau mot de passe"
                })
            }else {
                this.setState({
                    newPasswordError: "",
                    isLoading:true
                })


                // send request

                let userId = this.props.user.userId
                UserService.updatePassword({
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword,
                    userId
                })
                .then((res) => {
                    this.setState({successNetworkPassword: "Vos modifications ont été mises à jour. Vous devez vous connecter pour des raisons de sécurité"})
                    
                    setTimeout(async () => {
                        console.log("Logout")

                        await SecureStore.deleteItemAsync("authToken")

                        this.setState({isLoading:false})
                        this.props.navigation.navigate("Login")
                    },3050)
                })
                .catch((err) => {
                    if(err.response.status === 501) {
                        this.setState({oldPasswordError: "L'ancien mot de passe est incorrect",isLoading:false})
                    
                }
                 //else {
                      //  this.setState({isLoading:false, errorNetworkPassword: "Erreur Interne du Serveur!.Veuillez ressayer plus tard..."})
                   // }
                })
            }
        }
    }



    render() {
        return (
            <View style={styles.view_container}>
                <Header navigation={this.props.navigation} shouldDisplayLogo={true}/>
                
                <ScrollView>

                    {/* banner for default password */}
                    <View style={{paddingLeft: 10,paddingRight:10}}>
                        <Banner
                            visible={this.props.user.isDefaultPwd === 1}
                            actions={[]}>
                            Votre mot de passe a été généré par l'admininstrateur.
                            Veuillez le changer pour etre en toute sécurité !
                        </Banner>
                    </View>

                    {/* Title */}
                    <View>
                        <Text style={styles.header_title}>Modifier mon mot de passe</Text>
                    </View>


                    <View style={{marginTop:50, marginBottom: 20, paddingLeft:10, paddingRight:10}}>


                        {/* Old password */}
                        <View>
                            <TextInput 
                                label="Votre ancien mot de passe"
                                mode="outlined"
                                secureTextEntry={true}
                                defaultValue={this.state.oldPassword}
                                onChangeText={(value) => this.setState({oldPassword: value})}
                                style={{marginTop:10,marginBottom:10}}
                                error={this.state.oldPasswordError!== ""}
                            />

                            {this.state.oldPasswordError!== "" && <HelperText type="error">
                                    {this.state.oldPasswordError}
                                </HelperText>
                            }
                        </View>    

                        
                        {/* New Password */}
                        <View>
                            <TextInput 
                                label="Nouveau mot de passe"
                                mode="outlined"
                                secureTextEntry={true}
                                defaultValue={this.state.newPassword}
                                onChangeText={(value) => this.setState({newPassword: value})}
                                style={{marginTop:10,marginBottom:10}}
                                error={this.state.newPasswordError!== ""}
                            />

                            {this.state.newPasswordError!== "" && <HelperText type="error">
                                    {this.state.newPasswordError}
                                </HelperText>
                            }
                        </View>    



                        {/* Confirm Password */}
                        <View>
                            <TextInput 
                                label="Confirmer votre mot de passe"
                                mode="outlined"
                                secureTextEntry={true}
                                defaultValue={this.state.confirmPassword}
                                onChangeText={(value) => this.setState({confirmPassword: value})}
                                style={{marginTop:10,marginBottom:10}}
                                error={this.state.confirmPasswordError!== ""}
                            />

                            {this.state.confirmPasswordError!== "" && 
                                <HelperText type="error">
                                    {this.state.confirmPasswordError}
                                </HelperText>
                            }
                        </View>


                        <Button
                            mode="contained"
                            onPress={this.handleSubmit}
                            loading={this.state.isLoading}
                            disabled={this.state.isLoading}>
                                Mettre à jour
                        </Button>
                    </View>
                </ScrollView>

                {/* Snackbar */}
                <Snackbar
                    visible={this.state.errorNetworkPassword !== "" || this.state.successNetworkPassword !== ""}
                    duration={3000}
                    onDismiss={()=>this.setState({errorNetworkPassword: "",successNetworkPassword: ""})}
                    style={{backgroundColor: this.state.errorNetworkPassword !== "" ? "#e74c3c" : "#27ae60"}}>
                        {this.state.errorNetworkPassword !== "" && this.state.errorNetworkPassword}
                        {this.state.successNetworkPassword !== "" && this.state.successNetworkPassword}
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
        justifyContent: "center"
    },
    button_text: {
        color: "white",
    },
    actuelEmailText: {
        fontSize:15
    },
    header_title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight:"bold",
        marginTop: 30
    },
    oldEmail: {
        fontWeight: "700"
    },
    errorMessage: {
        color: "red",
        paddingLeft: 11
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}
export default withNavigation(connect(mapStateToProps)(UpdatePasswordPage))