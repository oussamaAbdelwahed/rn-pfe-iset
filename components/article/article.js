import React from "react"
import CardArticle from "./cardArticle/cardArticle"
import { FlatList } from "react-native";
import { Content } from "native-base";
import {withNavigation} from 'react-navigation';


class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          articles : []
        }
    }


    static getDerivedStateFromProps(nextProps,prevState) {
        return {
          articles : nextProps.articles,
        };
    }


    /*shouldComponentUpdate(nextProps,nextState) {
      if(this.state.articles.length===0 || this.state.articles.length !== nextState.articles.length || this.props.isSelectsChanged !== nextProps.isSelectsChanged) {
        return true;
      }
 
      for(let i=0;i<nextProps.articles.length;i++){
        if(
             +nextProps.articles[i].nbr_ventes !== +this.props.articles[i].nbr_ventes ||
             +nextProps.articles[i].pages_views !== +this.props.articles[i].pages_views ||
             nextProps.articles[i].title !== this.props.articles[i].title ||
             nextProps.articles[i].description !== this.props.articles[i].description
         ) {
              return true;
           }
      }
      return false;
  }*/
  shouldComponentUpdate(nextProps,nextState) {
    if(this.state.articles.length===0 || this.state.articles.length !== nextProps.articles.length || this.props.isSelectsChanged !== nextProps.isSelectsChanged) {
      return true;
    }

    for(let i=0;i<nextProps.articles.length;i++){
      if(
           +nextProps.articles[i].nbr_ventes !== +this.state.articles[i].nbr_ventes ||
           +nextProps.articles[i].pages_views !== +this.state.articles[i].pages_views ||
           nextProps.articles[i].title !== this.state.articles[i].title ||
           nextProps.articles[i].description !== this.state.articles[i].description
       ) {
            return true;
         }
    }
    return false;
  }

 /* shouldComponentUpdate(nextProps,nextState) {
    return true;
   }*/


    render() {
        const d = new Date();
        return (
            <Content padder>
                 {/*<FlatList 
                    data={this.props.articles}
                    renderItem={ ({item})  => {
                        return <CardArticle
                                    isSelectsChanged={this.props.isSelectsChanged} 
                                    article={item}
                                    navigation={this.props.navigation}
                                />
                    }}
                    keyExtractor={
                        (article) => {
                          return ""+Math.random()+""+d.getTime()
                        }
                    }
                   
                  /> */}
                  {this.props.articles.map((item)=>{
                    return <CardArticle
                              key={item.id}
                              isSelectsChanged={this.props.isSelectsChanged} 
                              article={item}
                              navigation={this.props.navigation}
                            />
                  })}
            </Content>
        )
        
    }


    
}



export default withNavigation(Article)