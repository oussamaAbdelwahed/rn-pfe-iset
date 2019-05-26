import React from "react"
import { StyleSheet, View,Text,Platform,StatusBar } from "react-native"
import {Form,Input,Label,Item,Toast,Root} from "native-base"
import {connect} from "react-redux"
import Header from "../../components/header/header"
import { withNavigation } from 'react-navigation'
import UserService from "../../shared/UserService"

import {TextInput, Snackbar, Button, HelperText, Banner} from "react-native-paper"

class UpdateEmailPage extends React.Component {

    state = {
        newEmail: "",
        newEmailError: "",
        disabledSubmitButton:false,
        networkErrorMessage: ""
    }


    handleSubmit = () => {
        this.setState({
            newEmailError: ""
        })


        if(this.state.newEmail === "") {
            this.setState({
                newEmailError: "Champs obligatoire"
            })
        }

        if(this.state.newEmail !== "") {
            this.setState({
                disabledSubmitButton:true
            })
            UserService.resetEmail(this.props.user.userId,this.state.newEmail)
                .then((res) => {

                    // it wont be redirect
                    this.props.navigation.navigate("confirmCode", {
                        email: this.state.newEmail
                    })
                })
                .catch((err) => {
                    console.log(err)
                    //status code === 401 (email exist)
                    if(err.response.status === 401) {
                        this.setState({newEmailError: "Adresse email existe déja"})
                    }else { // 500
                        //this.showErrorAlert("Erreur Interne du Serveur!.Veuillez ressayer plus tard...")
                        this.setState({
                            networkErrorMessage: "Erreur Interne du Serveur!.Veuillez ressayer plus tard..."
                        })
                    }
                }).finally(() => {
                    this.setState({
                        disabledSubmitButton:false
                    })
                })

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
                <Header navigation={this.props.navigation} shouldDisplayLogo={true}/>
                
                {/* banner for default password */}
                <View style={{paddingLeft: 10,paddingRight:10}}>
                    <Banner
                        visible={this.props.user.isDefaultPwd === 1}
                        actions={[]}>
                        Votre mot de passe a été généré par l'admininstrateur.
                        Veuillez le changer pour etre en toute sécurité !
                    </Banner>
                </View>

                {/* Header */}
                <View>
                    <Text style={styles.header_title}>Modifier mon adresse email</Text>
                </View>


                <View style={{paddingLeft:10, marginBottom:15}}>
                    <Text style={styles.actuelEmailText}> 
                        <Text style={styles.oldEmail}>Votre adresse email actuelle est {this.props.user.email}</Text>
                    </Text>               
                </View>

                <View style={{marginTop:10,marginBottom:10, paddingLeft: 10, paddingRight:10}}>
                    <TextInput 
                        label="Nouvelle adresse email"
                        mode="outlined"
                        onChangeText={(value) => this.setState({newEmail: value})}
                        error={this.state.newEmailError!== ""}/>
                </View>
                    
                {this.state.newEmailError!== "" && 
                    <HelperText
                        visible={this.state.newEmailError!== ""}
                        type="error">
                        {this.state.newEmailError}
                    </HelperText>
                }

                <View style={{paddingLeft: 10, paddingRight:10}}>
                    <Button
                        mode="contained"
                        onPress={this.handleSubmit}
                        loading={this.state.disabledSubmitButton}
                        disabled={this.state.disabledSubmitButton}>
                            Mettre à jour
                    </Button>
                </View>

                


                <Snackbar
                    visible={this.state.networkErrorMessage!== ""}
                    duration={3000}
                    onDismiss={()=>this.setState({networkErrorMessage: ""})}>
                        {this.state.networkErrorMessage}
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
    actuelEmailText: {
        fontSize:15
    },
    header_title: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
        marginTop:30,
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
export default withNavigation(connect(mapStateToProps)(UpdateEmailPage))