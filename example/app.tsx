import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

import AccordionExample from './accordion-example';
import ChartExample from './chart-example';
import DataGridExample from './data-grid-example';
import DrawerExample from './drawer-example';
import EditorExample from './editor-example';
import Example from './example-block';
import FormExample from './form-example';
import ListExample from './list-example';
import MapExample from './map-example';
import PopupExample from './popup-example';
import SchedulerExample from './scheduler-example';
import ScrollViewExample from './scroll-view-example';
import SelectBoxExample from './selectbox-example';
import SlideOutViewExample from './slide-out-view-example';
import StandaloneValidatorExample from './standalone-validator';
import TextBoxExample from './text-box-example';
import ToolbarExample from './toolbar-example';
import ValidationExample from './validation-example';

import { Button, NumberBox } from '../src';
import BoxExample from './box-example';

ReactDOM.render(
  <div>
    <AccordionExample />

    <BoxExample />

    <Example title="Element attributes">
      <Button text="Button with style attr" style={{ backgroundColor: '#ffc' }} />
    </Example>

    <Example title="DxButton">
      <Button text="Example Button" />
    </Example>

    <ChartExample />

    <DataGridExample />

    <DrawerExample />

    <EditorExample />

    <FormExample />

    <ListExample />

    <MapExample />

    <Example title="DxNumberBox">
      <NumberBox
        defaultValue={102.453}
        step={10}
        min={50}
        format="$ #0.##"
        showSpinButtons
      />
    </Example>

    <PopupExample />

    <SchedulerExample />

    <ScrollViewExample />

    <Example title="SelectBox example">
      <SelectBoxExample />
    </Example>

    <SlideOutViewExample />

    <StandaloneValidatorExample />

    <TextBoxExample />

    <ToolbarExample />

    <ValidationExample />
  </div>,
  document.getElementById('app'),
);
