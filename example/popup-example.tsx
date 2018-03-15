import * as React from "react";

import { Button } from "../src/ui/button";
import { Popup } from "../src/ui/popup";
import { TextBox } from "../src/ui/text-box";
import Example from "./example-block";

const VALID_TEXT = "good";
const validateText = (text: string) => text === VALID_TEXT;

export default class extends React.Component<any, { visible: boolean; text: string; }> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleTextUpdate = this.handleTextUpdate.bind(this);

        this.state = {
            visible: false,
            text: "non-" + VALID_TEXT
        };
    }

    public render() {

        const contentRender = () => (
            <React.Fragment>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                <p>Animi, eveniet tempore, perspiciatis totam qui est minima dicta beatae dolores.</p>
                <p>Ut reprehenderit, tempore iusto deserunt doloremque fugit.</p>
                <br />
                Enter valid text (it should be 'good'):
                <br />
                <TextBox value={this.state.text} onValueChanged={this.handleTextUpdate} valueChangeEvent="keyup" />
            </React.Fragment>
        );

        return (
            <Example title="DxPopup" state={this.state}>
                <TextBox value={this.state.text} onValueChanged={this.handleTextUpdate} valueChangeEvent="keyup" />
                <br />
                <Button text="Show popup" onClick={() => this.toggle(true)} />
                <Popup
                    visible={this.state.visible}
                    contentRender={contentRender}
                    onHiding={() => this.toggle(false)}
                    onShowing={() => this.toggle(true)}
                    width={600}
                    height={400}
                />
            </Example>
        );
    }

    private toggle(visible: boolean) {
        this.setState({
            visible: visible || !validateText(this.state.text)
        });
    }

    private handleTextUpdate(e: any) {
        this.setState({
            text: e.value,
        });
    }
}
