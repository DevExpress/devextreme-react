import * as React from "react";
import DataGrid, {
    Column,
    Scrolling
} from "../src/data-grid";
import Example from "./example-block";

import { products } from "./data";

const renderTemplate = (props: any) => props.value;

export default function() {
    return (
        <Example title="Templates performance Example">
            <DataGrid
                style={{ height: 400 }}
                dataSource={products}
                allowColumnReordering={true}
                allowColumnResizing={true}
                showBorders={true}
                rowAlternationEnabled={true}
            >
                <Scrolling mode={"virtual"} rowRenderingMode={"virtual"} />
                <Column dataField={"id"} cellRender={renderTemplate} />
                <Column dataField={"text"} cellRender={renderTemplate} />
                <Column dataField={"parentId"} cellRender={renderTemplate} />
                <Column dataField={"type"} cellRender={renderTemplate} />
                <Column dataField={"id"} cellRender={renderTemplate} />
                <Column dataField={"text"} cellRender={renderTemplate} />
                <Column dataField={"parentId"} cellRender={renderTemplate} />
                <Column dataField={"type"} cellRender={renderTemplate} />
            </DataGrid>
        </Example>
    );
}
