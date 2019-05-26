import React from 'react'
import {VictoryChart,VictoryBar,VictoryTheme,VictoryAxis} from "victory-native"
import {Image,View,Text,ProgressBarAndroid,StyleSheet} from 'react-native'; 
class VisitorsBarChart extends React.Component {

  state = {
    geoMapData:[],
  }

  shouldComponentUpdate() {
    return true;
  }

  static getDerivedStateFromProps(nextProps,prevState) {
    let data = [];
    let max=0;
    if(nextProps.geoMapData.length > 0 && nextProps.geoMapData[0].length > 0){
        max = nextProps.geoMapData[0][2];
    }

    for(let i=0;i<nextProps.geoMapData.length;i++){
      data.push({perc:max / nextProps.geoMapData[i][2],code:nextProps.geoMapData[i][1],country:nextProps.geoMapData[i][0],visits:nextProps.geoMapData[i][2]});
    }
    return {
      ...prevState,
      geoMapData:data,
    }
  }

  render() {
     if(this.state.geoMapData.length > 0) {
         let str="";
        return (
          this.state.geoMapData.map((data,i)=>{
            str = data.visits > 1 ? " visiteurs " : " visiteur ";
              return (
                data.country==="(not set)" ? <Text key={i}></Text> : 
                  <View key={i} style={styles.container}>

                    <View style={{
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                      flexDirection: "row",
                      alignItems: "center"
                    }}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={{uri: 'https://www.countryflags.io/'+data.code+'/flat/64.png'}}
                      />
                      <Text style={{paddingLeft: 10}}>{data.country+" : "+ data.visits + str} </Text>
                    </View>
                    
                    
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        style={{height:30,marginLeft:10,marginRight:10}}
                        indeterminate={false}
                        progress={ 1 / data.perc}
                        color="#2980b9"
                    />
                 </View>
              )
            })
        );
     }
     return <></>;
  }
}

export default VisitorsBarChart;

const styles = StyleSheet.create({
    container: {
      flex: 2,
      justifyContent: 'space-evenly',
      height:90,
      width:"100%"
    },
  });

/*<VictoryChart   
             domainPadding={{ x: 1 }} 
             theme={VictoryTheme.grayscale}>
            <VictoryBar 
               labels={(d) => `${d.country} : ${d.y}`} 
               data={this.state.geoMapData}
               barWidth={30}
               style={{
                data: { fill: "#4cd137" }
              }}
              horizontal
               />
               <VictoryAxis dependentAxis />
            </VictoryChart>*/
