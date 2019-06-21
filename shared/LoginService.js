import gql from "graphql-tag"
//import client  from "../config/graphql-ws.config";
import {getGQLClient} from '../graphql-utilities/gql-utils';
const API_BASE_URL="http://192.168.43.137:3000/";

class LoginService {
  
  static login = async (email,password) => {
    const client = await getGQLClient();
    const query  = await client.query({
        query: gql`
          query ($email: String!,$password:String!){
            login(email:$email,password:$password) {
                token
                tokenExpiration
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: {email:email,password:password}
    })
    return query.data;
  }


   static addUser = async (user) => {
    const client = await getGQLClient();
      const query = await client.mutate({
        mutation: gql`
          mutation ($user: User!) {
            addUser(user:$user)
          }
        `,
       fetchPolicy: "no-cache",
       variables: {user}
      }); 
      return query;
   }

    //when user want's to change password, he must enter his email and click submit button
    //this method return true  if all is ok (a new reset_password record is saved to DB and a reset password email is send to the given email address) 
    //or false if something went wrong
    // if it returns true you must show a form to te user to enter the new password and confirm password (2 password inputs)
   static  sendEmailToResetPassword = async (email) => {
    try{
     const response = await axios.post(API_BASE_URL+"reset-pwd",{email});
     return response.status===200;
    }catch(e){
      console.log(e);
      return false;
    }
  };


  //when user enter the new password and confirm it and press submit button
  //you msut call this method to update user's password in db and redirect it to the login intent after removing the jwt token from the expo SecureStore
  static changePassword = async (urlToken,password) => {
    try{
     const response  = await axios.post(API_BASE_URL+"change-password",{token:urlToken,password:password});
     return response.status===200;
    }catch(e) {
      console.log(e);
      return false;
    }
  };

}




export default LoginService
