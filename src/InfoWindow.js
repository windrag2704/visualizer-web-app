import React, {PureComponent} from "react";
import ReactFlow, { Background, ReactFlowProvider} from "react-flow-renderer";
import ThreadNode from "./ThreadNode";
import FuncNode from "./FuncNode";


const nodeTypes = {
    func: FuncNode,
    thread: ThreadNode,
};

const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
};

class InfoWindow extends PureComponent {
    render() {
        const elements = this.props.graph;
        console.log('RENDER FUNC')
        return (
            <ReactFlowProvider>
                <ReactFlow
                    elements={elements}
                    nodesConnectable={false}
                    onLoad={onLoad}
                    snapToGrid={true}
                    snapGrid={[15, 15]}
                    nodeTypes={nodeTypes}
                >
                    <Background color="#aaa" gap={16}/>
                </ReactFlow>
            </ReactFlowProvider>
        );
    }
}

export default InfoWindow;
