import * as React from "react";

import { Button } from "../src/ui/button";
import { List } from "../src/ui/list";
import { TextBox } from "../src/ui/text-box";

import Example from "./example-block";

interface IState {
    text: string;
    items: IListItem[];
}

interface IListItem {
    text: string;
}

class ItemTemplate extends React.Component<any, any> {
    public render() {
        return <i>This is component template for item {this.props.text}</i>;
    }
}

// tslint:disable-next-line:max-classes-per-file
export default class extends React.Component<any, IState> {

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
        const itemRender: any = (props: any) =>
        <i>This is function template for item {props.text}</i>;

        return (
            <Example title="DxList" state={this.state} >
                <List
                    items={this.state.items}
                    itemRender={itemRender}
                />

                <List items={this.state.items} itemComponent={ItemTemplate}/>

                <TextBox value={this.state.text} onValueChanged={this.updateText} valueChangeEvent="keyup" />
                <Button text="Add to list" onClick={this.addTextToList} />
            </Example>
        );
    }

    private updateText(e: any) {
        const state = { ...this.state };
        state.text = e.component.option("value");
        this.setState(state);
    }

    private addTextToList() {
        const state = { ...this.state };
        state.items = [...state.items, { text: state.text }];
        state.text = "";
        this.setState(state);
    }
}

const items: IListItem[] = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
];
