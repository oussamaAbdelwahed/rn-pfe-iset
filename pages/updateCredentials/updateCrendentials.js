import React from "react"
import { Text, View, Picker } from "native-base"
import {StyleSheet, Platform,StatusBar, Image, ScrollView,TouchableHighlight} from "react-native"
import { Icon, Modal,List, WingBlank,Provider} from '@ant-design/react-native';
import {Row, Col, Form, Label,Item,Input, Toast, Root,Button} from 'native-base';
import Header from "../../components/header/header"
import Countries from "../../assets/countries.json"
import {connect }from "react-redux"
import UserService from "../../shared/UserService"
import { ImagePicker, Permissions} from "expo"
import {ToastAndroid,ActivityIndicator} from 'react-native';
import {BASE_URL} from '../../config/env';
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
        disabledSubmitButton:false
    }

    componentWillMount() {
        UserService.getUserCredentials(this.props.user.userId)
            .then((res) => {
                this.setState({
                    countriesList: [...Countries],
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
                this.showSuccessAlert("Vos informations ont été mises à jour avec succès...!")

                // update project and intervale states
                this.props.UPDATE_USER_PROJECT_TYPE(credentials.defaultSelectedProject)
                this.props.UPDATE_USER_PROJECT_PERIOD(credentials.defaultSelectedProject)
            })
            .catch((err) => {
                this.showErrorAlert("Erreur Interne du Serveur!.Veuillez ressayer plus tard...")
            }).finally(()=>{
                this.setState({disabledSubmitButton:false})
            })

    }

    showSuccessAlert = (message) => {
        Toast.show({
            type: "success",
            position: "top",
            text: message,
            duration: 3000
        })
    }

    showErrorAlert = (message) => {
        Toast.show({
            type: "warning",
            position: "top",
            text: message,
            duration: 3000
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
                }).catch((error)=>{
                 ToastAndroid.show('Une erreur est survenue! réssayer plus tard SVP.', ToastAndroid.SHORT);
                 this.setState({showUploadSpinner:false})   
                })
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
                }).catch((error)=>{
                 ToastAndroid.show('Une erreur est survenue! réssayer plus tard SVP.', ToastAndroid.SHORT);
                 this.setState({showUploadSpinner:false})   
                })
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
                <Root>
                {/* We passe the shouldDisplayLogo, because we dnt want to show project logo in update cred screen */}
                <Header navigation={this.props.navigation} shouldDisplayLogo={true}/>

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
                            <Button disabled={this.state.showUploadSpinner} type="ghost" style={styles.button} onPress={this.showModal}>
                                <Text>Importer une image</Text> 
                                { this.state.showUploadSpinner ? <ActivityIndicator/> : null}   
                            </Button>
                        
                        </View>

                        <Form>
                            <Item stackedLabel>
                                <Label>Prénom :</Label>
                                <Input 
                                    defaultValue={this.state.firstname}
                                    onChangeText={(value) => this.setState({firstname: value})}/>
                            </Item>



                            <Item stackedLabel>
                                <Label>Nom :</Label>
                                <Input 
                                    defaultValue={this.state.lastname}
                                    onChangeText={(value) => this.setState({lastname: value})}/>
                            </Item>



                            <Item stackedLabel>
                                <Label>Pays :</Label>
                                <Picker
                                    mode="dialog"
                                    style={{ width: 300, marginLeft: 5}}
                                    placeholder="Choisir votre pays"
                                    selectedValue={this.state.country}
                                    onValueChange={(value) => this.setState({country: value})}
                                    >

                                    {this.state.countriesList.map((item, key) => {
                                        return <Picker.Item key={key} 
                                            label={item.country} 
                                            value={item.country+"|"+item.abbreviation} 
                                            />
                                    })}
                                </Picker>
                            </Item>


                            <Item stackedLabel>
                                <Label>Projet par defaut :</Label>
                                    <Picker
                                        mode="dialog"
                                        style={{ width: 300, marginLeft: 5}}
                                        selectedValue={this.state.defaultProject}
                                        onValueChange={(value) => this.setState({defaultProject: value})}
                                        >

                                            <Picker.Item label="The Africa Report" value="TAR"/>
                                            <Picker.Item label="Jeune Afrique Business +" value="JAB"/>
                                            <Picker.Item label="Jeune Afrique" value="JA"/>
                                    </Picker>
                            </Item>

                            <Item stackedLabel>
                                <Label>Durée par defaut :</Label>
                                    <Picker
                                        mode="dialog"
                                        style={{ width: 300, marginLeft: 5}}
                                        selectedValue={this.state.defaultPeriod}
                                        onValueChange={(value) => this.setState({defaultPeriod: value})}
                                        >

                                            <Picker.Item label="15 minutes" value="15min"/>
                                            <Picker.Item label="24 heures" value="24h"/>
                                    </Picker>
                            </Item>

                            <Button disabled={this.state.disabledSubmitButton} type="primary" style={styles.button} onPress={(this.handleSubmit)}>
                                <Text style={styles.button_text}>Mettre à jour</Text>
                                {this.state.disabledSubmitButton ? <ActivityIndicator/> : null}
                            </Button>
                        </Form>
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
                        <List renderHeader={()=> {
                            return (
                                <View style={styles.modal_header}>
                                    <Text style={styles.modal_header_text}>Choisir le type</Text>
                                </View>
                            )
                        }}>
                            <List.Item key={1} onPress={this.handlePickPicture.bind(this,"camera")}>                   
                                <View>                                      
                                    <Text style={styles.modal_option_text}>Depuis la caméra</Text>
                                </View>

                            </List.Item>

                            <List.Item key={2} onPress={this.handlePickPicture.bind(this,"picture")}> 
                                <View>                                      
                                    <Text style={styles.modal_option_text}>Depuis la gallerie</Text>
                                </View>
                            </List.Item>
                        </List>
                        </Modal>
                </Provider>
                </Root>
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
            backgroundColor: "#e53d22",
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
      })
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(UpdateCredentials)