import * as React from "react";

import Button from "../src/ui/Button";
import Example from "./example-block";

import Popup from "../src/ui/Popup";

interface IState {
    visible: boolean;
}

export default class extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);
        this.toggle = this.toggle.bind(this);

        this.state = {
            visible: false
        };
    }

    public render() {
        return (
            <Example title="DxPopup">
                <Button text="Show popup" onClick={() => this.toggle(true)} />
                <Popup visible={this.state.visible} closeOnOutsideClick={true} onHidden={() => this.toggle(false)}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    <p>Animi, eveniet tempore, perspiciatis totam qui est minima dicta beatae dolores.</p>
                    <p>Ut reprehenderit, tempore iusto deserunt doloremque fugit.</p>
                </Popup>
            </Example>
        );
    }

    private toggle(visible: boolean) {
        this.setState({
            visible
        });
    }
}
