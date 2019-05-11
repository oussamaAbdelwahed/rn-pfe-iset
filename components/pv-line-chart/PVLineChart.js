import React from 'react'
import {VictoryChart,VictoryLine,VictoryTheme,VictoryAxis} from "victory-native"



class PVlineChart extends React.Component {

  state = {
    lineChartData:[],
  }

  shouldComponentUpdate() {
    return true;
  }

  static getDerivedStateFromProps(nextProps,prevState) {
    let data = [];
    const length = nextProps.lineChartData.length;
    for(let i=0;i<length;i+=3){
      data.push({x:""+""+i+" "+nextProps.lineChartData[i].key_as_string+"",y:nextProps.lineChartData[i].doc_count});
    }
    if(length > 0) {
      data.pop();
      data.push({x:"24 "+nextProps.lineChartData[length-1].key_as_string+"",y:nextProps.lineChartData[length-1].doc_count})
    }
    return {
      ...prevState,
      lineChartData:data,
    }
  }

  shouldComponentUpdate() {
    return true;
  }

    render() {
      if(this.state.lineChartData.length > 0) {
        return (
          <VictoryChart 
             theme={VictoryTheme.material}
          >
            <VictoryAxis  crossAxis={true} dependentAxis={true}/>
            <VictoryAxis   crossAxis={true} tickFormat={(t) => `${t.split(' ')[1]}`}/>
              <VictoryLine 
                    style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc"}
                    }} 
                 data={this.state.lineChartData}
              />
          </VictoryChart>
        );
      }
      return <></>;
    }
}


export default PVlineChart;

