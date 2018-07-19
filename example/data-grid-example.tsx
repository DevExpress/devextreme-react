import * as React from "react";
import Example from "./example-block";

import CheckBox from "../src/ui/check-box";
import DataGrid, {
    Column,
    FilterRow,
    Grouping,
    GroupPanel,
    MasterDetail,
    Pager,
    Paging,
    Selection
} from "../src/ui/data-grid";
import NumberBox from "../src/ui/number-box";

import { sales } from "./data";

const DetailComponent = (props: any) => {
    return (
        <p>Row data:
            <br/>
            {JSON.stringify(props.data)}
        </p>
    );
};

const CityComponent = (props: any) => {
    return <i>{props.displayValue}</i>;
};

export default class extends React.Component<any, { expandAll: boolean, pageSize: number }> {

    constructor(props: any) {
        super(props);
        this.state = {
            expandAll: true,
            pageSize: 5
        };

        this.handleExpandAllChange = this.handleExpandAllChange.bind(this);
        this.handlePageIndexChange = this.handlePageIndexChange.bind(this);
    }

    public render() {
        return (
            <Example title="DxDataGrid" state={this.state}>
                <br />
                <CheckBox
                    text="Expand All Groups"
                    value={this.state.expandAll}
                    onValueChanged={this.handleExpandAllChange}
                />
                <br />
                <br />
                Page size:
                <br />
                <NumberBox
                    showSpinButtons={true}
                    step={5}
                    value={this.state.pageSize}
                    onValueChanged={this.handlePageIndexChange}
                />
                <br />
                <DataGrid
                    dataSource={sales}
                    allowColumnReordering={true}
                >
                    <GroupPanel visible={true} />
                    <Grouping autoExpandAll={this.state.expandAll} />
                    <FilterRow visible={true} />
                    <Selection mode="multiple" />

                    <Column dataField="orderId" caption="Order ID" width={90} />
                    <Column dataField="city" cellComponent={CityComponent}/>
                    <Column dataField="country" groupIndex={0} width={180} />
                    <Column dataField="region" />
                    <Column dataField="date" dataType="date" />
                    <Column dataField="amount" dataType="currency" width={90} />

                    <Pager
                        allowedPageSizes={[5, 10, 15, 20]}
                        showPageSizeSelector={true}
                        showInfo={true}
                    />
                    <Paging
                        defaultPageIndex={2}
                        pageSize={this.state.pageSize}
                    />
                    <MasterDetail enabled={true} component={DetailComponent} />
                </DataGrid>
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
            pageSize: e.value
        });
    }
}
