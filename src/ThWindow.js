import React from 'react';

import ReactFlow, {
    Background, ReactFlowProvider,
} from 'react-flow-renderer';





const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
};

class ThWindow extends React.PureComponent{
    render() {
        const elements = this.props.layouter(this.props.graph);
        console.log('RENDER THREAD')
        return (
            <ReactFlowProvider>
                <ReactFlow
                    elements={elements}
                    nodesConnectable={false}
                    onElementClick={this.props.onSynClick}
                    onNodeDragStop={this.props.onNodeDragStop}
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
export default ThWindow
