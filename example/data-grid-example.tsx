import * as React from "react";
import Example from "./example-block";

import { CheckBox } from "../src/ui/check-box";
import { DataGrid, DataGridPaging as Paging } from "../src/ui/data-grid";
import { NumberBox } from "../src/ui/number-box";

import { sales } from "./data";

export default class extends React.Component<any, { expandAll: boolean, pageIndex: number }> {

    private columns = [
        {
            dataField: "orderId",
            caption: "Order ID",
            width: 90
        },
        {
            dataField: "city"
        },
        {
            dataField: "country",
            width: 180,
            groupIndex: 0
        },
        {
            dataField: "region"
        },
        {
            dataField: "date",
            dataType: "date"
        },
        {
            dataField: "amount",
            dataType: "currency",
            width: 90
        }
    ];

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
                    defaultColumns={this.columns}
                >
                    <Paging
                        pageSize={5}
                        pageIndex={this.state.pageIndex}
                    />
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
