import * as React from "react";
import Example from "./example-block";

import { TextBox } from "../src/ui/text-box";

export default class extends React.Component<any, { text: string; uncontrolledText: string; }> {

    constructor(props: any) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.hangleUncontrolledChange = this.hangleUncontrolledChange.bind(this);

        this.state = {
            text: "text",
            uncontrolledText: ""
        };
    }

    public render() {
        return (
            <Example title="DxTextBox" state={this.state}>
                uncontrolled value
                <TextBox onValueChanged={this.hangleUncontrolledChange} valueChangeEvent="keyup" />
                uncontrolled value with default
                <TextBox
                    defaultValue={"initial text"}
                    valueChangeEvent="keyup"
                />
                <br />
                controlled state value
                <TextBox value={this.state.text} valueChangeEvent="keyup" />
                <br />
                controlled state value with change handling
                <TextBox value={this.state.text} onValueChanged={this.handleChange} valueChangeEvent="keyup" />
            </Example>
        );
    }

    private hangleUncontrolledChange(e: any) {
        this.setState({
            uncontrolledText: "#" + e.value
        });
    }

    private handleChange(e: any) {
        this.setState({
            text: "#" + e.value ,
        });
    }
}
