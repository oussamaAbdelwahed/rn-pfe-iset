import React from "react"
import { View, Text,StyleSheet,Platform,StatusBar,ActivityIndicator} from "react-native"
import {Form, Label,Item,Button,Toast,Root} from "native-base"
import {InputItem} from "@ant-design/react-native"
import UserService from "../../shared/UserService"
import {withNavigation} from "react-navigation"


class SetNewPasswordPage extends React.Component {

    state = {
        newPassword: "",
        confirmPassword: "",
        newPasswordError: "",
        confirmPasswordError: "",
        isLoading:false
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
                            this.showSuccessAlert("Vos modifications ont été mises à jour. Vous devez vous connecter maintenant")
                            this.setState({isLoading:false})
                            setTimeout(() => {
                                this.props.navigation.navigate("Login")
                                //this.props.navigation.navigate("lin")
                            },2050)
                        
                        }else {
                            this.showErrorAlert("Erreur Interne du Serveur")
                        }
                    })
                    .catch((err) =>{
                        this.setState({isLoading:false})
                       console.log(err)
                    })
            }else {
                this.setState({
                    newPasswordError: "Rétaper votre mot de passe",
                    isLoading:false
                })
            }
        }
    }


    showSuccessAlert = (message) => {
        Toast.show({
            type: "success",
            position: "top",
            text: message,
            duration: 2000
        })
    }

    showErrorAlert = (message) => {
        Toast.show({
            type: "warning",
            position: "top",
            text: message,
            duration: 2000
        })
    }


    render() {
        return (
            <View style={styles.view_container}>
                <View>
                   <Button style={{marginLeft:4,marginBottom:20,backgroundColor:"#1B9CFC",width:60,display:"flex",alignContent:"center",justifyContent:"center"}} onPress= {()=>{this.props.navigation.navigate("Login")}}>
                       <Text style={{textAlign:"center",color:"white",fontWeight:"bold"}}>{'retour'}</Text>
                   </Button>
                </View>
                <Root>
                    {/* Title */}
                    
                    <View>
                        <Text style={styles.header_title}>Réinitialiser le mot de passe</Text>
                    </View>


                    {/* Formulaire */}
                    <Form>
                        <Item stackedLabel style={{marginTop:10,marginBottom:10}}>
                            <Label>Saisir votre nouveau mot de passe !!</Label>
                            <InputItem 
                                type="password"
                                defaultValue={this.state.newPassword}
                                onChangeText={(value) => this.setState({newPassword: value})}
                            />
                        </Item>

                        {this.state.newPasswordError!== "" && 
                            <Text style={styles.errorMessage}>{this.state.newPasswordError}</Text> 
                        }




                        <Item stackedLabel style={{marginTop:10,marginBottom:10}}>
                            <Label>Rétaper votre nouveau mot de passe</Label>
                            <InputItem 
                                type="password"
                                defaultValue={this.state.confirmPassword}
                                onChangeText={(value) => this.setState({confirmPassword: value})}
                            />
                        </Item>

                        {this.state.confirmPasswordError!== "" && 
                            <Text style={styles.errorMessage}>{this.state.confirmPasswordError}</Text> 
                        }



                        <View style={{paddingLeft:10, paddingRight:10}}>
                            <Button type="primary" block style={styles.button} onPress={this.handleSubmit}>
                                <Text style={styles.button_text}>Mettre à jour</Text>
                                {this.state.isLoading ? <ActivityIndicator/> : null}
                            </Button>
                        </View>
                    </Form>
                </Root>
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