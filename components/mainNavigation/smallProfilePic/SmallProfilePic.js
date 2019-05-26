import React,{Component} from 'react';
import { connect } from "react-redux";
import {Image} from "react-native";
import {BASE_URL} from '../../../config/env';
import { View,Text } from 'react-native';

class SmallProfilePic extends Component {
    render() {
      return (
            <View style={{
                width:"100%",
                height:200 ,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top:20,
                left: 0,
            }}>
                <Image 
                  source={
                    {
                      uri: BASE_URL+this.props.user.bigImageUrl, 
                      headers: {
                        Pragma: 'no-cache'
                      }
                    }
                }
                  style={{height: 100,width: 100,borderRadius:75}}
                  
              />
              <Text style={{marginTop:10,fontSize:17,color:"white"}}>{this.props.user.firstname+" "+this.props.user.lastname}</Text> 
           </View>
      )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SmallProfilePic)

