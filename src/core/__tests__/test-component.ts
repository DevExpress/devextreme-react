import { Component } from '../component';

const eventHandlers: { [index: string]: (e?: any) => void } = {};

const Widget = {
  option: jest.fn(),
  resetOption: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  on: (event: string, handler: (e: any) => void): void => {
    eventHandlers[event] = handler;
  },
  dispose: jest.fn(),
};

const WidgetClass = jest.fn(() => Widget);

class TestComponent<P = any> extends Component<P> {
  protected _WidgetClass = WidgetClass;
}

function fireOptionChange(fullName: string, value: any): void {
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
