import * as React from 'react';
import Example from './example-block';

import { Template } from '../src/core/template';

import DataGrid, {
    Column,
    FilterRow,
    Grouping,
    GroupPanel,
    MasterDetail,
    Pager,
    Paging,
    Selection,
} from '../src/data-grid';
import NumberBox from '../src/number-box';

import { sales } from './data';

const DetailComponent = ({ data: { data } }: any) => {
    return (
        <p>Row data:
            <br/>
            {JSON.stringify(data)}
        </p>
    );
};

const CityComponent = (props: any) => {
    return <i>{props.data.displayValue}</i>;
};

const RegionComponent = (props: any) => {
    return <b>{props.data.displayValue}</b>;
};

export default class extends React.Component<any, { expandAll: boolean, pageSize: number }> {

    constructor(props: any) {
        super(props);
        this.state = {
            expandAll: true,
            pageSize: 5,
        };

        this.handleToolbarPreparing = this.handleToolbarPreparing.bind(this);
        this.handlePageIndexChange = this.handlePageIndexChange.bind(this);
    }

    public render() {
        return (
            <Example title="DxDataGrid" state={this.state}>
                <br />
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
                    onToolbarPreparing={this.handleToolbarPreparing}
                >
                    <GroupPanel visible={true} />
                    <Grouping autoExpandAll={this.state.expandAll} />
                    <FilterRow visible={true} />
                    <Selection mode="multiple" />

                    <Column dataField="orderId" caption="Order ID" width={90} />
                    <Column dataField="city" cellComponent={CityComponent}/>
                    <Column dataField="country" groupIndex={0} width={180} />
                    <Column dataField="region" cellComponent={RegionComponent}/>
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

                    <Template name={'toolbarLabel'}>
                        {this.state.expandAll ? <b>Collapse Groups:</b> : <b>Expand Groups:</b>}
                    </Template>
                </DataGrid>
            </Example>
        );
    }

    private handleToolbarPreparing(args: any) {
        args.toolbarOptions.items.unshift({
            location: 'after',
            template: 'toolbarLabel',
          },
          {
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'chevronup',
                onClick: (e: any) => {
                  this.setState((state) => {
                    e.component.option('icon', state.expandAll ? 'chevrondown' : 'chevronup');
                    return {
                        expandAll: !state.expandAll,
                    };
                  });
                },
            },
        });
      }

    private handlePageIndexChange(e: any) {
        this.setState({
            pageSize: e.value,
        });
    }
}
