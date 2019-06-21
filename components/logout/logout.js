import React from "react"
import { SecureStore } from "expo"


class Logout extends React.Component {

     render() {
         return <></>;
     }

    componentWillMount() {
        SecureStore.deleteItemAsync("authToken").then(()=>{
            this.props.navigation.navigate("Login")
        })
       
    }
}
export default Logout