import React , {Component} from 'react';
import { View,Text,Switch } from "react-native"
import { Icon, Button, InputItem,List} from '@ant-design/react-native';
import {Row, Col} from 'native-base';
import styles from './styles';
import LoginService from '../../shared/LoginService';
import {validateAddUserForm} from '../../utilities/utils';
import Header from "../../components/header/header"

class AddUser extends Component {
    state= {
        isLoading:false,
        errorMessage:"",
        fontIsLoaded: true,
        fnHasError:false,
        lnHasError:false,
        emailHasError:false,
        pwdHasError:false,
        confPwdHasError:false,
        firstname:'',
        lastname:'',
        email:'',
        password:'',
        confirmPassword:'',
        isAdmin:false
   }
    
   onSubmitForm = async () => {
      let res = validateAddUserForm(this);
      if(res) {
        const user = {
            firstname:this.state.firstname,
            lastname:this.state.lastname,
            email:this.state.email,
            password:this.state.password,
            isAdmin:this.state.isAdmin
        };
         this.setState({isLoading:true});
         res = await LoginService.addUser(user);
         if(res.data.addUser) {
            this.setState({isLoading:false});
            this.props.navigation.navigate('Dashboard');
         }else{
           this.setState({errorMessage:"utilisateur non ajouté, ressayer",isLoading:false});
         }
     } 
    }


    render() {
        return (
          <View style={styles.view_container}>

            {/* We passe the shouldDisplayLogo, because we dnt want to show project logo in addUser screen */}
            <Header navigation={this.props.navigation} shouldDisplayLogo={false}/>


            <View style={styles.title_container}>
              <Text style={styles.title}>Ajouter un utilisateur</Text>
            </View>
            
            <View style={styles.form_item_margin}>
                <InputItem
                error={this.state.fnHasError}
                clear
                onErrorClick={()=>{alert("Entrer un prénom")}}
                value={this.state.firstname}
                onChange={(value) => this.setState({firstname:value})}
                placeholder="Prénom"
                style={{fontSize: 15}}>

                <Icon name={"edit"}/>
            </InputItem>
            </View>

            <View style={styles.form_item_margin}>
                <InputItem   
                    error={this.state.lnHasError}           
                    clear
                    onErrorClick={()=>{alert("Entrer un nom")}}
                    value={this.state.lastname}
                    onChange={(value) => this.setState({lastname:value})}
                    placeholder="Nom"
                    style={{fontSize: 15}}>
                   <Icon name={"edit"}/>
                </InputItem>
            </View>  

            <View style={styles.form_item_margin}>
                <InputItem 
                    error={this.state.emailHasError}         
                    clear
                    onErrorClick={()=>{alert("Entrer une adresse email valide")}}
                    type="email-address"
                    value={this.state.email}
                    onChange={(value) => this.setState({email:value})}
                    placeholder="Adresse email">
                   <Icon name={"mail"}/>
                </InputItem>
            </View>  


            <View style={styles.form_item_margin}>
                <InputItem              
                    clear
                    error={this.state.pwdHasError}  
                    type={"password"}
                    onErrorClick={()=>{alert("Entrer un mot de passe valide(7 caracteres minimum)")}}
                    value={this.state.password}
                    onChange={(value) => this.setState({password:value})}
                    placeholder="Mot de passe (7 caractéres au minimum)"
                    style={{fontSize: 15}}>
                   <Icon name={"lock"}/>
                </InputItem>
            </View> 

            <View style={styles.form_item_margin}>
                <InputItem                 
                    type="password"
                    error={this.state.confPwdHasError}  
                    onErrorClick={()=>{alert("Les deux mot de passes doivent etres identiques")}}
                    clear
                    value={this.state.confirmPassword}
                    onChange={(value) => this.setState({confirmPassword: value})}
                    placeholder="Confirmer mot de passe"
                    style={{fontSize: 15}}>
                   <Icon name={"lock"}/>
                </InputItem>
            </View> 


            <View style={styles.view_admin_switch}>
                <Row>
                    <Col >
                        <Text style={styles.label_admin}>Admin: </Text>
                    </Col>

                    <Col>
                        <Switch
                            onValueChange={(value)=> this.setState({isAdmin: value})}  
                            value={this.state.isAdmin} 
                        />
                    </Col>
                </Row>
            </View>  


            <View style={styles.submit_button}>
                <Button
                  type="primary"
                  style={styles.button}
                  onPress={this.onSubmitForm}>
                   Ajouter
                </Button>
            </View>


            {this.state.errorMessage.length > 0 ? 
                <View>
                   <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                </View>
             :null}   
          </View>
        );
    }
 
}
export default AddUser;