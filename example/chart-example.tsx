import * as React from "react";

import { orangesByDay } from "./data";
import Example from "./example-block";

import { Button } from "../src/ui/button";
import { Chart } from "../src/ui/chart";
import { TextBox } from "../src/ui/text-box";

interface IState {
    currentTime: string;
    seriesName: string;
    series: any[];
}

export default class extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);
        this.updateTime = this.updateTime.bind(this);
        this.updateSeriesName = this.updateSeriesName.bind(this);

        this.state = {
            currentTime: this.GetTimeString(),
            seriesName: "My oranges",
            series: [{
                argumentField: "day",
                valueField: "oranges",
                name: "My oranges",
                type: "line"
            }]
        };
    }

    public render() {
        return (
            <Example title="DxChart" state={this.state}>

                <div className="paragraph dx-field">
                    <div className="dx-field-label">
                        {this.state.currentTime}
                    </div>
                    <div className="dx-field-value">
                        <Button text="Update time" onClick={this.updateTime} />
                    </div>
                </div>

                <div className="paragraph">
                    <Updater onChange={this.updateSeriesName} />
                </div>

                <Chart dataSource={orangesByDay} series={this.state.series} />

            </Example>
        );
    }

    private updateTime() {
        this.setState({
            currentTime: this.GetTimeString()
        });
    }

    private updateSeriesName(seriesName: string) {
        const series = [...this.state.series];
        series[0].name = seriesName;
        this.setState({
            seriesName,
            series
        });
    }

    private GetTimeString = () => new Date().toLocaleTimeString();

}

// tslint:disable-next-line:max-classes-per-file
class Updater extends React.Component<{ onChange: (value: string) => void }, { value: string }> {

    constructor(props: { onChange: (value: string) => void }) {
        super(props);

        this.update = this.update.bind(this);
        this.fireOnChange = this.fireOnChange.bind(this);
        this.state = {
            value: ""
        };
    }

    public render() {
        return (
            <div className="dx-field">
                <div className="dx-field-label">
                    <TextBox value={this.state.value} onValueChanged={this.update} valueChangeEvent="keyup" />
                </div>
                <div className="dx-field-value">
                    <Button text="Update series name" onClick={this.fireOnChange} />
                </div>
            </div>
        );
    }

    private fireOnChange() {
        this.props.onChange(this.state.value);
    }

    private update(e: any) {
        this.setState({
            value: e.value
        });
    }
}
