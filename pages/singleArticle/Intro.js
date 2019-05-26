import React from "react"
import {Banner} from "react-native-paper"
import {View} from "react-native"
const Intro = (props) => {
    return (
        <View style={{paddingLeft: 10, paddingRight: 10,marginTop: 15, marginBottom:15}}>
            <Banner
                visible={true}
                actions={[]}>
                {"Vous etes en train de suivre un article du projet "+props.projectType+" sur la période "+props.period}
            </Banner>
        </View>
    )
}

export default Intro