import {createDrawerNavigator, createBottomTabNavigator,createAppContainer,DrawerActions,createStackNavigator, DrawerItems,createSwitchNavigator} from 'react-navigation';
import DashboardPage from "../../pages/dashboard"
import React from "react"
import SettingPage from "../../pages/settings/setting"
import {Container,Header,Content,Text,Footer} from "native-base"
import BigProfileImage from './bigProfilePic/BigProfilePic';
import SmallProfileImage from './smallProfilePic/SmallProfilePic';
import Logout from '../logout/logout';
import SingleArticleView from '../../pages/singleArticle/SingleArticle';
import UpdateCredentialsPage from "../../pages/updateCredentials/updateCrendentials"
import UpdateEmailPage from "../../pages/updateEmail/updateEmail"
import UpdatePasswordPage from "../../pages/updatePassword/updatePassword"
import ConfirmCode from "../../pages/confirmCode/confirmCode"


const MainNavigationDrawer = createDrawerNavigator(
    {
        "Tableau de board": {
            screen: createSwitchNavigator({
                tableaudebord: DashboardPage,
                SingleArticleView: SingleArticleView,
            },{headerMode: "none"}) 
        },
        "Parametres": {
            screen: createStackNavigator({
                setting: SettingPage,
                profile: UpdateCredentialsPage,
                UpdateEmail: UpdateEmailPage,
                UpdatePassword: UpdatePasswordPage,
                confirmCode: ConfirmCode
            },{headerMode: "none"})
        },
        // "Mon profile": {
        //     screen: UpdateCredentials
        // },
        // "Modifier adresse email": {
        //     screen: createStackNavigator({
        //         updateEmail: UpdateEmailPage,
        //         confirmCode: ConfirmCodePage
        //     },{headerMode: "none"})
        // },
        // "Modifier mot de passe": {
        //     screen: createStackNavigator({
        //         updatePassword: UpdatePasswordPage,
        //         confirmCode: ConfirmCodePage,
                
        //     },{headerMode: "none"})
        // },
        // "Déconnection": {
        //     screen:createSwitchNavigator({Logout:Logout,Login:Login},{headerMode:"none"})
        //     /*createStackNavigator({
        //         Logout:Logout,
        //         //lin:Login,
        //         //rp:ResetPasswordPage,
        //     },{headerMode:"none"})*/
        // }
    },
    {
        drawerPosition: "left",
        getCustomActionCreators: (route, stateKey) => {
            return {
              toggleLeftDrawer: () => DrawerActions.toggleDrawer({ key: stateKey }),
            };
        },

        gesturesEnabled: false,
        contentComponent: (props) => customDrawerContent(props),
        drawerOpenRoute: "DrawerOpen",
        drawerCloseRoute: "DrawerClose",
        drawerToggleRoute: "DrawerToggle",
    }
)





const customDrawerContent = (props) => {
    props.onItemPress = this.onItemPre;
    return (
        <Container style={{width: '100%', marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0}} >

            <Header style={{width:'100%',height: 200,marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0}}>
                    <BigProfileImage/>
                    
            </Header>
            <SmallProfileImage/>

            <Content>
                    
                <DrawerItems  {...props} onItemPress={async (route)=>{
                    if(route.route.routeName==="Tableau de board") {
                       props.navigation.navigate("tableaudebord");
                    }else{
                       console.log("in router interceptor else close");
                       props.onItemPress(route);
                    }
                }}/>
                {/* <Button mode="text">Logout</Button> */}
                {/* <TouchableOpacity style={{height:50}}><Text style={{fontSize:13, marginLeft:16}}>Logout</Text></TouchableOpacity> */}
                
            </Content>

            <Footer style={{display: "flex",justifyContent:"center", alignItems:"center",backgroundColor:"#f0f2f5"}}>
                <Text style={{fontSize:14}}>Dashboard Editorial ©2019</Text>
            </Footer>
        </Container>
    )
}



export default createAppContainer(MainNavigationDrawer)


