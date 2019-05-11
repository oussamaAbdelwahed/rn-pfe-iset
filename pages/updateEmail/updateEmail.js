import React from "react"
import { StyleSheet, View,Text,Platform,StatusBar } from "react-native"
import {Form,Input,Label,Item,Button,Toast,Root} from "native-base"
import {connect} from "react-redux"
import Header from "../../components/header/header"
import { withNavigation } from 'react-navigation'
import UserService from "../../shared/UserService"



class UpdateEmailPage extends React.Component {

    state = {
        newEmail: "",
        newEmailError: ""
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
            console.log(this.state.newEmail)
            UserService.resetEmail(this.props.user.userId,this.state.newEmail)
                .then((res) => {

                    // it wont be redirect
                    this.props.navigation.navigate("confirmCode", {
                        email: this.state.newEmail,
                        type: "update-email"
                    })
                })
                .catch((err) => {
                    console.log(err)
                    //status code === 401 (email exist)
                    if(err.response.status === 401) {
                        this.setState({newEmailError: "Adresse email existe déja"})
                    }else { // 500
                        this.showErrorAlert("Erreur Interne du Serveur!.Veuillez ressayer plus tard...")
                    }
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
                <Root>
                    <Header navigation={this.props.navigation} shouldDisplayLogo={true}/>
                    
                    {/* Header */}
                    <View>
                        <Text style={styles.header_title}>Modifier mon adresse email</Text>
                    </View>


                    {/* Formulaire */}
                    <View style={{paddingLeft:10}}>
                        <Text style={styles.actuelEmailText}> 
                            <Text style={styles.oldEmail}>Votre adresse email actuelle est {this.props.user.email}</Text>
                        </Text>               
                    </View>

                    <Form>
                        <Item stackedLabel style={{marginTop:10,marginBottom:10}}>
                            <Label>Nouvelle adresse email</Label>
                            <Input
                                onChangeText={(value) => this.setState({newEmail: value})}
                            />
                        </Item>

                        {this.state.newEmailError!== "" && 
                            <Text style={styles.errorMessage}>{this.state.newEmailError}</Text> 
                        }



                        <View style={{paddingLeft:10, paddingRight:10}}>
                            <Button type="primary" block style={styles.button} onPress={this.handleSubmit}>
                                <Text style={styles.button_text}>Mettre à jour</Text>
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