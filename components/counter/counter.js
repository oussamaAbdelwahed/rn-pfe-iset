import React from "react"
import { StyleSheet } from "react-native"
import { View,Text } from "native-base";
import { Ionicons } from "@expo/vector-icons"
import { CONTERDOWN_NUMBER } from "../../config/env"
class Counter extends React.Component{


    state = {
        countdown: CONTERDOWN_NUMBER,
        fill: 0,
        resetCounter:false,
        newRefOccured:false,
        animationCssCLass:"countdown_animation",
        chargement:"",
    }


    static getDerivedStateFromProps(nextProps,prevState) {
        if(nextProps.resetCounter !== prevState.resetCounter){
          return {
              ...prevState,
              resetCounter: nextProps.resetCounter,
              newRefOccured:true,
              countdown:CONTERDOWN_NUMBER
          } 
        }
        return {
            ...prevState
        } 
  } 


    _decrement = () => { 
        if(this.state.countdown === 0) {
            if(this.state.newRefOccured) {
                this.setState({
                  countdown: CONTERDOWN_NUMBER,
                  chargement:""
                })
            }else{
                this.setState({
                  countdown: 0,
                  chargement:" chargement ..."
                })
            }
        }else {
            this.setState((prevState) => {
                return { 
                  ...prevState,
                  countdown: prevState.countdown -1 ,
                  chargement:""
                }
            })
        }
    }

    componentDidMount() {
        this.timer = setInterval(this._decrement,1000)
    }

    render() {
        //render must change we only display compte a rebours
        return (
            <View style={styles.view_container}>
                <Text style={{textAlign:"center", fontWeight: "bold"}}>
                   <Ionicons name="ios-timer" size={16} color="#e53d22" />{" "+this.state.countdown + this.state.chargement}
                </Text>
            </View>
        )
    }


    componentWillUnmount() {
        clearInterval(this.timer)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.newRefOccured) {
            this.setState({newRefOccured:false,chargement :""})
        }
    }
}

const styles = StyleSheet.create({
    view_container: {
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ecf0f1"
    }
})


export default Counter
    /*state = {
        countdown: CONTERDOWN_NUMBER,
        fill: 0,
        timeInSeconds: CONTERDOWN_NUMBER,
        seconds: 0,
        minutes: 0,
        counter: 1
    }

    componentDidMount() {

        this.setState({
            minutes: Math.floor(this.state.timeInSeconds/60)-1
        })
        this.timer = setInterval(this._decrement,1000)
    }

        componentWillUnmount() {
        clearInterval(this.timer)
    }

    _decrement = () => {
        if(this.state.counter === 60) {
            this.setState({
                counter: 1,
                minutes: this.state.minutes - 1,
                seconds: 0
            })

            if(this.state.minutes < 0 && this.state.seconds === 0) {
                this.setState({
                    minutes: Math.floor(this.state.timeInSeconds/60)-1
                })
            }
        }else {
            this.setState({
                seconds: 60-this.state.counter,
                counter: this.state.counter+1
            })
        }
    }
    
     render() {
        //render must change we only display compte a rebours
        return (
            <View style={styles.view_container}>

                <Text style={{textAlign:"center", fontWeight: "bold"}}>
                <Ionicons name="ios-timer" size={16} color="#e53d22" />{"  0"+this.state.minutes+":"}    
                    <Text>
                        { this.state.seconds%10 !==0 && this.state.seconds.toString().length === 1 || this.state.seconds === 0 ? 
                            "0"+this.state.seconds
                        : this.state.seconds 
                        }
                    </Text>
                </Text>
                
            </View>

        )
    }
    */
