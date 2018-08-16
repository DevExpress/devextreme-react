import * as React from "react";
import Example from "./example-block";

import { SelectBox } from "../src/ui/select-box";
import { TagBox } from "../src/ui/tag-box";
import { TextBox } from "../src/ui/text-box";

function fieldRender() {
    return <TextBox value="123"/>;
}

export default class extends React.Component<any, any> {
    public render() {
        return (
            <Example title="Editors" state={this.state}>
                <SelectBox fieldRender={fieldRender} />
                <br />
                <TagBox dataSource={["1", "2", "3"]} showClearButton={true} tagRender={() => <div>test</div>} />
            </Example>
        );
    }
}
