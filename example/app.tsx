import * as React from "react";
import * as ReactDOM from "react-dom";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

import AccordionExample from "./accordion-example";
import ChartExample from "./chart-example";
import DataGridExample from "./data-grid-example";
import Example from "./example-block";
import FormExample from "./form-example";
import ListExample from "./list-example";
import PopupExample from "./popup-example";
import ScrollViewExample from "./scroll-view-example";
import TextBoxExample from "./text-box-example";

import { Button, NumberBox, Scheduler } from "../src";

import { appointments } from "./data";

ReactDOM.render(
  <div>

    <Example title="DxButton">
      <Button text="Example Button" />
    </Example>

    <PopupExample />

    <TextBoxExample />

    <Example title="DxNumberBox">
      <NumberBox step={50} min={50} showSpinButtons={true} />
    </Example>

    <ScrollViewExample />

    <FormExample/>

    <ListExample />

    <AccordionExample />

    <DataGridExample/>

    <Example title="DxScheduler">
      <Scheduler
        dataSource={appointments}
        height={400}
        currentView={"week"}
        currentDate={new Date(2017, 4, 25)}
        startDayHour={9}
      />
    </Example>
    <ChartExample />

    <Example title="Element attributes">
      <Button text="Button with style attr" elementAttr={{ style: "background-color: #ffc" }} />
    </Example>

  </div>,
  document.getElementById("app")
);
