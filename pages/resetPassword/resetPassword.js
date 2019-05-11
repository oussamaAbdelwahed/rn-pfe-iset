import React from "react"
import { Form,Item,Input, Button,Label,Toast,Root } from "native-base";
import { View,Text,Platform,StatusBar,StyleSheet,ActivityIndicator } from "react-native"
import { withNavigation } from 'react-navigation'
import UserService from "../../shared/UserService"


class ResetPasswordPage extends React.Component {

    state = {
        email: "",
        disabledButton:false,
        errorMessage:"",
    }

    handleSubmit = () => {
        this.setState({disabledButton:true,errorMessage:""});
        if(this.state.email !== "") {

            UserService.resetPassword(this.state.email)
                .then((res) => {
                    this.setState({disabledButton:false})
                    if(res.status === 200) {
                        this.props.navigation.navigate("confirmCode", {
                            email: this.state.email,
                            type: "reset-password"
                        })
                    }else {
                        this.showErrorAlert("Cette adresse email n'existe pas")
                    }
                })
                .catch((err) => {
                      console.log(err)
                      this.showErrorAlert("Cette adresse email n'existe pas")
                      this.setState({disabledButton:false})
                })
        }else{
            this.setState({errorMessage:"email invalide"})
        }
        
    }


    showErrorAlert = (message) => {
        Toast.show({
            type: "warning",
            position: "top",
            text: message,
            duration: 3000
        })
    }



    render() {
        return (
            <View style={styles.view_container}>
                <Root>
                    {/* Header title */}
                    <View>
                        <Text style={styles.header_title}>Mot de passe oublié</Text>
                    </View>


                    {/* Formulaire */}
                    <Form>
                        <View>
                           <Button style={{marginLeft:4,marginBottom:20,backgroundColor:"#1B9CFC",width:60,display:"flex",alignContent:"center",justifyContent:"center"}} onPress= {()=>{this.props.navigation.navigate("Login")}}>
                              <Text style={{textAlign:"center",color:"white",fontWeight:"bold"}}>{'retour'}</Text>
                           </Button>
                        </View>
                        <Item stackedLabel>
                            <Label>Saisir votre adresse email</Label>
                            <Input 
                                type="email-address"
                                placeholder="Adresse email"
                                defaultValue={this.state.email}
                                onChangeText={(value) => this.setState({email: value})}
                            />
                        </Item>

                        <View style={{paddingLeft:10, paddingRight:10}}>
                            <Button disabled={this.state.disabledButton} type="primary" block style={{backgroundColor:"#e53d22"}} onPress={this.handleSubmit}>
                                <Text style={styles.button_text}>Mettre à jour</Text> 
                                {this.state.disabledButton ? <ActivityIndicator/> : null}
                            </Button>
                        </View>
                        {this.state.errorMessage.length > 0 ?<View>
                            <Text style={{color:"red"}}>{this.state.errorMessage}</Text>
                        </View> : null}
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