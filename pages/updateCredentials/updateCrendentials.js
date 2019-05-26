import React from "react"
import { Text, View } from "native-base"
import {StyleSheet, Platform,StatusBar, Image, ScrollView, Keyboard} from "react-native"
import { Modal,Provider} from '@ant-design/react-native';
import Header from "../../components/header/header"
import {connect }from "react-redux"
import UserService from "../../shared/UserService"
import { ImagePicker, Permissions} from "expo"
import {Picker} from 'react-native';
import {BASE_URL} from '../../config/env';
import {Button,TextInput,Snackbar,List, Banner} from "react-native-paper"
import axios from "axios"
class UpdateCredentials extends React.Component {

    state = {
        countriesList: [],
        firstname: "",
        lastname: "",
        country: "",
        defaultProject: "",
        defaultPeriod: "",
        imageProfile: "",
        showModalChoose: false,
        showUploadSpinner:false,
        disabledSubmitButton:false,
        errorNetwork: false,
        successResponse: false
    }

    componentWillMount() {
        //get all countries
        axios.get("https://restcountries.eu/rest/v2/all")
            .then(res => this.setState({countriesList: res.data}))
    




        UserService.getUserCredentials(this.props.user.userId)
            .then((res) => {
                this.setState({
                    firstname: res.firstname,
                    lastname: res.lastname,
                    country: res.country,
                    defaultProject: res.default_project,
                    defaultPeriod: res.default_period,
                    imageProfile: res.image_url
                })
            })
            .catch((err) => console.log(err))
        
    }

    handleSubmit =  () => {
        this.setState({disabledSubmitButton:true})
        const credentials  = {
            id: this.props.user.userId,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            defaultSelectedProject: this.state.defaultProject,
            defaultSelectedPeriod: this.state.defaultPeriod,
            country: this.state.country
       }

       
       UserService.updateProfileCredentials(credentials)
            .then((res) => {
                //this.showSuccessAlert("Vos informations ont été mises à jour avec succès...!")
                this.setState({successResponse: true})

                // update project and intervale states
                this.props.UPDATE_USER_PROJECT_TYPE(credentials.defaultSelectedProject)
                this.props.UPDATE_USER_PROJECT_PERIOD(credentials.defaultSelectedProject)


                //update user state
                this.props.UPDATE_USER_LASTNAME(credentials.lastname)
                this.props.UPDATE_USER_FIRSTNAME(credentials.firstname)

            })
            .catch((err) => {
                //this.showErrorAlert("Erreur Interne du Serveur!.Veuillez ressayer plus tard...")
                this.setState({
                    errorNetwork: true
                })
            }).finally(()=>{
                this.setState({disabledSubmitButton:false})
                Keyboard.dismiss()
            })

    }

    handlePickPicture = async (type) => {
        await this.askPermissionsAsync()
        if(type === "camera") {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                
            })

            if(!result.cancelled) {
                this.setState({showUploadSpinner:true})
                const oldPicName= this.state.imageProfile.substr(this.state.imageProfile.lastIndexOf("/")+1);

                UserService.changeProfilePicture(result,oldPicName,this.props.user.userId).then((data)=>{
                  this.setState({imageProfile: data.data.image,showUploadSpinner:false});
                  this.props.UPDATE_USER_PROFILE_PICTURE({bigImageUrl:data.data.image,minImageUrl:data.data.imageMin})
                })
                .catch((error)=>{
                    this.setState({errorNetwork: true})
                    this.setState({showUploadSpinner:false})   
                })
                .finally(() => Keyboard.dismiss())
            }
        }else {
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                mediaTypes: "Images"
            })
            if(!result.cancelled) {
                this.setState({showUploadSpinner:true})
                const oldPicName= this.state.imageProfile.substr(this.state.imageProfile.lastIndexOf("/")+1);

                UserService.changeProfilePicture(result,oldPicName,this.props.user.userId).then((data)=>{
                 this.setState({imageProfile: data.data.image,showUploadSpinner:false});
                  this.props.UPDATE_USER_PROFILE_PICTURE({bigImageUrl:data.data.image,minImageUrl:data.data.imageMin})
                })
                .catch((error)=>{
                    this.setState({errorNetwork: true})
                    this.setState({showUploadSpinner:false})   
                })
                .finally(() => Keyboard.dismiss())
            }
        }

        this.closeModal()
    }

    showModal = () => {
        this.setState({
            showModalChoose: true
        })
    }

    closeModal = () => {
        console.log("close")
        this.setState({
            showModalChoose: false
        })
    }


    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA)
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
    }

    render() {
       return(
            <View style={styles.view_container}>
                {/* We passe the shouldDisplayLogo, because we dnt want to show project logo in update cred screen */}
                <Header navigation={this.props.navigation} shouldDisplayLogo={true}/>


                {/* banner for default password */}
                <View style={{paddingLeft: 10,paddingRight:10}}>
                    <Banner
                        visible={this.props.user.isDefaultPwd === 1}
                        actions={[]}>
                        Votre mot de passe a été généré par l'admininstrateur.
                        Veuillez le changer pour etre en toute sécurité !
                    </Banner>
                </View>


                <ScrollView>
                    {/* Form */}
                    <View style={styles.form_container}>
                        {/* Title */}
                        <View>
                            <Text style={styles.header_title}>Mon profile</Text>
                        </View>

                        {/* Image profile */}
                        <View style={{marginBottom: 30}}>
                            <Image
                                style={{width: 150, height: 150}} 
                                source={{uri: BASE_URL+this.state.imageProfile}}/>

                            {/* Add btn upload */}
                            <Button 
                                disabled={this.state.showUploadSpinner} 
                                mode="text"
                                onPress={this.showModal}
                                loading={this.state.showUploadSpinner}>
                                Importer une image
                            </Button>
                        
                        </View>

                        <TextInput 
                            value={this.state.firstname}
                            onChangeText={(value) => this.setState({firstname: value})}
                            mode="outlined"
                            label="Prenom"
                        />

                        <TextInput 
                            value={this.state.lastname}
                            onChangeText={(value) => this.setState({lastname: value})}
                            mode="outlined"
                            label="Nom"
                        />


                        <View>
                            <Picker
      
                                selectedValue={this.state.country}
                                onValueChange={(value) => this.setState({country: value})}
                                >

                                {this.state.countriesList.map((item, key) => {
                                    return <Picker.Item key={key} 
                                        label={item.name} 
                                        value={item.name+"|"+item.alpha2Code} 
                                        />
                                })}
                            </Picker>
                        </View>


                        <View>
                                <Picker
                                    selectedValue={this.state.defaultProject}
                                    onValueChange={(value) => this.setState({defaultProject: value})}
                                    >

                                    <Picker.Item label="The Africa Report" value="TAR"/>
                                    <Picker.Item label="Jeune Afrique Business +" value="JAB"/>
                                    <Picker.Item label="Jeune Afrique" value="JA"/>
                                </Picker>
                        </View>

                        <View>
                                <Picker
                                    selectedValue={this.state.defaultPeriod}
                                    onValueChange={(value) => this.setState({defaultPeriod: value})}
                                    >

                                    <Picker.Item label="15 minutes" value="15min"/>
                                    <Picker.Item label="24 heures" value="24h"/>
                                </Picker>
                        </View>

                        <Button 
                            disabled={this.state.disabledSubmitButton} 
                            mode="contained"
                            style={{marginTop:10}} 
                            onPress={(this.handleSubmit)}
                            loading={this.state.disabledSubmitButton}>
                            Mettre à jour
                        </Button>
                    </View>
                </ScrollView>

                <Provider>
                    {/* Modal */}
                    <Modal 
                        visible={this.state.showModalChoose}
                        popup
                        onClose={this.closeModal}
                        animationType="slide-up"
                        closable={true}
                        maskClosable={true}
                        >


                                <List.Item 
                                    key={1} 
                                    onPress={this.handlePickPicture.bind(this,"camera")}
                                    title="Depuis la caméra"
                                    left={props => <List.Icon {...props} icon="add-a-photo"/>} 
                                />
                                <List.Item 
                                    key={2} 
                                    onPress={this.handlePickPicture.bind(this,"picture")}
                                    title="Depuis la gallerie"
                                    left={props => <List.Icon {...props} icon="camera"/>} 
                                />
                        </Modal>
                </Provider>

                {/* Error snackbar */}
                <Snackbar
                    visible={this.state.errorNetwork}
                    onDismiss={() => this.setState({errorNetwork: false})}
                    duration={3000}
                    style={{backgroundColor: "#e74c3c"}}>
                        Erreur Interne du Serveur!.Veuillez ressayer plus tard...
                </Snackbar>


                {/* Success snackbar */}
                <Snackbar
                    visible={this.state.successResponse}
                    onDismiss={() => this.setState({successResponse: false})}
                    duration={3000}
                    style={{backgroundColor: "#27ae60"}}>
                        Vos informations ont été mises à jour avec succès...!
                </Snackbar>
            </View>
       ) 
       
    }
}

const styles = StyleSheet.create(
    {
        view_container: {
            ...Platform.select({
                android: {
                    marginTop: StatusBar.currentHeight // android phones have issues with StatusBar overlap
                }
            }),
            flex: 1
        },

        form_container: {
            padding: 10
        },

        header_title: {
            fontSize: 20,
            textAlign: "center",
            marginBottom: 10,
            fontWeight:"bold"
        },

        button: {
            marginTop: 10,
            width: 150,
            textAlign: "center",
            flexDirection: "row",
           justifyContent: "center",
        },
        button_text: {
            color: "white",
        },
        view_image_container: {
            width:200,
            height:200
        },
        modal_header: {
            padding: 10
        },
        modal_header_text: {
            fontSize: 20
        },
        modal_option_text: {
            fontSize:16
        }
    }
)

const mapStateToProps = state => {
    return {
        user: state.user,
        project: state.project
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      UPDATE_USER_PROJECT_TYPE: (value) => dispatch({
        type: "UPDATE_USER_PROJECT_TYPE",
        value
      }),
      UPDATE_USER_PROJECT_PERIOD: (value) => dispatch({
        type: "UPDATE_USER_PROJECT_PERIOD",
        value
      }),
      UPDATE_USER_PROFILE_PICTURE: (value) => dispatch({
        type: "UPDATE_USER_PROFILE_PICTURE",
        value
      }),
      UPDATE_USER_LASTNAME: (value) => dispatch({
          type: "UPDATE_USER_LASTNAME",
          value
      }),
      UPDATE_USER_FIRSTNAME: (value) => dispatch({
        type: "UPDATE_USER_FIRSTNAME",
        value
    })
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(UpdateCredentials)