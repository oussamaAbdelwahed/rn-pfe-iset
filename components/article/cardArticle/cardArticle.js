import React from "react"
import { Card, CardItem, Text, Left, Body } from 'native-base';
import { Image, Animated,View, TouchableOpacity,Button } from "react-native" 
import { AntDesign } from "@expo/vector-icons"
import { Grid, Col} from "react-native-easy-grid"
import { connect } from "react-redux"
import {mustShowPageViewsVisualEffect,mustShowNbrSalesVisualEffect} from '../../../business-logic/audience-indicator';
import  {withNavigation} from 'react-navigation';
class CardArticle extends React.Component {

    state = {
        article:null,
        isAudWinner:null,
        newAudiencePer:null,
        isSelectsChanged:0,
        mustShowNbrSalesVE:false,
        mustShowNbrPageViewsVE:false,
        opacity: new Animated.Value(0)
    };

    componentDidMount = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration:700,
            useNativeDriver: true
        }).start()
    }

    onPressShowMoreBtn = (e) => {
        console.log("here***0");
        const obj = {
            published_at:this.props.article.published_at,
            projectType: this.props.project.projectType,
            title: this.props.article.title,
            content: this.props.article.description,
            pages_views:this.props.article.pages_views,
            nbr_sales:this.props.article.nbr_ventes,
            image_url: this.props.article.image_url || "https://images.unsplash.com/photo-1552796220-db7b4c3824a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
        };
        this.props.UPDATE_ARTICLE_META(obj)
        //const pushAction = StackActions.push({routeName:"SingleArticleView",params:{articleId:this.props.article.id,projectIntervale:this.props.project.projectIntervale}});
        //this.props.navigation.dispatch(pushAction);
        
        this.props.navigation.navigate("SingleArticleView",{articleId:this.props.article.id,projectIntervale:this.props.project.projectIntervale})
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
        if(nextProps.isSelectsChanged === prevState.isSelectsChanged){ 
            //donc on n a pas changer de selects et un nouveau refrech a eu lieu
            if(prevState.article !== null) {
               b1 = mustShowPageViewsVisualEffect(prevState.article.pages_views,nextProps.article.pages_views);
               b2 = mustShowNbrSalesVisualEffect(prevState.article.nbr_ventes,nextProps.article.nbr_ventes);
               newAudiencePer = +CardArticle.getNewAudiencePercentage(+prevState.article.pages_views,+nextProps.article.pages_views,2);
               isAudWinner = (prevState.article.pages_views > nextProps.article.pages_views) ? false: true;
            }      
        }
        const article={...nextProps.article};
        return {
            article: article,
            isAudWinner:isAudWinner,
            newAudiencePer:newAudiencePer,
            isSelectsChanged:nextProps.isSelectsChanged,
            mustShowNbrPageViewsVE:b1,
            mustShowNbrSalesVE:b2
        }; 
    }


    render() {
        return (
            <Animated.View style={{opacity: this.state.opacity}}>
                <TouchableOpacity>
                    <Card style={{
                        marginBottom: 20
                    }}
                    >

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
                            :
                            null
                        }

                        <CardItem cardBody bordered>
                            <Image source={{uri: 
                            "https://images.unsplash.com/photo-1552796220-db7b4c3824a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"}} 
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
                                    }} >{this.props.article.title}</Text>
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
                                    }}> {this.props.article.description} </Text>
                            </Body>
                        </CardItem> 
                        <CardItem style={{
                            padding:10
                        }}>
                           <Button
                              title="voir plus"
                              accessibilityLabel="voir plus"
                              onPress={this.onPressShowMoreBtn}
                           />
                        </CardItem>

                        <CardItem footer bordered>
                            <Body style={{
                                paddingBottom:5
                            }}> 
                                <Grid>
                                    <Col style={{backgroundColor : this.state.mustShowNbrSalesVE && this.props.project.projectType !== "TAR" ? "green" : "white",}}> 
                                        {this.props.project.projectType==="JA" ? <Text style={{textAlign:"center",fontSize: 15,color:this.state.mustShowNbrSalesVE ? "white" : "black"}}>Ventes</Text> : <Text></Text>}
                                        {this.props.project.projectType==="JA" ? <Text style={{textAlign:"center",fontSize: 13,color:this.state.mustShowNbrSalesVE ? "white" : "black"}}>{this.props.article.nbr_ventes}</Text> : <Text></Text>}
                                    </Col>
                                    
                                    <Col>
                                        <Text style={{textAlign:"center",fontSize: 15}}>Pages vues</Text>
                                        <Text style={{textAlign:"center",fontSize: 13}}>{this.props.article.pages_views}</Text>
                                    </Col>

                                    <Col>
                                        <Text style={{textAlign:"center",fontSize: 15}}>Publié en </Text>
                                        <Text style={{textAlign:"center",fontSize: 13}}> {this.props.article.published_at} </Text>
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
        
            </Animated.View>
        )
    }

    //new work to match implementend web functionnalities==> 
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UPDATE_ARTICLE_META: (value) => dispatch({
            type: "UPDATE_ARTICLE_META",
            value
        })
    }
}

export default withNavigation(connect(mapStateToProps,mapDispatchToProps)(CardArticle))

/**
 * 
 * 
 * .nbrVenteGreater {
    text-align: center;
    background-color: #27ae60;
    color: white;
}
 */

 //when card ventes is disabled
 //background-color: #f7f7f7;