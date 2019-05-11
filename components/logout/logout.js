import React from "react"
import { SecureStore } from "expo"


class Logout extends React.Component {

    constructor(props) {
        super(props);
     }

     render() {
         return <></>;
     }

    componentWillMount() {
        SecureStore.deleteItemAsync("authToken")
        .then((res) => {
            console.log(res)
           
        })
        .catch(err => {}).finally(()=>{
            //this.props.navigation.navigate("lin")
            this.props.navigation.navigate("Login")
        })
    }
}
export default Logout