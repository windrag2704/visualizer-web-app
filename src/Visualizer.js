import './Visualizer.css';
import React, {Component} from "react";
import {Resize, ResizeHorizon, ResizeVertical} from "react-resize-layout";
import {isNode,} from 'react-flow-renderer'
import './ThWindow.js'
import ThWindow from "./ThWindow";
import MutWindow from "./MutWindow";
import InfoWindow from "./InfoWindow";
import {StackWindow} from "./StackWindow";
import {forceNumber} from "react-range-step-input/lib/utils";
import dagre from 'dagre';
import player from './Player.js'
import ReactTooltip from 'react-tooltip'
import bufferer from './Bufferer.js'
import {Slider} from "./Slider";
import {HOST} from './App'

const nodeWidth = 172;
const nodeHeight = 36;


var workerUrl = URL.createObjectURL(new Blob(['(' + player.toString() + ')()']))
var worker = undefined;
var buffUrl = URL.createObjectURL(new Blob(['(' + bufferer.toString() + ')()']))
var bufferWorker = undefined;

class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            thGraphs: {},
            synGraphs: {},
            funGraphs: {},
            synElement: undefined,
            nodesPositions: {},
            maxSteps: 0,
            stacks: {},
            playing: false,
            playingSpeed: 1
        }
    }

    async componentDidMount() {
        await this.getSize();
        bufferWorker = new Worker(buffUrl)
        bufferWorker.onmessage = (e) => {
            let thGraph = e.data.thRes
            let step = e.data.step
            let funGraph = e.data.funRes
            let stack = e.data.stackRes
            let mutGraph = e.data.mutRes
            let graph = {}
            let mut = {}
            let func = {}
            let stacks = {}
            if (mutGraph !== undefined) {
                Object.assign(mut, this.state.synGraphs)
                mut[step] = mut
                this.setState({synGraphs: mut})
            }
            Object.assign(func, this.state.funGraphs)
            Object.assign(stacks, this.state.stacks)
            Object.assign(graph, this.state.thGraphs)
            func[step] = funGraph
            stacks[step] = stack
            graph[step] = thGraph
            this.setState({thGraphs: graph, funGraphs: func, stacks: stacks})
        }
        bufferWorker.postMessage({
            "step": 1,
            "max": 11 < this.state.maxSteps ? 11 : this.state.maxSteps,
            "host": HOST + '/api/' + this.props.project
        })
    }

    getLayoutedElements = (elements, direction = 'TB') => {
        if (elements === undefined) return undefined;
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        dagreGraph.setGraph({rankdir: direction});

        elements.forEach((el) => {
            if (isNode(el)) {
                dagreGraph.setNode(el.id, {width: nodeWidth, height: nodeHeight});
            } else {
                dagreGraph.setEdge(el.source, el.target);
            }
        });

        dagre.layout(dagreGraph);

        return elements.map((el) => {
            if (isNode(el)) {
                const nodeWithPosition = dagreGraph.node(el.id);
                if (this.state.nodesPositions[el.id] === undefined) {
                    el.position = {
                        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
                        y: nodeWithPosition.y - nodeHeight / 2,
                    };
                } else {
                    el.position = {
                        x: this.state.nodesPositions[el.id].x,
                        y: this.state.nodesPositions[el.id].y,
                    }
                }
            }
            return el;
        });
    };

    async getSize() {
        let url = new URL(HOST + "/api/" + this.props.project + "/size")
        await fetch(url.toString()).then((response) => response.json())
            .then((value) => {
                this.setState({maxSteps: value})
            })
    }

    getMutGraph(step, synId) {
        let params = {step: step, synId: synId}
        let url = new URL(HOST + "/api/" + this.props.project + "/syn")
        url.search = new URLSearchParams(params).toString()
        fetch(url.toString()).then((response) => response.json())
            .then((arr) => {
                let graph = {};
                console.log(arr)
                Object.assign(graph, this.state.synGraphs)
                if (arr.nodes !== undefined) {
                    graph[step] = this.getLayoutedElements(arr.nodes.concat(arr.edges))
                }
                this.setState({synGraphs: graph})
            })
    }

    getPrevStep() {
        if (this.state.step === 0) return
        this.getStep(this.state.step - 1);
    }

    getNextStep = () => {
        if (this.state.step === this.state.maxSteps) return
        this.getStep(this.state.step + 1)
    }

    getStep(step) {
        let newVal = 0;
        if (typeof step === "number") {
            newVal = step;
        } else {
            newVal = forceNumber(step.target.value);
        }
        this.setState({step: newVal})
        if (this.state.thGraphs[newVal] === undefined) {
            bufferWorker.postMessage({
                "step": newVal,
                "max": newVal + 10 < this.state.maxSteps ? newVal + 10 : this.state.maxSteps,
                "host": HOST + '/api/' + this.props.project
            })
        }
        if (this.state.synGraphs[newVal] === undefined && this.state.synElement !== undefined) {
            this.getMutGraph(newVal, this.state.synElement)
        }
    }

    onSynClick = (event, element) => {
        if (element.id.split("_")[0] === "SYN" && this.state.synElement === undefined) {
            this.setState({synElement: element.id})
            this.getMutGraph(this.state.step, this.state.synElement)
        } else {
            this.setState({synElement: undefined})
            this.setState({synGraphs: {}})
        }
    }

    onNodeDragStop = (event, node) => {
        console.log("Drag")
        let positions = {}
        Object.assign(positions, this.state.nodesPositions)
        positions[node.id] = node.position
        this.setState({nodesPositions: positions})
    }

    stopPlaying() {
        worker.terminate()
    }

    startPlaying() {
        worker = new Worker(workerUrl)
        worker.onmessage = () => {
            if (this.state.thGraphs[this.state.step + 1] !== undefined || this.state.step === this.state.maxSteps - 1) {
                this.getNextStep()
            } else {
                if (!(this.state.step === this.state.maxSteps)) {
                    bufferWorker.postMessage({
                        "step": this.state.step + 1,
                        "max": this.state.step + 10 < this.state.maxSteps ? this.state.step + 10 : this.state.maxSteps,
                        "host": HOST + '/api/' + this.props.project
                    })
                } else {
                    return
                }
            }
            worker.postMessage(this.state.playingSpeed)
        }
        worker.postMessage(this.state.playingSpeed)
    }

    play() {
        if (this.state.playing) {
            this.setState({playing: false})
            this.stopPlaying()
        } else {
            this.setState({playing: true})
            this.startPlaying()
        }
    }

    scrollHand(event) {
        let newSpeed;
        if (event.deltaY < 0) {
            if (this.state.playingSpeed >= 3) return
            newSpeed = Number((this.state.playingSpeed + 0.1).toFixed(1))
        } else {
            if (this.state.playingSpeed <= 0.5) return
            newSpeed = Number((this.state.playingSpeed - 0.1).toFixed(1))
        }
        this.setState({playingSpeed: newSpeed})
        if (this.state.playing) {
            this.stopPlaying()
            this.startPlaying()
        }
        ReactTooltip.rebuild()
        console.log(newSpeed)
    }

    render() {
        return (
            <div className="App">
                <div className={"App-header"}>
                    <button className={'closeBtn'} onClick={this.props.close}>
                        <div className={'closeImg'}/>
                    </button>
                    <button className={'firstBtn'} onClick={this.getStep.bind(this, 0)}>
                        <div className={'firstImg'}/>
                    </button>
                    <button className={'stepBackBtn'} onClick={this.getPrevStep.bind(this)}>
                        <div className={'stepBackImg'}/>
                    </button>
                    <button className={'playBtn'} onClick={this.play.bind(this)}>
                        <div className={this.state.playing ? "pauseImg" : "playImg"}/>
                    </button>
                    <button className={'stepForwardBtn'} onClick={this.getNextStep}>
                        <div className={'stepForwardImg'}/>
                    </button>
                    <Slider value={this.state.step} max={this.state.maxSteps} onChange={this.getStep.bind(this)}/>
                    <div style={{paddingRight: '15px', width: '20px', height: '20px'}}
                         data-tip={''} data-for={'speed'} onWheel={this.scrollHand.bind(this)}>
                        <div className={'speedImg'}/>
                    </div>
                    <ReactTooltip id={'speed'} getContent={() => {
                        return this.state.playingSpeed + "x"
                    }}/>
                </div>
                <div className={"Content"}>
                    <Resize>
                        <ResizeVertical height="60%">
                            <Resize>

                                <ResizeHorizon width="60%">
                                    <div className="ThWindow Comp">
                                        <ThWindow graph={this.state.thGraphs[this.state.step]}
                                                  layouter={this.getLayoutedElements}
                                                  onSynClick={this.onSynClick}
                                                  onNodeDragStop={this.onNodeDragStop}/>

                                    </div>
                                </ResizeHorizon>
                                <ResizeHorizon>
                                    <div className="MutWindow Comp">
                                        <MutWindow graph={this.state.synGraphs[this.state.step]}/>
                                    </div>
                                </ResizeHorizon>
                            </Resize>
                        </ResizeVertical>

                        <ResizeVertical>
                            <Resize>
                                <ResizeHorizon width="40%">
                                    <div className="StackWindow Comp">
                                        <StackWindow data={this.state.stacks[this.state.step]}/>
                                    </div>
                                </ResizeHorizon>
                                <ResizeHorizon>
                                    <div className="InfoWindow Comp">
                                        <InfoWindow graph={this.state.funGraphs[this.state.step]}/>
                                    </div>
                                </ResizeHorizon>
                            </Resize>
                        </ResizeVertical>
                    </Resize>
                </div>
            </div>
        );
    }
}

export default Visualizer;
