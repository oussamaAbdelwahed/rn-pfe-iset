import {
    REFRESH_SUBSCRIPTION_JA_15_MIN,
    REFRESH_SUBSCRIPTION_JA_24_H,
    REFRESH_SUBSCRIPTION_JAB_15_MIN,
    REFRESH_SUBSCRIPTION_JAB_24_H,
    REFRESH_SUBSCRIPTION_TAR_15_MIN,
    REFRESH_SUBSCRIPTION_TAR_24_H
   } 
from '../graphql-utilities/subscriptions';
import { SecureStore } from 'expo';
import base64 from "base-64"

const shouldSubscribeTo = (project,interval) => {
    let subscribeTo = {name:"refreshOccured_JA_15_MIN",sub:REFRESH_SUBSCRIPTION_JA_15_MIN};
    if(project==="JA") {
      if(interval!=="15min") {
        subscribeTo={name:"refreshOccured_JA_24_H",sub:REFRESH_SUBSCRIPTION_JA_24_H};
      }
    }else if(project==="JAB"){
      if(interval==="15min") {
        subscribeTo={name:"refreshOccured_JAB_15_MIN",sub:REFRESH_SUBSCRIPTION_JAB_15_MIN};
      }else{
       subscribeTo={name:"refreshOccured_JAB_24_H",sub:REFRESH_SUBSCRIPTION_JAB_24_H};
      }
    }else {
      if(interval==="15min") {
        subscribeTo={name:"refreshOccured_TAR_15_MIN",sub:REFRESH_SUBSCRIPTION_TAR_15_MIN};
      }else{
        subscribeTo={name:"refreshOccured_TAR_24_H",sub:REFRESH_SUBSCRIPTION_TAR_24_H};
      }
    }
    return subscribeTo;
};

const ignoreInputErrors= (_this,toIgnore) => {
 const ignored={};
 for(let i=0;i<toIgnore.length;i++) {
  ignored[toIgnore[i]]=false;
 }
 _this.setState(ignored);
}

const validateAddUserForm= (_this) => {
   var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if(_this.state.firstname.length===0) {
    ignoreInputErrors(_this,["lnHasError","emailHasError","pwdHasError","confPwdHasError"]);
    _this.setState({fnHasError:true});
    return false;
   }else if(_this.state.lastname.length===0) {
    ignoreInputErrors(_this,["fnHasError","emailHasError","pwdHasError","confPwdHasError"]);
    _this.setState({lnHasError:true});
    return false;
   }else if(!emailRegExp.test(String(_this.state.email).toLowerCase())) {
    ignoreInputErrors(_this,["fnHasError","lnHasError","pwdHasError","confPwdHasError"]);
    _this.setState({emailHasError:true});
    return false;
   }else if(_this.state.password.length < 7) {
    ignoreInputErrors(_this,["fnHasError","lnHasError","emailHasError","confPwdHasError"]);
    _this.setState({pwdHasError:true});
    return false;
   }else if(_this.state.confirmPassword !== _this.state.password) {
    ignoreInputErrors(_this,["fnHasError","lnHasError","emailHasError","pwdHasError"]);
    _this.setState({confPwdHasError:true});
    return false;
   }else{
     ignoreInputErrors(_this,["confPwdHasError","fnHasError","lnHasError","emailHasError","pwdHasError"]);
   }
   return true;
}


const isLoggedIn = async () => {
    const token = await SecureStore.getItemAsync("authToken")
    return token;
}

const isAuth = () => {
  if(isLoggedIn() != null) {
    const parsedToken = getParsedToken()
    if(parsedToken !== null) {
       return true;
     }
    return false;
  }

  return false
}

const isAdmin = () => {
  if(isLoggedIn() != null) {
    const parsedToken = getParsedToken();
    if(parsedToken !== null)
     return parsedToken.isAdmin > 0;
 
   return false; 
  }
  return false

}


const getParsedToken = async() => {
  const token = await SecureStore.getItemAsync("authToken")
  if(token && token != "") {
    let decryptedToken = token.split(".")[1]
    return JSON.parse(base64.decode(decryptedToken))
  }
  return null
}


const extractToken = async () => {
  return await SecureStore.getItemAsync("authToken")
}


export {
  shouldSubscribeTo,
  validateAddUserForm, 
  isLoggedIn,
  getParsedToken,
  isAuth,
  isAdmin,
  extractToken
};
