import React,{Component} from 'react';
import { connect } from "react-redux";
import {Image} from "react-native";
import {BASE_URL} from '../../../config/env';

class SmallProfilePic extends Component {
    render() {
      return (
            <Image 
              source={
                {
                  uri: BASE_URL+this.props.user.bigImageUrl, 
                  headers: {
                    Pragma: 'no-cache',
                  }
                }
             }
              style={{height: 100,width: 100,borderRadius:75}}
           />
      )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SmallProfilePic)

