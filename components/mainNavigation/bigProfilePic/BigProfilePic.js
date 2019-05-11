import React,{Component} from 'react';
import { connect } from "react-redux";
import {Image} from "react-native";
import {BASE_URL} from '../../../config/env';

class BigProfilePic extends Component {
    render() {
      return (
            <Image 
              source={{uri: BASE_URL+this.props.user.bigImageUrl}}
              style={{height: "100%",width: "100%"}}
              blurRadius={3}
           />
      )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(BigProfilePic)

