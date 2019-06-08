import {gql} from "apollo-boost";
import client from "../config/graphql-ws.config";
import { SecureStore } from 'expo';
import {extractAuthToken} from './gql-utils'; 
const RETURNED_DATA_STRUCTURE = `
    articles {
      id
      title
      description
      nbr_ventes
      pages_views
      published_at
      image_thumb
    }
    nbrUsers
    nbrSessions
    nbrActiveSubscribers
`;


const REFRESH_SUBSCRIPTION_JA_15_MIN = gql`
  subscription ($authToken: String!){
    refreshOccured_JA_15_MIN (authToken: $authToken){
      ${RETURNED_DATA_STRUCTURE}
    }
  }
`;

const REFRESH_SUBSCRIPTION_JA_24_H = gql`
  subscription ($authToken: String!){
    refreshOccured_JA_24_H (authToken: $authToken){
      ${RETURNED_DATA_STRUCTURE}
    }
  }
`;

const REFRESH_SUBSCRIPTION_JAB_15_MIN = gql`
  subscription ($authToken: String!) {
    refreshOccured_JAB_15_MIN (authToken: $authToken){
      ${RETURNED_DATA_STRUCTURE}
    }
  }
`;


const REFRESH_SUBSCRIPTION_JAB_24_H = gql`
  subscription ($authToken: String!){
    refreshOccured_JAB_24_H (authToken: $authToken){
      ${RETURNED_DATA_STRUCTURE}
    }
  }
`;

const REFRESH_SUBSCRIPTION_TAR_15_MIN = gql`
  subscription ($authToken: String!) {
    refreshOccured_TAR_15_MIN (authToken: $authToken){
      ${RETURNED_DATA_STRUCTURE}
    }
  }
`;

const REFRESH_SUBSCRIPTION_TAR_24_H = gql`
  subscription ($authToken: String!) {
    refreshOccured_TAR_24_H (authToken: $authToken){
      ${RETURNED_DATA_STRUCTURE}
    }
  }
`;




const SubsMappings = {
  "REFRESH_SUBSCRIPTION_JA_15_MIN":"refreshOccured_JA_15_MIN",
  "REFRESH_SUBSCRIPTION_JA_24_H":"refreshOccured_JA_24_H",
  "REFRESH_SUBSCRIPTION_JAB_15_MIN":"refreshOccured_JAB_15_MIN",
  "REFRESH_SUBSCRIPTION_JAB_24_H":"refreshOccured_JAB_24_H",
  "REFRESH_SUBSCRIPTION_TAR_15_MIN":"refreshOccured_TAR_15_MIN",
  "REFRESH_SUBSCRIPTION_TAR_24_H":"refreshOccured_TAR_24_H"
};



const subscribe  =async (_this,shouldSubscribeTo = {sub:REFRESH_SUBSCRIPTION_JA_15_MIN})=>{
   const token = await extractAuthToken();
   if(token ===null) return ;
   console.log("**********************SHOULD SUBSCRIBE TO "+shouldSubscribeTo.sub+"****************");
   _this.subscriptionObserver = client.subscribe({
    query:  shouldSubscribeTo.sub,
    variables: {authToken:token}
  }).subscribe({
    next(data) {
      if(!data.data || !data.data[_this.state.subscribingTO.name]){
        _this.setState({isNetworkErrorShowed:true,isLoading:false});
        return ;
      }
      _this.setState((prevState)=>{
        return {
          ...prevState,
          resetCounter: !prevState.resetCounter,
          articles: data.data[_this.state.subscribingTO.name].articles,
          nbrUsers: data.data[_this.state.subscribingTO.name].nbrUsers,
          nbrSessions: data.data[_this.state.subscribingTO.name].nbrSessions,
          nbrActiveSubscribers: data.data[_this.state.subscribingTO.name].nbrActiveSubscribers
        }
      });
    },
    error(err) { console.error('err', err); },
  });
}


export {
  REFRESH_SUBSCRIPTION_JA_15_MIN,
  REFRESH_SUBSCRIPTION_JA_24_H,
  REFRESH_SUBSCRIPTION_JAB_15_MIN,
  REFRESH_SUBSCRIPTION_JAB_24_H,
  REFRESH_SUBSCRIPTION_TAR_15_MIN,
  REFRESH_SUBSCRIPTION_TAR_24_H,
  SubsMappings,
  subscribe
};



