import React from "react"
import {createStackNavigator,createAppContainer,createSwitchNavigator} from "react-navigation"
import ResetPasswordPage from "../../pages/resetPassword/resetPassword"
import SetNewPasswordPage from "../../pages/setNewPassword/setNewPassword"
import FirstScreen from "../../pages/firstScreen/firstScreen"
import LoginPage from "../../pages/login/Login"
import MainNavigationDrawer from "./mainNavigation"

const RootNavigation = createSwitchNavigator({
    //SingleArticleView: { screen: SingleArticleView},
    Home: { screen: FirstScreen},
    rp: { screen: ResetPasswordPage},
    // Dashboard: { screen: DashboardPage},
    Login: { screen: LoginPage},
    // UpdateCredentials: { screen: UpdateCredentials},
    //ResetPassword: { screen:ResetPasswordPage},
    // ConfirmCode: { screen: ConfirmCodePage},
    // UpdateEmail: { screen:UpdateEmailPage },
    // UpdatePassword: { screen: UpdatePasswordPage},
    SetNewPassword: { screen:SetNewPasswordPage},
    drawer: {
        screen: MainNavigationDrawer
    },
    
},
{
    initialRouteName:'Home',
    headerMode: "none"
 })

export default createAppContainer(RootNavigation)
