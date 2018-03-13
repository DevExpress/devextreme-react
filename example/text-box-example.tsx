import * as React from "react";
import Example from "./example-block";

import { TextBox } from "../src/ui/text-box";

interface IState {
    text: string;
    uncontrolledText: string;
}

export default class extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleUncontrolledChange = this.handleUncontrolledChange.bind(this);

        this.state = {
            text: "text",
            uncontrolledText: ""
        };
    }

    public render() {
        return (
            <Example title="DxTextBox" state={this.state}>
                uncontrolled value
                <TextBox onValueChanged={this.handleUncontrolledChange} valueChangeEvent="keyup" />
                uncontrolled value with default
                <TextBox
                    defaultValue={"initial text"}
                    onValueChanged={this.handleUncontrolledChange}
                    valueChangeEvent="keyup"
                />
                <br />
                controlled state value
                <TextBox value={this.state.text} valueChangeEvent="keyup" />
                <br />
                controlled state value with change handling
                <TextBox value={this.state.text} onValueChanged={this.handleUpdate} valueChangeEvent="keyup" />
            </Example>
        );
    }

    private handleUncontrolledChange(e: any) {
        this.setState({
            uncontrolledText: "#" + e.value
        });
    }

    private handleUpdate(e: any) {
        this.setState({
            text: "#" + e.value ,
        });
    }
}
