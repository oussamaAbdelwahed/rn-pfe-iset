import React from "react"
import { View, Card, CardItem, Body, Text } from "native-base";
import { StyleSheet } from "react-native"
import Numeral from 'numeral';

class Statistique extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Card>
                    <CardItem styles={styles.card_style}>
                        <Body>
                            <Text style={[styles.card_text_style,{fontSize: 14}]}>Visiteurs dernières 24 heures</Text>
                            <Text style={styles.card_text_style}>{Numeral(this.props.traffic.users).format("0 a")}</Text>
                            <Text style={styles.card_text_style}>({Numeral(this.props.traffic.users).format("0 a")})</Text>
                        </Body>
                    </CardItem>
                </Card>
            
            
                <Card>
                    <CardItem styles={styles.card_style}>
                        <Body>
                            <Text style={[styles.card_text_style,{fontSize: 14}]}>Sessions dernières 24 heures</Text>
                            <Text style={styles.card_text_style}>{Numeral(this.props.traffic.sessions).format("0 a")}</Text>
                            <Text style={styles.card_text_style}>({Numeral(this.props.traffic.sessions).format("0,0,0,0")})</Text>
                        </Body>
                    </CardItem>
                </Card>
            

            {this.props.projectType !== "TAR" ? 
                <Card>
                    <CardItem styles={styles.card_style}>
                        <Body>
                            <Text style={styles.card_text_style}>Abonnés actifs en temps réel</Text>
                            <Text style={styles.card_text_style}>{Numeral(this.props.traffic.activeSubscribers).format("0 a")}</Text>
                        </Body>
                    </CardItem>
                </Card> 
            : null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: 250,
        alignSelf: "center"
    },
    card_style:{
        padding:10  
    },
    card_text_style: {
        alignSelf: "center"
    }
})


export default Statistique