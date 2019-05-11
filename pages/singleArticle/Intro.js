import React from "react"
import { View, Text, Content } from "native-base";


const Intro = (props) => {
    return (
        <View style={{
            marginTop:15,
            marginBottom:20,
            paddingLeft: 10
        }}>
            <Text style={{color:"#0984e3",fontWeight:"bold"}}>{"Vous etes en train de suivre un article du projet "+props.projectType+" sur la période "+props.period}</Text>
        </View>
    )
}

export default Intro