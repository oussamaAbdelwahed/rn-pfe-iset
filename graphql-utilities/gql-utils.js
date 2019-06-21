import { SecureStore } from 'expo';
import {ApolloClient} from "apollo-client";
import {WebSocketLink} from "apollo-link-ws";
import {HttpLink} from "apollo-link-http";
import {split,concat, ApolloLink} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import {InMemoryCache} from 'apollo-cache-inmemory';


const TOKEN_KEY="authToken";
const WS_PORT = 3000;
const IP_ADDRESS='192.168.43.137';
const extractAuthToken = async () => {
    const token= await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
}

const saveAuthToken = async (token)=> {
    console.log("SAVING TOKEN");
    return SecureStore.setItemAsync(TOKEN_KEY,token);
}


const getGQLClient = async () => {
  const token = await extractAuthToken();
  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        Authorization: "Bearer "+token,
      }
    });
    return forward(operation);
  })
  
  const httpLink=new HttpLink({
     uri: `http://${IP_ADDRESS}:${WS_PORT}/graphql`
  })
  
  const wsLink = new WebSocketLink({
    uri: `ws://${IP_ADDRESS}:${WS_PORT}/graphql`,
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
  
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
};




export {extractAuthToken,saveAuthToken,getGQLClient};