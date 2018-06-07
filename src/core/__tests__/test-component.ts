import { Component } from "../../core/component";

const eventHandlers: { [index: string]: (e?: any) => void } = {};

const Widget = {
    option: jest.fn(),
    beginUpdate: jest.fn(),
    endUpdate: jest.fn(),
    on: (event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler;
    },
    dispose: jest.fn()
};

const WidgetClass = jest.fn(() => Widget);

class TestComponent<P = any> extends Component<P> {

    constructor(props: P) {
        super(props);

        this._WidgetClass = WidgetClass;
    }
}

function fireOptionChange(fullName: string, value: any) {
    eventHandlers.optionChanged({
        name: fullName.split(".")[0],
        fullName,
        value
    });
}

export {
    TestComponent,
    Widget,
    WidgetClass,
    eventHandlers,
    fireOptionChange
};
