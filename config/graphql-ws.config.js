import {ApolloClient} from "apollo-client";
import {WebSocketLink} from "apollo-link-ws";
import {HttpLink} from "apollo-link-http";
import {split,concat, ApolloLink,Observable} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import {InMemoryCache} from 'apollo-cache-inmemory';
import {extractAuthToken} from '../graphql-utilities/gql-utils';
import { IP_ADRESSE, WS_PORT} from "./env"




const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: "Bearer "+ extractAuthToken() || null,
    }
  });
  return forward(operation);
})



const httpLink=new HttpLink({
   uri: 'http://192.168.1.3:'+WS_PORT+'/graphql'
})

const wsLink = new WebSocketLink({
  uri: `ws://192.168.1.3:${WS_PORT}/graphql`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  concat(authMiddleware,httpLink)
);



const client =  new ApolloClient({
  link,
  cache: new InMemoryCache()
});



export default client;
