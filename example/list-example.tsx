import * as React from "react";

import DataSource from "devextreme/data/data_source";

import Button from "../src/button";
import List from "../src/list";
import TextBox from "../src/text-box";

import Example from "./example-block";

interface IListItemProps {
    text: string;
}

class Item extends React.Component<IListItemProps, { counter: number }> {

    constructor(props: IListItemProps) {
        super(props);
        this.state = {
            counter: 0
        };

        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        return (
            <i onClick={this.handleClick}>
                Component template for item {this.props.text}. <b>Clicks: {this.state.counter}</b>
            </i>
        );
    }

    private handleClick() {
        this.setState({
            counter: this.state.counter + 1
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
export default class extends React.Component<any, { text: string; items: IListItemProps[]; }> {

    private dataSource: DataSource;

    constructor(props: any) {
        super(props);
        this.state = {
            text: "",
            items
        };

        this.dataSource = new DataSource(
            {
                store: {
                    type: "array",
                    data: items
                },
                sort: [
                    { getter: "text", desc: true}
                ],
                pageSize: 1
            }
        );

        this.updateText = this.updateText.bind(this);
        this.addTextToList = this.addTextToList.bind(this);
    }

    public render() {
        return (
            <Example title="DxList" state={this.state} >
                <hr />
                <h4>List with function template</h4>
                <List
                    items={["orange", "apple", "potato"]}
                    itemRender={(item: string) => <i>{item}</i>}
                />
                <hr />
                <h4>List with component template</h4>
                <List
                    items={this.state.items}
                    itemComponent={Item}
                />

                <hr />
                <h4>List with dataSource</h4>
                <List dataSource={this.dataSource} />
                <hr />
                <TextBox value={this.state.text} onValueChanged={this.updateText} valueChangeEvent="input" />
                <Button text="Add to list" onClick={this.addTextToList} />
            </Example>
        );
    }

    public componentWillUnmount() {
        this.dataSource.dispose();
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

const items: IListItemProps[] = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
];
