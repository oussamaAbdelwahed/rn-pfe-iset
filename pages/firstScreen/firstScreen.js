import React from "react"
import LoginPage from '../login/Login';
import { isLoggedIn } from "../../utilities/utils"
import MainNavigationDrawer from "../../components/mainNavigation/mainNavigation"
import { AppLoading, Font } from 'expo'
import { Ionicons } from "@expo/vector-icons"
import {withNavigation} from 'react-navigation';
import SetNewPasswordPage from "../setNewPassword/setNewPassword"

class FirstScreen extends React.Component {

    state= {
      fontIsLoaded: true,
      signIn: false
    }
  
    async componentWillMount() {
      const token = await isLoggedIn()
      if(token === null ) {
        this.setState({
          signIn: false
        })
      }else {
        this.setState({
          signIn: true
        })
      }
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        ...Ionicons.font,
      });
      await Font.loadAsync(
        'antoutline',
        // eslint-disable-next-line
        require('@ant-design/icons-react-native/fonts/antoutline.ttf')
      );
      this.setState({fontIsLoaded: false})
    }
  
    render() {
      if (this.state.fontIsLoaded) {
        return (
           <AppLoading/>
        )
      }
  
      if(this.state.signIn === true){
        console.log("Signin")
        return (
            <MainNavigationDrawer/>
        )
  
      }else {
        console.log("Not Signin")
        return <LoginPage/>
      }
  
      
    }
}

export default withNavigation(FirstScreen)