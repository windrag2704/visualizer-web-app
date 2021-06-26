import React from 'react'
import "./App.css"
import Visualizer from "./Visualizer";
import {Start} from "./Start";

export const HOST = 'http://localhost:8080'
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: undefined
        }
    }

    setProject = (projectName) => {
        this.setState({project: projectName})
    }
    closeProject = () => {
        this.setState({project: undefined})
    }
    render() {
        console.log(this.state.project)
        if (this.state.project === undefined) {
            return (
                <div style={{height: '100%'}}>
                    <Start setProject={this.setProject}/>
                </div>
            )
        } else {
            return (
                <Visualizer project={this.state.project} close={this.closeProject}/>
            )
        }
    }
}

export default App;