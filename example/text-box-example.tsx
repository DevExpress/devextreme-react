import * as React from "react";
import Example from "./example-block";

import dxTextBox from "devextreme/ui/text_box";
import { Button } from "../src/ui/button";
import { TextBox } from "../src/ui/text-box";

export default class extends React.Component<any, { text: string; uncontrolledText: string; }> {

    private textBox: dxTextBox;

    constructor(props: any) {
        super(props);
        this.state = {
            text: "text",
            uncontrolledText: "initial text"
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateUncontrolledValue = this.updateUncontrolledValue.bind(this);
        this.setFocusToTextBox = this.setFocusToTextBox.bind(this);
    }

    public render() {
        return (
            <Example title="DxTextBox" state={this.state}>
                uncontrolled mode
                <TextBox
                    defaultValue={"initial text"}
                    ref={(ref) => ref && (this.textBox = ref.instance)}
                />
                <br />
                <Button onClick={this.setFocusToTextBox} text="Set focus" />
                <Button onClick={this.updateUncontrolledValue} text="Update text" />
                <br />
                <br />
                controlled state value
                <TextBox value={this.state.text} valueChangeEvent="input" />
                <br />
                controlled state value with change handling
                <TextBox value={this.state.text} onValueChanged={this.handleChange} valueChangeEvent="input" />
            </Example>
        );
    }

    private updateUncontrolledValue() {
        this.setState({
            uncontrolledText: "#" + this.textBox.option("value")
        });
    }

    private setFocusToTextBox() {
        this.textBox.focus();
    }

    private handleChange(e: any) {
        this.setState({
            text: "#" + (e.value as string).toUpperCase().replace("A", "_"),
        });
    }
}
