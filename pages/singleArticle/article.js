import React from "react"
import { Card, CardItem, Body, Text, Content,Left } from "native-base";
import { AntDesign } from "@expo/vector-icons"
import { Image,View} from "react-native"
import {connect} from 'react-redux';
import { Grid, Col} from "react-native-easy-grid"
import PVLineChart from '../../components/pv-line-chart/PVLineChart';
import VisitorsBarChart from '../../components/visitors-bar-chart/VisitorsBarChart';
import {mustShowPageViewsVisualEffect,mustShowNbrSalesVisualEffect} from '../../business-logic/audience-indicator';

class Article extends React.Component {

    state = {
        isNull:null,
        isAudWinner:null,
        newAudiencePer:null,
        isSelectsChanged:0,
        mustShowNbrSalesVE:false,
        mustShowNbrPageViewsVE:false,
        nbrPageViews:0,
        nbrSales:0
    }

    shouldComponentUpdate() {
        return true;
    }

    static getNewAudiencePercentage(initialNbr,nextNbr,roundRate)  {
        const diff = nextNbr - initialNbr;
        return ((diff / initialNbr) * 100).toFixed(roundRate);
    };


    static getDerivedStateFromProps(nextProps,prevState){
        let newAudiencePer=null;
        let isAudWinner=null;
        let b1=false;
        let b2=false;
        if(!nextProps.isFirstTime && prevState.isNull !== null){ 
           b1 = mustShowPageViewsVisualEffect(prevState.nbrPageViews,nextProps.indicators.nbrPageViews);
           b2 = mustShowNbrSalesVisualEffect(prevState.nbrSales,nextProps.indicators.nbrSales);
           newAudiencePer = +Article.getNewAudiencePercentage(+prevState.nbrPageViews,+nextProps.indicators.nbrPageViews,2);
           isAudWinner = (prevState.nbrPageViews > nextProps.indicators.nbrPageViews) ? false: true;    
        }
        return {
            isAudWinner:isAudWinner,
            newAudiencePer:newAudiencePer,
            isSelectsChanged:nextProps.isSelectsChanged,
            mustShowNbrPageViewsVE:b1,
            mustShowNbrSalesVE:b2,
            nbrPageViews: nextProps.indicators.nbrPageViews,
            nbrSales: nextProps.indicators.nbrSales,
            isNull:"notNull"
        }; 
    }

    render() {
        return (
            <Content padder>
                <Card style={{marginBottom:20}}>

                {this.state.mustShowNbrPageViewsVE ?
                    <CardItem header bordered>
                        <Left>
                            <Body>
                                <AntDesign name={this.state.isAudWinner ? "up" : "down"} size={16} color={this.state.isAudWinner ? "green" : "red"} />
                                        
                                    { this.state.isAudWinner!==null ? <View><Text
                                    style={{
                                        fontSize: 16,
                                        color: this.state.isAudWinner ? "green" : "red",
                                                
                                    }} note>{this.state.newAudiencePer} {" %"} 
                                    <Text style={{fontSize:13}}> (Nombre de pages vues)</Text>
                                    </Text>
                                            
                                    </View> : null}
                               </Body>
                         </Left>
                    </CardItem>
                  : null
                }

                    <CardItem cardBody bordered>
                        <Image source={{uri: this.props.article.image_url }} 
                            style={{height: 200, width: null, flex: 1}}/>
                    </CardItem>

                    <CardItem cardBody style={{
                        padding:10
                    }}>
                        <Body>
                            <Text style={{
                                fontWeight: "500",
                                fontSize: 16,
                                paddingTop: 10,
                                paddingBottom: 10,
                                }}>{this.props.article.title}</Text>
                        </Body>
                    </CardItem>


                    <CardItem cardBody style={{
                        padding:10
                    }}>
                        <Body>
                            <Text style={{
                                paddingBottom: 20,
                                fontSize: 14,
                                color: "#95a5a6"
                                }}>{this.props.article.content}</Text>
                        </Body>
                    </CardItem>

                    <CardItem footer bordered>
                        <Body style={{
                            paddingBottom:5
                        }}> 
                            <Grid>
                                <Col style={{backgroundColor : this.props.article.projectType !== "TAR" && this.state.mustShowNbrSalesVE ? "green" : "white"}}>
                                    {this.props.article.projectType==="JA"?<Text style={{textAlign:"center",fontSize: 15,color:this.state.mustShowNbrSalesVE ? "white" : "black"}}>Ventes</Text>:<Text></Text>}
                                    {this.props.article.projectType==="JA"?<Text style={{textAlign:"center",fontSize: 13,color:this.state.mustShowNbrSalesVE ? "white" : "black"}}>{this.state.nbrSales}</Text>:<Text></Text>}
                                </Col>
                                    
                                <Col>
                                    <Text style={{textAlign:"center",fontSize: 15}}>Pages vues</Text>
                                    <Text style={{textAlign:"center",fontSize: 13}}>{this.state.nbrPageViews}</Text>
                                </Col>

                                <Col>
                                    <Text style={{textAlign:"center",fontSize: 15}}>Publié en</Text>
                                    <Text style={{textAlign:"center",fontSize: 13}}>{this.props.article.published_at}</Text>
                                </Col>
                            </Grid>
                        </Body>
                    </CardItem> 
            </Card>
            <Card>
                <Text style={{marginBottom:30,fontWeight:"bold",fontSize:30,textAlign:"center",color:"#ff7675"}}>Statistiques dernières 24 heures</Text>
                {this.props.lineChartData && this.props.lineChartData.length > 0 ? <Text style={{marginBottom:10,fontWeight:"bold",fontSize:15,textAlign:"center"}}>Nombre des pages vues</Text> : null}
                <PVLineChart lineChartData={this.props.lineChartData}/>
                {this.props.geoMapData && this.props.geoMapData.length > 0 ? <Text style={{marginBottom:10,fontWeight:"bold",fontSize:15,textAlign:"center"}}>Nombre des visiteurs par pays</Text> : null}
                <VisitorsBarChart geoMapData={this.props.geoMapData} />
            </Card>
        </Content>
        )
    }

}


const mapStateToProps = state => {
    return {
        article: state.article
    }
}


export default connect(mapStateToProps)(Article)