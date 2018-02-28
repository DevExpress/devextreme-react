import * as React from "react";
import Example from "./example-block";

import { TextBox } from "../src/ui/text-box";

interface IState {
    text: string;
}

export default class extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.update = this.update.bind(this);

        this.state = {
            text: "text"
        };
    }

    public render() {
        return (
            <Example title="DxTextBox" state={this.state}>
                no value
                <TextBox />
                const value
                <TextBox value="const text" />
                <br />
                state value
                <TextBox value={this.state.text} />
                <br />
                state value with change handling
                <TextBox value={this.state.text} onValueChanged={this.update} valueChangeEvent="keyup" />
            </Example>
        );
    }

    private update(e: any) {
        const state = { ...this.state };
        state.text = e.component.option("value");
        this.setState(state);
    }
}
