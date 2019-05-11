import React, {Component} from "react"
import styles from './styles'
import LoginService from '../../shared/LoginService';
import { Form,Button, Text, Toast,Root} from 'native-base';
import {saveAuthToken} from '../../graphql-utilities/gql-utils';
import { InputItem, Icon } from "@ant-design/react-native"
import { Image, TouchableOpacity ,View,StyleSheet } from "react-native"
import { connect } from "react-redux"
import { getParsedToken } from "../../utilities/utils"
import { withNavigation } from 'react-navigation'
import { Spinner } from "native-base";

class LoginPage extends Component {
    state = {
        emailValue:'',
        passwordValue:'',
        isLoading: false,
        loginWrongCredentialErrorMessage:'',
        emailErrorMessage: '',
        passwordErrorMessage: ''
    };

    onSubmitFormHandler = async () => {
      this.setState({isLoading:true});
      const email = this.state.emailValue;
      const password = this.state.passwordValue;

        // validate the fields
        if(email === "") {
          this.setState({
            emailErrorMessage: "Champ obligatoire",
            isLoading:false
          })
        }else {
          this.setState({
            emailErrorMessage: ""
          })
        }


        if(password === "") {
          this.setState({
            passwordErrorMessage: "Champ obligatoire",
            isLoading:false
          })
        }else {
          this.setState({
            passwordErrorMessage: ""
          })
        }

        if(email==="" || password===""){
          console.log("oh oh")
          this.setState({isLoading:false});
          return;
        }


        // if fields are correct then submit the form
        if(this.state.emailErrorMessage === "" && this.state.passwordErrorMessage === "") {
            this.setState({
              loginWrongCredentialErrorMessage: ""
            })

            console.log(email, password)
            this.loginHandler(email,password)
              .then((res) => {
                if(res.login.token) {

                  // save token in Secure Store
                  saveAuthToken(res.login.token)
                
                
                  // update the user and auth states
                  getParsedToken(res.login.token).then((decryptedToken) => {
                    this.props.SAVE_USER(decryptedToken)
                    this.props.UPDATE_AUTH_STATUS(true)
                    this.props.UPDATE_ADMIN_STATUS(decryptedToken.isAdmin>0)

                    // navigate to dashboard
                    //this.props.navigation.navigate('tableaudebord')
                    //this.setState({isLoading:false})
                    this.props.navigation.navigate("Tableau de board");
                  })
                  .catch((err) => {
                    console.log(err)
                    this.setState({isLoading:false})
                  })        
                }
                
              })
              .catch((err) => {
                this.setState({isLoading:false})
                console.log(err)
                let catchErrorMessage = err.message.split(":")[1]
                
                if(catchErrorMessage.trim() === "compte non verifié") {
                  this.showErrorAlert("Compte non verifié. Pouvez-vous verifier votre boite mail pour un lien de confirmation")
                
                }else if(catchErrorMessage.trim() === "mot de passe invalide !" || catchErrorMessage.trim() === "email invalide !"){
                  this.setState({
                    loginWrongCredentialErrorMessage: "Adresse email ou mot de passe est invalide"
                  })
                
                }else {
                  this.setState({
                    loginWrongCredentialErrorMessage: ""
                  })

                  this.showErrorAlert("Erreur Interne du Serveur. Ressayer plus tard")
                }
              })
        }else{
          console.log("HEEEEEEEERE");
          this.setState({isLoading:false})
        }
    }


    loginHandler = async (email,password) => {
      return  LoginService.login(email,password)
    }


    showErrorAlert = (message) => {
        Toast.show({
            type: "warning",
            position: "top",
            text: message,
            duration: 3000
        })
    }
    

    redirectToResetPassword = () => {
      this.props.navigation.navigate("rp")
    }


    render() {
      if(this.state.isLoading) {
        return (
            <View style={styles.view_spinner_container}>
                 <Spinner color="#e53d22"/>                            
            </View>    
        )
     }
      return (
          <View style={styles.view_container}>
            <Root>
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
              <View style={{marginTop:50, marginBottom: 20}}>
                <Form>
                  {/* Email */}
                  <View style={{
                    marginBottom: 20
                    }}>

                      <InputItem
                        clear
                        type="email-address"
                        placeholder="Adresse email"
                        value={this.state.emailValue}
                        error={this.state.emailErrorMessage !== "" ? true : false}
                        onChange={(value) => {
                          if(value && value.length >0) {
                            this.setState({
                              emailValue: value,
                              emailErrorMessage:""
                            })
                          }else{
                            this.setState({
                              emailValue: value,
                            })
                          }
                        }}>
                          <Icon name={"mail"}/>
                      </InputItem>

                      {
                        this.state.emailErrorMessage !== "" && 
                          <Text style={{color: "#e53d22", marginLeft:10, fontSize:13}}>{this.state.emailErrorMessage}</Text>
                      }

                  
                      
                  </View>


                  {/* Password */}
                  <View style={{
                    marginBottom: 20
                    }}>

                      <InputItem
                        clear
                        type="password"
                        placeholder="Mot de passe"
                        value={this.state.passwordValue}
                        error={this.state.passwordErrorMessage !== "" ? true : false}
                        onChange={(value) => {
                          if(value && value.length >0) {
                            this.setState({
                              passwordValue: value,
                              passwordErrorMessage:""
                            })
                          }else{
                            this.setState({
                              passwordValue: value,
                            })
                          }
                        }}>
                          <Icon name={"lock"}/>
                      </InputItem>
                      
                      
                      {
                        this.state.passwordErrorMessage !== "" && 
                          <Text style={{color: "#e53d22", marginLeft:10, fontSize:13}}>{this.state.passwordErrorMessage}</Text>
                      }

{
                      this.state.loginWrongCredentialErrorMessage !== "" && 
                          <Text style={{color: "#e53d22", marginLeft:10, fontSize:13}}>{this.state.loginWrongCredentialErrorMessage}</Text>
                      }

                  </View>


                  <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop:20
                    }}>
                        <Button 
                          onPress={this.onSubmitFormHandler}
                          style={{
                            backgroundColor: "#e53d22",
                            width: 150,
                            textAlign: "center",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}>
                            <Text>Login</Text>
                        </Button>
                  </View>            
                </Form>

                {/* Reset password link */}
                <TouchableOpacity activeOpacity={0.8} onPress={this.redirectToResetPassword}>  
                    <Text style={{
                      fontSize:16,
                      paddingLeft: 10,
                      paddingTop:10
                    }}>Mot de passe oublié..?</Text>
                </TouchableOpacity>
              </View>
            </Root>
          </View>
      )
    }
}


const mapStateToProps = state => {
  return {
      auth: state.auth,
      user: state.user
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
      })
  }
}

export default withNavigation(connect(mapStateToProps,mapDispatchToProps)(LoginPage));
