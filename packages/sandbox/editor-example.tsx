import * as React from 'react';
import Example from './example-block';

import { SelectBox } from '../devextreme-react/src/select-box';
import { TagBox } from '../devextreme-react/src/tag-box';
import { TextBox } from '../devextreme-react/src/text-box';

function fieldRender() {
  return <TextBox value="123" />;
}

export default class extends React.Component<any, any> {
  public render(): React.ReactNode {
    return (
      <Example title="Editors" state={this.state}>
        <SelectBox fieldRender={fieldRender} />
        <br />
        <TagBox dataSource={['1', '2', '3']} showClearButton tagRender={() => <div>test</div>} />
      </Example>
    );
  }
}
