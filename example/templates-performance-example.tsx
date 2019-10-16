import * as React from "react";
import DataGrid, {
    Column,
    Scrolling
} from "../src/data-grid";

import { sales } from "./data";
import Example from "./example-block";

const renderTemplate = (props: any) => props.value;

class App extends React.Component {

    public render() {
        return (
            <Example title="DxDataGrid">
                <DataGrid
                    style={{ height: 400 }}
                    dataSource={sales}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    showBorders={true}
                    rowAlternationEnabled={true}
                >
                    <Scrolling mode={"virtual"} rowRenderingMode={"virtual"} />

                    <Column dataField={"region"} cellRender={renderTemplate} />

                    <Column dataField={"country"} cellRender={renderTemplate} />

                    <Column dataField={"city"} cellRender={renderTemplate} />

                    <Column dataField={"amount"} cellRender={renderTemplate} />

                    <Column dataField={"date"} cellRender={renderTemplate} />
                    <Column dataField={"region"} cellRender={renderTemplate} />

                    <Column dataField={"country"} cellRender={renderTemplate} />

                    <Column dataField={"city"} cellRender={renderTemplate} />

                    <Column dataField={"amount"} cellRender={renderTemplate} />

                    <Column dataField={"date"} cellRender={renderTemplate} />

                </DataGrid>
            </Example>
        );
    }
}

export default App;
