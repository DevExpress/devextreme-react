import * as React from "react";
import Example from "./example-block";

import { CheckBox } from "../src/ui/check-box";
import { DataGrid } from "../src/ui/data-grid";

import { sales } from "./data";

export default class extends React.Component<any, { expandAll: boolean }> {

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
            expandAll: true
        };

        this.handleChange = this.handleChange.bind(this);
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
                    paging={{ pageSize: 10 }}
                    selection={{ mode: "multiple" }}
                    filterRow={{ visible: true }}
                    defaultColumns={this.columns}
                />
                <br />
                <CheckBox
                    text="Expand All Groups"
                    value={this.state.expandAll}
                    onValueChanged={this.handleChange}
                />
            </Example>
        );
    }

    private handleChange(e: any) {
        this.setState({
            expandAll: e.value
        });
    }
}
