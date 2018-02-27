import * as React from "react";
import * as ReactDOM from "react-dom";
import ChartExample from "./ChartExample";
import Example from "./Example";
import ListExample from "./ListExample";
import PopupExample from "./PopupExample";
import ScrollViewExample from "./ScrollViewExample";
import TexBoxExample from "./TexBoxExample";

import Button from "../src/ui/Button";
import DataGrid from "../src/ui/DataGrid";
import NumberBox from "../src/ui/NumberBox";
import Scheduler from "../src/ui/Scheduler";

import { appointments, orangesByDay } from "./data";

ReactDOM.render(
  <div>

    <Example title="DxButton">
      <Button text="Example Button" />
    </Example>

    <PopupExample />

    <TexBoxExample />

    <Example title="DxNumberBox">
      <NumberBox step={50} min={50} showSpinButtons={true} />
    </Example>

    <ScrollViewExample />

    <ListExample />

    <Example title="DxDataGrid">
      <DataGrid dataSource={orangesByDay}/>
    </Example>

    <Example title="DxScheduler">
      <Scheduler
        dataSource={appointments}
        height={400}
        currentView={"week"}
        currentDate={new Date(2017, 4, 25)}
        startDayHour={9}/>
    </Example>
    <ChartExample />

    <Example title="Element attributes">
      <Button text="Button with style attr" elementAttr={{ style: "background-color: #ffc" }} />
    </Example>

  </div>,
  document.getElementById("app")
);
