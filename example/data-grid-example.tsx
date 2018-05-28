import * as React from "react";
import Example from "./example-block";

import { CheckBox } from "../src/ui/check-box";
import { DataGrid, DataGridColumn as Columns, DataGridPaging as Paging } from "../src/ui/data-grid";
import { NumberBox } from "../src/ui/number-box";

import { sales } from "./data";

export default class extends React.Component<any, { expandAll: boolean, pageIndex: number }> {

    constructor(props: any) {
        super(props);
        this.state = {
            expandAll: true,
            pageIndex: 1
        };

        this.handleExpandAllChange = this.handleExpandAllChange.bind(this);
        this.handlePageIndexChange = this.handlePageIndexChange.bind(this);
    }

    public render() {
        return (
            <Example title="DxDataGrid" state={this.state}>
                <br />
                <DataGrid
                    dataSource={sales}
                    allowColumnReordering={true}
                    grouping={{ autoExpandAll: this.state.expandAll }}
                    groupPanel={{ visible: true }}
                    pager={{
                        showPageSizeSelector: true,
                        allowedPageSizes: [
                            5,
                            10,
                            20
                        ],
                        showInfo: true
                    }} // tslint:disable-line:jsx-no-multiline-js
                    selection={{ mode: "multiple" }}
                    filterRow={{ visible: true }}
                >
                    <Paging
                        pageSize={5}
                        pageIndex={this.state.pageIndex}
                    />
                    <Columns dataField="orderId"  caption="Order ID" width={90} />
                    <Columns dataField="city" />
                    <Columns dataField="country" groupIndex={0} width={180} />
                    <Columns dataField="region" />
                    <Columns dataField="date" dataType="date" />
                    <Columns dataField="amount" dataType="currency" width={90} />

                </DataGrid>
                <br />
                <CheckBox
                    text="Expand All Groups"
                    value={this.state.expandAll}
                    onValueChanged={this.handleExpandAllChange}
                />
                <br/>
                <br/>
                <NumberBox
                    showSpinButtons={true}
                    value={this.state.pageIndex}
                    onValueChanged={this.handlePageIndexChange}
                />
            </Example>
        );
    }

    private handleExpandAllChange(e: any) {
        this.setState({
            expandAll: e.value
        });
    }
    private handlePageIndexChange(e: any) {
        this.setState({
            pageIndex: e.value
        });
    }
}
