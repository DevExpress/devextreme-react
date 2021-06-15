import * as React from 'react';
import { DateBox } from '../src/date-box';

const EditorComponent = (props) => (
  <DateBox
    defaultValue=""
    onValueChanged={() => {}}
    opened
    type="datetime"
  />
);

export default EditorComponent;
