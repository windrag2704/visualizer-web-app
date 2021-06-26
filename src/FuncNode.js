import React from 'react';
import { Handle } from 'react-flow-renderer';

const customNodeStyles = {
};

const FuncNode = ({ data }) => {
    return (
        <div style={customNodeStyles}>
            <Handle type="target" position="top"/>
            <Handle type="source" position="bottom"/>
            <div>{data.label}</div>
        </div>
    );
};

export default FuncNode;