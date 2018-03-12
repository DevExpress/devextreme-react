import * as React from "react";
import Example from "./example-block";

import { Button } from "../src/ui/button";
import { TextBox } from "../src/ui/text-box";

export default class extends React.Component<any, { text: string; uncontrolledText: string; }> {

    private textBox: any;

    constructor(props: any) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.updateUncontrolledValue = this.updateUncontrolledValue.bind(this);

        this.state = {
            text: "text",
            uncontrolledText: "initial text"
        };
    }

    public render() {
        return (
            <Example title="DxTextBox" state={this.state}>
                uncontrolled mode
                <TextBox
                    defaultValue={"initial text"}
                    onInitialized={(e) => this.textBox = e.component}
                />
                <Button onClick={this.updateUncontrolledValue} text="Update text" />
                <br />
                controlled state value
                <TextBox value={this.state.text} valueChangeEvent="keyup" />
                <br />
                controlled state value with change handling
                <TextBox value={this.state.text} onValueChanged={this.handleChange} valueChangeEvent="keyup" />
            </Example>
        );
    }

    private updateUncontrolledValue() {
        this.setState({
            uncontrolledText: this.textBox.option("value")
        });
    }

    private handleChange(e: any) {
        this.setState({
            text: "#" + e.value,
        });
    }
}
