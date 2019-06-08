import React from "react"
import { View, Text, Card, CardItem, Body,Left,Right } from "native-base";
import { StyleSheet } from "react-native"
import Numeral from 'numeral';

class Statistique extends React.Component{
    render() {
        return (
            <View style={styles.container}>
               <Card>
                    <CardItem styles={styles.card_style}>
                        <Body>
                            <Text style={styles.card_text_style}>Utilisateurs</Text>
                            <Text style={styles.card_text_style}>{Numeral(this.props.users).format("0 a")}</Text>
                            <Text style={styles.card_text_style}>({Numeral(this.props.users).format("0,0,0,0")})</Text>
                        </Body>
                    </CardItem>
                </Card>
            
            
                <Card>
                    <CardItem styles={styles.card_style}>
                        <Body>
                            <Text style={styles.card_text_style}>Sessions</Text>
                            <Text style={styles.card_text_style}>{Numeral(this.props.sessions).format("0 a")}</Text>
                            <Text style={styles.card_text_style}>({Numeral(this.props.sessions).format("0,0,0,0")})</Text>
                        </Body>
                    </CardItem>
                </Card>
            

                {this.props.projectType !=="TAR" ? <Card>
                    <CardItem styles={styles.card_style}>
                        <Body>
                            <Text style={styles.card_text_style}>Abonnés actifs</Text>
                            <Text style={styles.card_text_style}>{Numeral(this.props.activeSubs).format('0 a')}</Text>
                        </Body>
                    </CardItem>
                </Card> : null}
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