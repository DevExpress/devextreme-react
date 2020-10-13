import * as React from 'react';
import Example from './example-block';

import { Button } from '../src/button';
import { Toolbar } from '../src/toolbar';

const ItemComponent = (data: {data: {text: string}}) => (
  <Button text={data.data.text} />
);

const items = [{ text: 'Text' }, { text: 'Text2' }];

export default class extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <Example title="Toolbar" state={this.state}>
        <Toolbar items={items} itemComponent={ItemComponent} />
      </Example>
    );
  }
}
