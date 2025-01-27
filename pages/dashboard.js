import React from "react"
import { StyleSheet, ScrollView, Alert, View,Platform,StatusBar} from "react-native"
import Header from "../components/header/header"
import Select from "../components/selectbar/Select"
import Article from "../components/article/article"
import Statistique from "../components/stats/statistique"
import ArticleService from "../shared/ArticleService"
import {REFRESH_SUBSCRIPTION_JA_15_MIN,subscribe} from "../graphql-utilities/subscriptions";
import {shouldSubscribeTo} from "../utilities/utils";
import { Spinner } from "native-base";
import Counter from "../components/counter/counter"
import { connect } from "react-redux"
import {withNavigation} from 'react-navigation';
import {Banner} from "react-native-paper"


class DashboardPage extends React.Component {
    state = {
        isSelectsChanged:0,
        articles: [],
        nbrUsers:0,
        nbrSessions:0,
        nbrActiveSubscribers:0,
        isNetworkErrorShowed: false,
        NetworkErrorMessage: '',
        isLoading: true,
        subscribingTO:{name:"refreshOccured_JA_15_MIN",sub:REFRESH_SUBSCRIPTION_JA_15_MIN},
        logo:null,
        resetCounter:false
    }

    componentWillUnmount() {
        this.subscriptionObserver.unsubscribe();
    }

    async componentDidMount() {
        this.getDashboardData(this.props.user.defaultSelectedProject,this.props.user.defaultSelectedPeriod,false,null);
        subscribe(this,shouldSubscribeTo(this.props.user.defaultSelectedProject,this.props.user.defaultSelectedPeriod));
        this.props.UPDATE_PROJECT_TYPE(this.props.user.defaultSelectedProject);
        this.props.UPDATE_PROJECT_INTERVALE(this.props.user.defaultSelectedPeriod)
    }


    render() {    
        if(this.state.isLoading) {
            return (
                <View style={styles.view_spinner_container}>
                     <Spinner color="#e53d22"/>                            
                </View>    
            )
        }
        return (
            <View style={styles.view_container}>
                <ScrollView>
                    <Header project={this.props.project.projectType} navigation={this.props.navigation} shouldDisplayLogo={true}/>
                    {this.state.isNetworkErrorShowed ?
                        Alert.alert(
                            "Erreur ... !",
                            this.state.NetworkErrorMessage,
                            [
                                {
                                    text: "Ok",   
                                }
                            ],
                            {
                                cancelable: false
                            }
                        )
                    :
                        <React.Fragment>
                            {/* banner for default password */}
                            <View style={{paddingLeft: 10,paddingRight:10}}>
                                <Banner
                                    visible={this.props.user.isDefaultPwd === 1}
                                    actions={[]}>
                                    Votre mot de passe a été généré par l'admininstrateur.
                                    Veuillez le changer pour etre en toute sécurité !
                                </Banner>
                            </View>


                            <Select 
                                changingProject={this.changingProjectHandler}
                                changingInterval={this.changingIntervalHandler}
                            />
                            <Statistique 
                                   projectType={this.props.project.projectType}
                                   users={this.state.nbrUsers} 
                                   sessions={this.state.nbrSessions} 
                                   activeSubs={this.state.nbrActiveSubscribers}
                            />
                            <Article 
                                 isSelectsChanged={this.state.isSelectsChanged}
                                 articles={this.state.articles}
                                 navigation={this.props.navigation}
                            />
                        </React.Fragment>
                    }
                    
                </ScrollView>
            
               <Counter resetCounter={this.state.resetCounter}/>
            </View>
            )   
    }

    


    getDashboardData = (project,interval,whenChangingSelect=false,logo=this.state.logo) => {
        ArticleService.getAllArticles(project,interval)
            .then((res) => {
                if(!res || !res.getFullDashboardData){
                    this.setState({isNetworkErrorShowed:true,isLoading:false});
                    return ;
                }
                  this.setState((prevState)=>{
                         return {
                            ...prevState,
                             isSelectsChanged:whenChangingSelect ? prevState.isSelectsChanged+1: prevState.isSelectsChanged,
                             subscribingTO:shouldSubscribeTo(project,interval),
                             logo:logo,
                             articles: res.getFullDashboardData.articles,
                             nbrUsers: res.getFullDashboardData.nbrUsers,
                             nbrSessions: res.getFullDashboardData.nbrSessions,
                             nbrActiveSubscribers: res.getFullDashboardData.nbrActiveSubscribers,
                             isLoading: false,
                             isNetworkErrorShowed:false
                        };
                    })
                }).catch(err => {
                        this.setState({
                             NetworkErrorMessage: "Impossible de récupérer les données. Il y a une erreur interne",
                             isNetworkErrorShowed: true,
                             isLoading: false
                        })
                })
    }

    shouldComponentUpdate(nextProps,nextState) {
        if((nextState.articles.length !== this.state.articles.length || nextState.articles.length===0)  || this.state.subscribingTO.name !== nextState.subscribingTO.name)
          return true;

        if(nextState.resetCounter !== this.state.resetCounter) return true;

        if(
            nextState.nbrUsers !== this.state.nbrUsers ||
            nextState.nbrSessions !== this.state.nbrSessions ||
            nextState.nbrActiveSubscribers !== this.state.nbrActiveSubscribers
        ){
            return true;
        }
        if(nextState.isNetworkErrorShowed !== this.state.isNetworkErrorShowed) return true;
 
        if(this.state.isSelectsChanged !== nextState.isSelectsChanged) return true;
        if(this.state.isLoading !== nextState.isLoading) return true;
     
        return false;
    }
 

    changingProjectHandler = (logo,selectedProject,selectedInterval,getDashData=true) => {
        //this.setState({logo:logo});
        //this.props.UPDATE_PROJECT_TYPE(selectedProject);
        this.setState({
            isLoading: true
        })
        this.subscriptionObserver.unsubscribe();
        if(getDashData){
          this.getDashboardData(selectedProject,selectedInterval,true,logo);
        }
        subscribe(this,shouldSubscribeTo(selectedProject,selectedInterval));
    }
  
    changingIntervalHandler = (selectedProject,selectedInterval) => {
        this.setState({
            isLoading: true
        })
        this.subscriptionObserver.unsubscribe();
        this.getDashboardData(selectedProject,selectedInterval,true);
        subscribe(this,shouldSubscribeTo(selectedProject,selectedInterval));
     }

}


const styles = StyleSheet.create({
    view_container: {
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight // android phones have issues with StatusBar overlap
            }
        }),
        flex: 1
    },

    view_spinner_container: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: "center",
        alignItems: "center"
    }
})


const mapStateToProps = state => {
    return {
        project: state.project,
        user: state.user
    }
}

const mapDispatchToProps =  dispatch => {
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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(DashboardPage))