import React from "react"
import { Text, View,Spinner } from "native-base"
import { ScrollView,StyleSheet } from "react-native"
import { styles} from "./styles"
import Header from "../../components/header/header"
import Statistique from "./statistique"
import Intro from "./Intro"
import Article from "./article"
import Counter from "./counter"
import { connect } from "react-redux"
import ArticleService from '../../shared/ArticleService';
import GeoStats from "./GeoStats"

// import {} from "react-native-paper"

class SingleArticle extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            articleData: {
                nbrSales:0,
                nbrPageViews:0,
                nbrUsers:0,
                nbrSessions:0,
                nbrActiveSubscribers:0,
                lineChartData:[],
                geoMapData: []
            },
            intervalId:null,
            loading: false,
            isLoading:true,
            isFirstTime:true,
            resetCounter:false
        }
    }

    async componentDidMount(){
        const articleId = this.props.navigation.state.params.articleId;
        const projectIntervale = this.props.navigation.state.params.projectIntervale;
        let projectType = this.props.article.projectType;
        projectType = projectType.toUpperCase();
        let res = null;

        // set loading to true
        this.setState({loading: true})
        res = await ArticleService.getSingleArticleFreshData(projectType,articleId,projectIntervale); 
        this.setState((prevState)=>{
            return {
                ...prevState,
                loading: false,
                articleData:res,
                isLoading:false,
                resetCounter:!prevState.resetCounter
            }
        })
       // console.log(res.lineChartData);
        const intId  = setInterval(async () => {
            res = await ArticleService.getSingleArticleFreshData(projectType,articleId,projectIntervale); 
            this.setState((prevState)=>{
                return {
                    articleData:res,
                    isFirstTime:false,
                    resetCounter:!prevState.resetCounter
                }
            });
        },20000); 
        this.setState({intervalId: intId});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
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
                    {/* Header */}
                    <Header navigation={this.props.navigation} shouldDisplayLogo={true}/>

                    {/* Intro screen */}
                    <Intro projectType={this.props.article.projectType} period={this.props.navigation.state.params.projectIntervale}/>

                    {/* Stats */}
                    <Statistique projectType={this.props.article.projectType} traffic={
                        {
                            users:this.state.articleData.nbrUsers,
                            sessions:this.state.articleData.nbrSessions,
                            activeSubscribers:this.state.articleData.nbrActiveSubscribers
                        }
                    }/>
                    <Article 
                        indicators={
                            {
                              nbrPageViews:this.state.articleData.nbrPageViews,
                              nbrSales:this.state.articleData.nbrSales
                            }
                        }
                        isFirstTime={this.state.isFirstTime}
                        lineChartData={this.state.articleData.lineChartData}
                        geoMapData={this.state.articleData.geoMapData}
                    />

                    <GeoStats 
                        lineChartData={this.state.articleData.lineChartData}
                        geoMapData={this.state.articleData.geoMapData}/>
                </ScrollView>
                <Counter resetCounter={this.state.resetCounter}/>
            </View>
        )
    }

}

const mapStateToProps = state => {
    return {
        article: state.article
    }
}

export default connect(mapStateToProps)(SingleArticle)