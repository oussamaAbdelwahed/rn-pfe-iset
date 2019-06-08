import React from "react"
import { StyleSheet } from "react-native"
import { Picker, Form, Icon, View, Label} from "native-base"
import { connect } from "react-redux"
import {getParsedToken} from '../../utilities/utils';


const token = getParsedToken();

class Select extends React.PureComponent {

    render() {
        return (
            <View>
                <Form style={{
                    paddingLeft: 10,
                    marginTop:15
                }}>
                    <Label style={{
                        fontSize: 15
                    }}>Sélectionner le projet :</Label>
                    <Picker 
                        mode="dialog"
                        selectedValue={this.props.project.projectType}
                        onValueChange={this.selectedProjectHandler.bind(this)}
                        
                        style={{
                            width: 270,
                            marginBottom:10,
                            color: "grey"
                        }}
                    >
                        <Picker.Item label="Jeune Afrique" value="JA"/> 
                        <Picker.Item label="Jeune Afrique Business+ " value="JAB"/>
                        <Picker.Item label="The Africa Reports" value="TAR"/>
                    </Picker>

                    <Label style={{
                        fontSize: 15
                    }}>Sélectionner la période :</Label>
                    <Picker 
                        mode="dialog"
                        selectedValue={this.props.project.projectIntervale}
                        onValueChange={this.selectedIntervalHandler.bind(this)}
                        style={{
                            width: 270,
                            marginBottom:15,
                            color: "grey"
                        }}
                     >
                        <Picker.Item label="15 minutes" value="15min"/> 
                        <Picker.Item label="24 heures" value="24h"/>
                    </Picker>
                </Form>
            </View>
        )
    }

     selectedProjectHandler =  async (value) => {
        this.props.UPDATE_PROJECT_TYPE(value);
        this.props.changingProject(null,value,this.props.project.projectIntervale); 
    }

    selectedIntervalHandler = (value) => {
        this.props.UPDATE_PROJECT_INTERVALE(value);
        this.props.changingInterval(this.props.project.projectType,value);
    }
}


const styles = StyleSheet.create({
    select_view_container: {
        paddingTop: 10,
        paddingBottom:30
    },
})

const mapStateToProps = (state) => {
    return {
        project: state.project
    }
}

const mapDispatchToProps = dispatch => {
    return {
        UPDATE_PROJECT_TYPE: (value) => dispatch({
            type: "UPDATE_PROJECT_TYPE",
            value
        }),
        UPDATE_PROJECT_INTERVALE: (value) => dispatch({
            type: "UPDATE_PROJECT_INTERVALE",
            value
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Select)