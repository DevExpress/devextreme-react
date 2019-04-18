import * as React from "react";
import Example from "./example-block";

import { Scheduler } from "../src/scheduler";

import { appointments } from "./data";

class DateCell extends React.PureComponent<any> {
    public render() {
        const now = this.props.data.date;
        const start = new Date(now.getFullYear(), 0, 0).getTime();
        const dayNumber = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return (
            <div style={{ height: "50px", color: now.getDay() % 6 === 0 ? "red" : "" }}>
                <h4>{this.props.text}</h4>
                <h5>{dayNumber}</h5>
            </div>
        );
    }
}

// tslint:disable-next-line:max-classes-per-file
export default class extends React.Component<any, any> {
    public render() {
        return (
            <Example title="DxScheduler">
                <Scheduler
                    dateCellComponent={DateCell}
                    dataSource={appointments}
                    height={400}
                    startDayHour={9}
                    defaultCurrentView={"week"}
                    defaultCurrentDate={new Date(2017, 4, 25)}
                />
          </Example>
        );
    }
}
