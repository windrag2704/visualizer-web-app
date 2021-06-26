import {PureComponent} from "react";
import React from 'react';

import ReactFlow, {
    Background, ReactFlowProvider,
} from 'react-flow-renderer';


const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
};

class MutWindow extends PureComponent {
    render() {
        const elements = this.props.graph;
        console.log('RENDER MUT')

        return (
            <ReactFlowProvider>
                <ReactFlow
                    elements={elements}
                    nodesConnectable={false}
                    onLoad={onLoad}
                    snapToGrid={true}
                    snapGrid={[15, 15]}
                >
                    <Background color="#aaa" gap={16}/>
                </ReactFlow>
            </ReactFlowProvider>
        );
    }
};
export default MutWindow
