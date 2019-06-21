import {createAppContainer,createSwitchNavigator} from "react-navigation"
import ResetPasswordPage from "../../pages/resetPassword/resetPassword"
import SetNewPasswordPage from "../../pages/setNewPassword/setNewPassword"
import FirstScreen from "../../pages/firstScreen/firstScreen"
import LoginPage from "../../pages/login/Login"
import MainNavigationDrawer from "./mainNavigation"
import ConfirmCodeResetPasswordPage from "../../pages/confirmCode/confirmCodeResetPassword"

const RootNavigation = createSwitchNavigator({
    Home: { screen: FirstScreen},
    rp: { screen: ResetPasswordPage},
    Login: { screen: LoginPage},
    SetNewPassword: { screen:SetNewPasswordPage},
    drawer: {
        screen: MainNavigationDrawer
    },
    ConfirmCodeResetPasswordPage: {
        screen: ConfirmCodeResetPasswordPage
    }, 
},
{
    initialRouteName:'Home',
    headerMode: "none"
 })

export default createAppContainer(RootNavigation)
