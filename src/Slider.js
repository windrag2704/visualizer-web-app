import React from "react";
import {RangeStepInput} from "react-range-step-input";

export class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    render() {
        return (
            <div style={{
                display: "flex", flexDirection: "row", justifyContent: "flex-end",
                width: "75%", flexGrow: "1"
            }}>
                <RangeStepInput
                    style={{width: "100%"}}
                    min={0} max={this.props.max}
                    value={this.props.value} step={1}
                    onChange={this.props.onChange}
                />
                <div style={{width: "4em", textAlign: "center"}}>{this.props.value}</div>
            </div>
        )
    }
}