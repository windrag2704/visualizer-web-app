import React from "react";
import {HOST} from './App'
class Project extends React.Component {
    render() {
        return <div onClick={this.props.onClick} className={'projectLine'}>{this.props.value}</div>
    }
}

class ProjectList extends React.Component {
    render() {
        return <div>
            {this.props.projects.map((project) =>
                <Project key={project}
                         value={project}
                         onClick={() => this.props.onProjectSelect(project)}/>
            )}
        </div>;
    }
}

class ProjectCreator extends React.Component {
    render() {
        return (
            <form encType={'multipart/from-data'}>
                <input type={'file'}/>
                <input type={'button'} value={'Send'} onClick={this.props.onUpload}/>
            </form>
        );
    }
}

export class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: []
        }
    }

    onProjectSelect = (project) => {
        this.props.setProject(project)
    }

    componentDidMount() {
        this.getProjectList()
    }

    getProjectList() {
        let url = new URL(HOST + '/api/projects')
        fetch(url.toString())
            .then((resp) => resp.json())
            .then((arr) => this.setState({projects: arr}))
    }

    uploadAction = () => {
        console.log('upload')
        var formdata = new FormData();
        var file = document.querySelector('input[type="file"]').files[0];
        if (file === undefined || file.length === 0) return
        formdata.append("file", file);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(HOST + "/api/upload", requestOptions)
            .then(response => response.text())
            .then(() => this.getProjectList())
            .catch(error => console.log('error', error));
    }

    render() {
        return (
            <div className={'startWindow'}>
                <div className={'logo'}>Visualizer</div>
                <div className={'projectWindow'}>
                    <div className={'projectContainer'}>
                        <ProjectList onProjectSelect={this.onProjectSelect}
                                     projects={this.state.projects}/>
                    </div>
                </div>
                <div className={'newProjectWindow'}>
                    <ProjectCreator onUpload={this.uploadAction}/>
                </div>
            </div>
        )
    }
}