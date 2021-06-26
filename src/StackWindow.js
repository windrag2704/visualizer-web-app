import React, {PureComponent} from "react";

function Line(props) {
    return <div className={"stackLine"}>{props.value}</div>
}

function Stack(props) {
    return <div className={"stack"}>
        <div className={"stackLine stackTitle"}>Thread: {props.title}</div>
        {props.value.map((line, index) => {
        return <Line key={index} value={line}/>
    })}</div>;
}

function StackList(props) {
    let stacks = props.stacks;
    if (stacks === undefined) {
        return <div></div>
    } else {
        return (
            <div className={"stacks"}>
                {stacks.stacks.map((stack) =>
                    <Stack key={stack.threadId}
                           value={stack.stack}
                            title={stack.threadId}/>
                )}
            </div>
        );
    }
}

export class StackWindow extends PureComponent {
    render() {
        console.log('RENDER STACK')
        let data = this.props.data;
        return (
            <StackList stacks={data}/>
        )
    }
}