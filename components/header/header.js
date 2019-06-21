import React from "react"
import { connect } from "react-redux"
import { StyleSheet ,Image} from "react-native"
import LogoJA from "./logoJA"
import LogoJAB from "./logoJab"


import { View } from "native-base";
import {  Ionicons } from "@expo/vector-icons"
import { withNavigation } from 'react-navigation';

class Header extends React.PureComponent {
    renderLogoProjet = () => {
        if(this.props.project.projectType === "JA" && this.props.shouldDisplayLogo === true) {
            return <LogoJA/>
        }

        if(this.props.project.projectType === "JAB" && this.props.shouldDisplayLogo === true) {
            return <LogoJAB/>
        }

        if(this.props.project.projectType === "TAR" && this.props.shouldDisplayLogo === true) {
            return  <Image style={styles.tarJpgLogo} source={require("./tar.jpg")}/>
        }

        if(this.props.shouldDisplayLogo === false)
            return <View></View>
    }


    render() {
        return (
            <View  style={styles.header_view_container}>
                <View style={styles.md_menu}>
                    <Ionicons name="md-menu" size={32} onPress={() => this.props.navigation.toggleLeftDrawer()}/>
                </View>

                <View>
                    {
                        this.renderLogoProjet()
                    }
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    header_view_container: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        backgroundColor: "#ecf0f1",
        height: 50
    },

    md_menu: {
        position: "absolute",
        left:10,
        top:5
    },
    md_menu_right: {
        position: "absolute",
        right:10,
        top:5
    },
    tarJpgLogo: {
        width: 220,
        height: 35,
        margin:"auto"
    }
})


const mapStateToProps = (state) => {
    return {
        project: state.project
    }
}



export default withNavigation(connect(mapStateToProps)(Header))
