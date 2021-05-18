import * as React from "react";
import DateBox from "devextreme-react/date-box";

const EditorComponent = (props) => {
  return (
    <DateBox
      defaultValue={props.data.value}
      onValueChanged={(e) => {
        props.data.setValue(e.value);
      }}
      opened={true}
      type="datetime"
    />
  );
};

export default EditorComponent;
