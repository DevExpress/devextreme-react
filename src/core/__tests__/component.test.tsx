import * as events from "devextreme/events";

import { mount, React, shallow } from "./setup";
import { TestComponent, Widget, WidgetClass } from "./test-component";

describe("rendering", () => {

    it("renders correctly", () => {
        const component = shallow(
            <TestComponent />
        );
        expect(component.type()).toBe("div");
    });

    it("create widget on componentDidMount", () => {
        shallow(
            <TestComponent />
        );

        expect(WidgetClass.mock.instances.length).toBe(1);
    });

    it("pass templatesRenderAsynchronously to widgets", () => {
        shallow(
            <TestComponent />
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({ templatesRenderAsynchronously: true });
    });

    it("does not create empty children prop", () => {
        const component = shallow(
            <TestComponent />
        );

        expect(Object.keys(component.props())).toEqual([]);
    });

    it("creates nested component", () => {
        mount(
            <TestComponent>
                <TestComponent />
            </TestComponent>
        );

        expect(WidgetClass.mock.instances.length).toBe(2);
        expect(WidgetClass.mock.instances[1]).toEqual({});
    });

    it("do not pass children to options", () => {
        mount(
            <TestComponent>
                <TestComponent />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[1][1].children).toBeUndefined();
    });

    it("do not pass props with special prefix to options", () => {
        shallow(
            <TestComponent _dxProp={12}/>
        );

        expect(WidgetClass.mock.calls[0][1]._dxProp).toBeUndefined();
    });

});

describe("disposing", () => {

    it("call dispose", () => {
        const component = shallow(
            <TestComponent />
        );

        component.unmount();

        expect(Widget.dispose).toBeCalled();
    });

    it("fires dxremove", () => {
        const handleDxRemove = jest.fn();
        const component = mount(
            <TestComponent />
        );

        events.on(component.getDOMNode(), "dxremove", handleDxRemove);
        component.unmount();

        expect(handleDxRemove).toHaveBeenCalledTimes(1);
    });

});
