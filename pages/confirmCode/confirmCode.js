import React from "react"
import { StyleSheet, View,Text,Platform,StatusBar,ActivityIndicator } from "react-native"
import {Form,Input,Label,Item,Button,Root,Toast} from "native-base"
import { withNavigation } from 'react-navigation'
import UserService from "../../shared/UserService"

class ConfirmCodePage extends React.Component {

    state= {
        codeConfirmation: "",
        wrongCodeConfirmation: "",
        disabledButton:false,
    }

    handleSubmit = () => {
        
        const email = this.props.navigation.getParam("email")
        const type = this.props.navigation.getParam("type")
        this.setState({
            wrongCodeConfirmation: "",
            disabledButton:true
        })

        if(type === "reset-password") {
            UserService.verifyResetPasswordCode(this.state.codeConfirmation)
                .then((res) => {
                    if(res.status === 200) {
                        console.log("code correct")
                        // redirect to new password page with code conf
                        this.props.navigation.navigate("SetNewPassword", {
                            code: this.state.codeConfirmation
                        })
                    }else{
                        console.log(res.status)
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
        }else if(type === "update-email") {
            UserService.verifyResetEmailCode(email,this.state.codeConfirmation)
                .then((res) => {
                    if(res.status === 200) {
                        console.log("code correct")

                        this.showSuccessAlert("Vos modifications ont été mises à jour. Vous devez vous connecter maintenant")

                        setTimeout(() => {
                            this.props.navigation.navigate("Login")
                        },2050)
                        
                    }else{
                        console.log(res.status)
                        this.setState({
                            wrongCodeConfirmation: "Code de confirmation est incorrect",
                            disabledButton:false
                            
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.setState({
                        wrongCodeConfirmation: "Code de confirmation est incorrect",
                        disabledButton:false
                    })
                })
        }
    }


    showSuccessAlert = (message) => {
        Toast.show({
            type: "success",
            position: "top",
            text: message,
            duration: 3000
        })
    }


    render() {
        return (
            <View style={styles.view_container}>
                <Root>
                        {/* Header */}
                        <View>
                            <Text style={styles.header_title}>Code de confirmation</Text>
                        </View>

                        <Form>
                            <Text style={styles.text_description}>Verifier votre boite email pour le code de confirmation</Text>
                            <Item stackedLabel style={{marginTop:10,marginBottom:10}}>
                                <Label>Code de confirmation</Label>
                                <Input
                                    defaultValue={this.state.codeConfirmation}
                                    onChangeText={(value) => this.setState({codeConfirmation: value})}
                                />
                            </Item>

                            {this.state.wrongCodeConfirmation!== "" && 
                                <Text style={styles.errorMessage}>{this.state.wrongCodeConfirmation}</Text> 
                            }


                            <View style={{paddingLeft:10, paddingRight:10}}>
                                <Button type="primary" block style={styles.button} onPress={this.handleSubmit}>
                                    <Text style={styles.button_text}>Mettre à jour</Text>
                                    {this.state.disabledButton ? <ActivityIndicator/> : null}
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
    header_title: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
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



export default withNavigation(ConfirmCodePage)