import { uppercaseFirst } from '../../../tools/src/helpers';
import { Component } from '../../core/component';

const eventHandlers: { [index: string]: (e?: any) => void } = {};

const Widget = {
  option: jest.fn(),
  resetOption: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  on: (event: string, handler: (e: any) => void) => {
    eventHandlers[event] = handler;
  },
  dispose: jest.fn(),
};

const WidgetClass = jest.fn(() => Widget);

class TestComponent<P = any> extends Component<P> {
  protected _WidgetClass = WidgetClass;

  protected _defaults = Object.keys(this.props).reduce((acc, p) => {
    if (!p.startsWith('on')) {
      acc[`default${uppercaseFirst(p)}`] = p;
    }
    return acc;
  }, {});
}

function fireOptionChange(fullName: string, value: any) {
  eventHandlers.optionChanged({
    name: fullName.split('.')[0],
    fullName,
    value,
  });
}

export {
  TestComponent,
  Widget,
  WidgetClass,
  eventHandlers,
  fireOptionChange,
};
