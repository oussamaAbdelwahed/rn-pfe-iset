import React from 'react'
import { Provider } from "react-redux"
import { Store } from "./config/redux"
import RootNavigation from "./components/mainNavigation/rootStack"


export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <RootNavigation/> 
      </Provider>
      );
  }
}


