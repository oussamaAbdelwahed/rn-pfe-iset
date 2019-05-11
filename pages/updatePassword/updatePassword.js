import React from "react"
import { StyleSheet, View,Text,Platform,StatusBar,ActivityIndicator } from "react-native"
import {Form,Input,Label,Item,Button,Toast,Root} from "native-base"
import {InputItem} from "@ant-design/react-native"
import {connect} from "react-redux"
import Header from "../../components/header/header"
import UserService from "../../shared/UserService"
import {withNavigation} from "react-navigation"
class UpdatePasswordPage extends React.Component {

    state = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        oldPasswordError: "",
        newPasswordError: "",
        confirmPasswordError: "",
        isLoading:false,
    }


    handleSubmit = () => {
        if(this.state.oldPassword === "") {
            this.setState({
                oldPasswordError: "Champs obligatoire"
            })
        }else {
            this.setState({
                oldPasswordError: ""
            })
        }

        if(this.state.newPassword === "") {
            this.setState({
                newPasswordError: "Champs obligatoire"
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
                    this.showSucessMessage("Vos modifications ont été mises à jour. Vous devez vous connecter pour des raisons de sécurité")
                     this.setState({isLoading:false})
                    // It wont be redirect
                    setTimeout(() => {
                        this.props.navigation.navigate("Login")
                    },2050)
                })
                .catch((err) => {
                    if(err.response.status === 501) {
                        this.setState({oldPasswordError: "L'ancien mot de passe est incorrect",isLoading:false})
                    }else {
                        this.setState({isLoading:false})
                        this.showErrorNetworkMessage("Erreur Interne du Serveur!.Veuillez ressayer plus tard...")
                    }
                })
            }
        }
    }

    showErrorNetworkMessage = (message) => {
        Toast.show({
            type: "warning",
            position: "top",
            text: message,
            duration: 2000
        })
    }

    showSucessMessage = (message) => {
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
                    <Header navigation={this.props.navigation} shouldDisplayLogo={true}/>
                    
                    {/* Header */}
                    <View>
                        <Text style={styles.header_title}>Modifier mon mot de passe</Text>
                    </View>


                    {/* Formulaire */}
                    <Form>
                        <Item stackedLabel style={{marginTop:10,marginBottom:10}}>
                            <Label>Votre ancien mot de passe</Label>
                            <InputItem 
                                type="password"
                                defaultValue={this.state.oldPassword}
                                onChangeText={(value) => this.setState({oldPassword: value})}
                            />
                        </Item>
                        {this.state.oldPasswordError!== "" && 
                            <Text style={styles.errorMessage}>{this.state.oldPasswordError}</Text> 
                        }


                        <Item stackedLabel style={{marginTop:10,marginBottom:10}}>
                            <Label>Nouveau mot de passe</Label>
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
                            <Label>Confirmer votre mot de passe</Label>
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
                                {this.state.isLoading  ? <ActivityIndicator/>  : null}
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
        marginBottom: 30,
        fontWeight:"bold"
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