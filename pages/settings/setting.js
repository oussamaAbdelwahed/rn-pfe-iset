import React from "react"
import {View, StyleSheet,Platform,StatusBar} from "react-native"
import Header from "../../components/header/header"
import { connect } from "react-redux"
import {withNavigation} from "react-navigation"
import {List, Subheading,Headline,Button} from "react-native-paper"
import {Ionicons} from "@expo/vector-icons"
import { SecureStore } from "expo"



class SettingPage extends React.Component{
    state= {
        isLoading: false
    }
    logout = () => {
        console.log("logout")
        this.setState({isLoading: true})
        SecureStore.deleteItemAsync("authToken").then(()=>{
            this.setState({isLoading: false})
            this.props.navigation.navigate("Login")
        })
    }

    render() {
        return (
            <View style={styles.view_container}> 
                <Header project={this.props.project.projectType} navigation={this.props.navigation} shouldDisplayLogo={true}/>

                <View style={{paddingLeft: 10, paddingRight:10, marginTop: 20, marginBottom: 10}}>
                    <Headline style={{color: "#1d2129", fontSize: 20}}>Parametres du compte</Headline>
                    <Subheading style={{color: "#606770", fontSize: 14}}> Gérez votre compte en général.</Subheading>


                </View>
               

                <List.Item 
                    title="Informations personnelles"
                    description="Mettez à jour votre nom, votre projet par defaut, votre durée par defaut et votre photo de profile"
                    left={props => <Ionicons name="ios-contact" size={50} color="#1d2129"/>}
                    onPress={()=> this.props.navigation.navigate("profile")}/>


                <List.Item 
                    title="Adresse email"
                    description="Mettez à jour votre adresse email"
                    left={props => <Ionicons name="ios-mail" size={50} color="#1d2129"/>}
                    onPress={()=> this.props.navigation.navigate("UpdateEmail")}/>



                <List.Item  
                    title="Securité"
                    description="Mettez à jour votre mot de passe"
                    left={props => <Ionicons name="ios-lock" size={50} color="#1d2129"/>}
                    onPress={()=> this.props.navigation.navigate("UpdatePassword")}
                    titleStyle={{paddingLeft:10}}
                    descriptionStyle={{paddingLeft: 10}}/>

                <View>
                    <Button 
                        mode="text"
                        onPress={this.logout}
                        loading={this.state.isLoading}
                        disabled={this.state.isLoading}>
                        Se déconnecter
                    </Button>
                </View>
                
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
    }
})

const mapStateToProps = state => {
    return {
        project: state.project
    }
}
export default withNavigation(connect(mapStateToProps)(SettingPage))