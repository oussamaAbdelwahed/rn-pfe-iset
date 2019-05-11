import {createDrawerNavigator, createBottomTabNavigator,createAppContainer,DrawerActions,createStackNavigator, DrawerItems,createSwitchNavigator} from 'react-navigation';
import DashboardPage from "../../pages/dashboard"
import React from "react"
import UpdateCredentials from "../../pages/updateCredentials/updateCrendentials"
import UpdateEmailPage from "../../pages/updateEmail/updateEmail"
import UpdatePasswordPage from "../../pages/updatePassword/updatePassword"
import ConfirmCodePage from "../../pages/confirmCode/confirmCode"
import {Container,Header,Content,Body,Text,Footer} from "native-base"
import {Image,View} from "react-native"
import BigProfileImage from './bigProfilePic/BigProfilePic';
import SmallProfileImage from './smallProfilePic/SmallProfilePic';
import Logout from '../logout/logout';
import Login from '../../pages/login/Login'
import SingleArticleView from '../../pages/singleArticle/SingleArticle';
import ResetPasswordPage from '../../pages/resetPassword/resetPassword';


const MainNavigationDrawer = createDrawerNavigator(
    {
        "Tableau de board": {
            screen: createSwitchNavigator({
                tableaudebord: DashboardPage,
                SingleArticleView: SingleArticleView,
            },{headerMode: "none"}) 
        },
        "Mon profile": {
            screen: UpdateCredentials
        },
        "Modifier adresse email": {
            screen: createStackNavigator({
                updateEmail: UpdateEmailPage,
                confirmCode: ConfirmCodePage
            },{headerMode: "none"})
        },
        "Modifier mot de passe": {
            screen: createStackNavigator({
                updatePassword: UpdatePasswordPage,
                confirmCode: ConfirmCodePage,
                
            },{headerMode: "none"})
        },
        "Déconnection": {
            screen:createSwitchNavigator({Logout:Logout,Login:Login},{headerMode:"none"})
            /*createStackNavigator({
                Logout:Logout,
                //lin:Login,
                //rp:ResetPasswordPage,
            },{headerMode:"none"})*/
        }
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

            <Header style={{width:'100%',height: 200,backgroundColor: "red", marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0}}>
                    {/*<Image 
                        // I used my static image  ==> you can replace it
                        source={require("../../assets/images/amine.jpg")} 
                        style={{height: "100%",width: "100%"}}
                        blurRadius={3}
                    />*/}
                    <BigProfileImage/>
                    
            </Header>
            <View style={{width:"100%",height:200 ,display: "flex",justifyContent: "center",alignItems: "center",position: "absolute",top:0,left: 0}}>
                {/*<Image
                    // I used my static image  ==> you can replace it
                    source={require("../../assets/images/amine.jpg")} 
                    style={{height: 100,width: 100,borderRadius:75}}
                />*/}
                <SmallProfileImage/>
                {/* <Text style={{marginTop:10,fontSize:17,color:"white"}}>{JSON.stringify(props.user)}</Text> */}
            </View>

            <Content>
                    
                <DrawerItems  {...props} onItemPress={async (route)=>{
                    if(route.route.routeName==="Tableau de board") {
                       props.navigation.navigate("tableaudebord");
                    }else{
                       console.log("in router interceptor else close");
                       props.onItemPress(route);
                    }
                }}/>
            </Content>

            <Footer style={{display: "flex",justifyContent:"center", alignItems:"center",backgroundColor:"#f0f2f5"}}>
                <Text style={{fontSize:14}}>Dashboard Editorial ©2019</Text>
            </Footer>
        </Container>
    )
}



export default createAppContainer(MainNavigationDrawer)


