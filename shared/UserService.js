import gql from "graphql-tag"
import client  from "../config/graphql-ws.config";
import axios from "axios"
import {BASE_URL} from "../config/env"

//we probably need only this functionality in mobile app(updating profile credentials)
class UserService {
    static async updateProfileCredentials (credentials) {
        const query  = await client.mutate({
            mutation: gql`
              mutation ($credentials: AccountCredentials!){
                updateProfileCredentials(credentials: $credentials)
              }
            `,
            fetchPolicy: "no-cache",
            variables: {credentials}
        })
        return query.data.updateProfileCredentials;
    }


    // static updateProfilePicture(userId,oldImageName,file) {
    //   let filenameSplitArray = file.uri.split("/")
    //   let filename = filenameSplitArray[filenameSplitArray.length-1]  

    //   const form = new FormData();
    //   let fileType = file.uri.substring(file.uri.lastIndexOf(".") + 1);

    //   form.append("profile-pic", {
    //    uri :  file.uri,
    //    type: "image/"+fileType,
    //    name: filename
    //   }, "profile-pic")


    //   axios.post(BASE_URL+"/profile/mobile/upload-image/"+userId+"/"+oldImageName, config)
    //     .then((res) => console.log(res.data))
    //     .catch((err) => console.log(err))
    // }

    static async getUserCredentials(userId) {
      const query = await client.query({
        query: gql`
          query ($userId: Int!) { 
            getUserInfo(userId: $userId) { 
              id 
              firstname 
              lastname 
              country 
              image_url
              default_project
              default_period
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: {userId}
      })

      return query.data.getUserInfo
    }

    static changeEmail(data) {
      return axios.post(BASE_URL+"/change-email",data);
    }

  static updatePassword = (data) => {
    return axios.post(BASE_URL+"/profile/change-pwd", data)
  }


  static resetPassword = (email) =>  {
    return axios.post(BASE_URL+"/reset-pwd?device=mobile",{email})
  }

  static verifyResetPasswordCode = (code) => {
    return axios.post(BASE_URL+"/mobile/check-confcode",{confCode: code})
  }

  static setNewPasswordReset = (password,codeConfirmation) => {
    return axios.post(BASE_URL+"/change-password",{password: password,token: codeConfirmation})
  }
 
  static resetEmail = (userId,email) => {
    return axios.post(BASE_URL+"/profile/reset-email?device=mobile",{userId: userId,email:email})
  }

  static verifyResetEmailCode = (email,code) => {
    return axios.post(BASE_URL+"/mobile/profile/change-email",{email: email,confCode:code})
  }

  static changeProfilePicture(file,oldPicName,userId) {
    var headers = {
      "Accept": "application/json",
      'Content-Type': 'multipart/form-data; charset=utf-8'
    }
   const fd = new FormData();
   let fileType = file.uri.substring(file.uri.lastIndexOf(".") + 1);
   fd.append("profile-pic", {
       uri : file.uri,
       type: "image/"+fileType,
       name: Date.now()+"."+fileType
   })
   return axios.post(BASE_URL+"/profile/upload-image/"+userId+"/"+oldPicName,fd,{headers:headers})
   }
}

export default UserService;