import React from "react"
import { Card, Text,Content } from "native-base";
import PVLineChart from "../../components/pv-line-chart/PVLineChart"
import VisitorsBarChart from "../../components/visitors-bar-chart/VisitorsBarChart"

class GeoStats extends React.Component{

    render() {
        return (
            <Content padder>
                <Card>
                    <Text style={{fontSize:17,textAlign:"center", marginTop: 15}}>
                        Statistiques dernières 24 heures
                    </Text>
                    {this.props.lineChartData && this.props.lineChartData.length > 0 ? 
                        <Text style={{marginBottom:10,fontSize:15, marginTop:30,marginLeft:7}}>Nombre des pages vues</Text> 
                    : null}

                    <PVLineChart lineChartData={this.props.lineChartData}/>

                    {this.props.geoMapData && this.props.geoMapData.length > 0 ? 
                        <Text style={{marginBottom:10,fontSize:15, marginTop:30,marginLeft:7}}>Nombre des visiteurs par pays</Text> 
                    : null}
                    <VisitorsBarChart geoMapData={this.props.geoMapData} />
                </Card>
            </Content>

        )
    }

}


export default GeoStats