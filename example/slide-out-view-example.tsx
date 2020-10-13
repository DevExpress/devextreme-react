import * as React from 'react';
import Example from './example-block';

import {
  Button, SlideOutView, Template, Toolbar,
} from '../src';

function renderMenuTemplate() {
  const items = [{
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    options: {
      icon: 'menu',
    },
  }, {
    location: 'center',
    locateInMenu: 'auto',
    template: 'menuTextTemplate',
  }];

  return (
    <React.Fragment>
      <Toolbar items={items}>
        <Template name="menuTextTemplate" render={() => <h4>Demo</h4>} />
      </Toolbar>
    </React.Fragment>
  );
}

export default class extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      menuVisible: true,
    };
    this._optionChangeHandler = this._optionChangeHandler.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  public toggle() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  private _optionChangeHandler(args: {name: string, value: any }) {
    if (args.name === 'menuVisible') {
      this.setState({ menuVisible: args.value });
    }
  }

  public render() {
    return (
      <Example title="DxSlideOutView" state={this.state}>
        <Button text="toggle" onClick={this.toggle} />
        <SlideOutView
          height={200}
          swipeEnabled={true}
          menuVisible={this.state.menuVisible}
          menuRender={renderMenuTemplate}
          onOptionChanged={this._optionChangeHandler}
        >
          This is SlideOutView content
        </SlideOutView>
      </Example>
    );
  }
}
