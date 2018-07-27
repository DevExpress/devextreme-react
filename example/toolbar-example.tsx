import * as React from "react";
import Example from "./example-block";

import { Button } from "../src/ui/button";
import { Toolbar } from "../src/ui/toolbar";

const ItemComponent  = (data: {text: string}) => {
    return (
        <Button text={data.text}/>
    );
};

const items = [{text: "Text"}, {text: "Text2"}];

export default class extends React.Component<any, any> {
    public render() {
        return (
            <Example title="Toolbar" state={this.state}>
                <Toolbar items={items} itemComponent={ItemComponent} />
            </Example>
        );
    }
}
