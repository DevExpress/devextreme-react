import * as React from "react";

import { Button } from "../src/ui/button";
import { List } from "../src/ui/list";
import { TextBox } from "../src/ui/text-box";

import Example from "./example-block";

interface IListItem {
    text: string;
}

class Item extends React.Component<IListItem, { counter: number }> {

    constructor(props: IListItem) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);

        this.state = {
            counter: 0
        };
    }

    public render() {
        return (
            <i onClick={this.clickHandler}>
                Component template for item {this.props.text}. <b>Clicks: {this.state.counter}</b>
            </i>
        );
    }

    private clickHandler() {
        this.setState({
            counter: this.state.counter + 1
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
export default class extends React.Component<any, { text: string; items: IListItem[]; }> {

    constructor(props: any) {
        super(props);
        this.updateText = this.updateText.bind(this);
        this.addTextToList = this.addTextToList.bind(this);

        this.state = {
            text: "",
            items
        };
    }

    public render() {
        return (
            <Example title="DxList" state={this.state} >

                <List
                    items={this.state.items}
                    itemRender={(props: IListItem) => <i>Function template for item {props.text}</i>}
                />
                <hr />
                <List
                    items={this.state.items}
                    itemComponent={Item}
                />
                <br />
                <TextBox value={this.state.text} onValueChanged={this.updateText} valueChangeEvent="keyup" />
                <Button text="Add to list" onClick={this.addTextToList} />
            </Example>
        );
    }

    private updateText(e: any) {
        this.setState({
            text: e.value
        });
    }

    private addTextToList() {
        this.setState({
            items: [...this.state.items, { text: this.state.text }],
            text: ""
        });
    }
}

const items: IListItem[] = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
];
