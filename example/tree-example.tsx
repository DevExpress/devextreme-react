import * as React from "react";
import { TreeView } from "../src/tree-view";
import Example from "./example-block";

import { products } from "./data";

const renderTreeViewItem = (item: any) => {
    return item.text;
};

export default function() {
    return (
        <Example title="Tree Example">
            <TreeView
                height={300}
                dataSource={products}
                dataStructure="plain"
                rootValue={-1}
                itemRender={renderTreeViewItem}
            />
        </Example>
    );
}
