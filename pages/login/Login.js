import React, {Component} from "react"
import styles from './styles'
import LoginService from '../../shared/LoginService';
import {saveAuthToken} from '../../graphql-utilities/gql-utils';
import { Image, TouchableOpacity ,View } from "react-native"
import { connect } from "react-redux"
import { getParsedToken } from "../../utilities/utils"
import { withNavigation } from 'react-navigation'

import {TextInput, Button, HelperText,Snackbar, Text} from "react-native-paper"

class LoginPage extends Component {
    state = {
        emailValue:'',
        passwordValue:'',
        isLoading: false,
        loginWrongCredentialErrorMessage:'',
        loginError: false,
        loginAlertVerifiedAccount:""
    };

    onSubmitFormHandler = () => {
      const email = this.state.emailValue;
      const password = this.state.passwordValue;
        this.setState({
          loginWrongCredentialErrorMessage: "",
          loginError: false,
          loginAlertVerifiedAccount:"",
          isLoading: true
        })

        
        this.loginHandler(email,password)
          .then(async (res) => {
            if(res.login.token) {
                  // save token in Secure Store
                  await saveAuthToken(res.login.token)
              
                   // update the user and auth states
                   getParsedToken(res.login.token).then((decryptedToken) => {
                     this.props.UPDATE_PROJECT_TYPE(decryptedToken.defaultSelectedProject);
                     this.props.UPDATE_PROJECT_INTERVALE(decryptedToken.defaultSelectedPeriod);
                     this.props.SAVE_USER(decryptedToken)
                     this.props.UPDATE_AUTH_STATUS(true)
                     this.props.UPDATE_ADMIN_STATUS(decryptedToken.isAdmin>0)
                     this.setState({isLoading:false})

                     // navigate to dashboard
                     this.props.navigation.navigate("Tableau de board");
                   })      
            }
                
            })
              .catch((err) => {
                this.setState({isLoading:false})
                  console.log(err)
                  let catchErrorMessage = err.message.split(":")[1]
                  
                  if(catchErrorMessage.trim() === "compte non verifié") {
                    this.setState({
                      loginAlertVerifiedAccount: "Compte non verifié. Pouvez-vous verifier votre boite mail pour un lien de confirmation"
                    })
                  
                  }else if(catchErrorMessage.trim() === "mot de passe invalide !" || catchErrorMessage.trim() === "email invalide !"){
                    this.setState({
                      loginWrongCredentialErrorMessage: "Adresse email ou mot de passe est invalide",
                      loginError: true,
                      passwordValue: ""
                    })
                  
                  }else {
                    this.setState({
                      loginWrongCredentialErrorMessage: "",
                      loginError: false
                    })

                    //this.showErrorAlert("Erreur Interne du Serveur. Ressayer plus tard")
                  }
              })
    }


    loginHandler = (email,password) => {
      return  LoginService.login(email,password)
    }


    redirectToResetPassword = () => {
      this.props.navigation.navigate("rp")
    }


    handleChangeEmail = (value) => {
        this.setState({
          emailValue: value
        })
    }

    handleChangePassword = (value) => {
      this.setState({
        passwordValue: value
      })
  }


    render() {
      return (
          <View style={styles.view_container}>
              {/* View Logo JAMG */}
              <View style={{
                marginTop:40,
                flexDirection: "row",
                justifyContent: "center"
              }}>
                <Image 
                  source={require("../../assets/images/jamg.png")}/>

              </View>

              {/* View form */}
              <View style={{marginTop:50, marginBottom: 20, paddingLeft:10, paddingRight:10}}>
                {/* Email */}
                    <View>
                      <TextInput 
                        label="Adresse email"
                        mode="outlined"
                        style={{marginTop:15}}
                        error={this.state.loginError}
                        defaultValue={this.state.emailValue}
                        onChangeText={value => this.handleChangeEmail(value)}
                      />
                      {this.state.loginError && <HelperText type="error">
                          {this.state.loginWrongCredentialErrorMessage}
                      </HelperText>
                      }
                    </View>


                    {/* Password */}
                    <TextInput 
                      label="Mot de passe"
                      mode="outlined"
                      secureTextEntry={true}
                      defaultValue={this.state.passwordValue}
                      onChangeText={value => this.handleChangePassword(value)}
                    />


                    {/* Button */}
                    <View style={{marginTop: 15}}>
                      <Button
                        mode="contained"
                        onPress={this.onSubmitFormHandler}
                        loading={this.state.isLoading}
                        disabled={this.state.isLoading}>
                        Se connecter
                      </Button>
                    </View>

                {/* Reset password link */}
                <TouchableOpacity activeOpacity={0.8} onPress={this.redirectToResetPassword}>  
                    <Text style={{
                      fontSize:16,
                      paddingLeft: 10,
                      paddingTop:20
                    }}>Mot de passe oublié..?</Text>
                </TouchableOpacity>
              </View>

            <Snackbar
              visible={this.state.loginAlertVerifiedAccount !== ""}
              duration={3000}
              onDismiss={()=>{this.setState({loginAlertVerifiedAccount:""})}}>
              {this.state.loginAlertVerifiedAccount}
            </Snackbar>
          </View>
      )
    }
}


const mapStateToProps = state => {
  return {
      auth: state.auth,
      user: state.user,
      project: state.project
  }
}

const mapDispatchToProps = dispatch => {
  return {
      UPDATE_AUTH_STATUS: (value) => dispatch({
          type: "UPDATE_AUTH_STATUS",
          value
      }),
      UPDATE_ADMIN_STATUS: (value) => dispatch({
          type: "UPDATE_ADMIN_STATUS",
          value
      }),
      SAVE_USER: (token) => dispatch({
          type: "SAVE_USER",
          value: {
              userId: token.userId,
              email: token.email,
              firstname: token.firstname,
              lastname: token.lastname,
              isAdmin:token.isAdmin,
              isDefPwd:null,
              defaultSelectedProject: token.defaultSelectedProject,
              defaultSelectedPeriod:token.defaultSelectedPeriod,
              isDefaultPwd:token.isDefaultPwd,
              country:token.country,
              minImageUrl: token.minImageUrl,
              bigImageUrl:token.bigImageUrl
          }
      }),
      UPDATE_PROJECT_TYPE : (value) => dispatch({
        type: "UPDATE_PROJECT_TYPE",
        value
      }),
      UPDATE_PROJECT_INTERVALE : (value) => dispatch({
        type: "UPDATE_PROJECT_INTERVALE",
        value
      })
  }
}

export default withNavigation(connect(mapStateToProps,mapDispatchToProps)(LoginPage));
