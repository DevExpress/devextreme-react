import { configure, mount, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import Component from "../core/component";

const OptionMock = jest.fn();
const beginUpdateMock = jest.fn();
const endUpdateMock = jest.fn();
const Widget = {
    option: OptionMock,
    beginUpdate: beginUpdateMock,
    endUpdate: endUpdateMock
};

const WidgetMock = jest.fn(() => Widget);

class TestComponent extends Component<any> {
    constructor(props: any) {
        super(props);
        this.WidgetClass = WidgetMock;
        this.templateProps = [{
            tmplOption: "item",
            render: "itemRender",
            component: "itemComponent"
        }];
    }
}

configure({ adapter: new Adapter() });

beforeEach(() => {
    WidgetMock.mockClear();
    OptionMock.mockClear();
    beginUpdateMock.mockClear();
    endUpdateMock.mockClear();
});

describe("component rendering", () => {
    it("renders correctly", () => {
        const component = shallow(
            <TestComponent />
        );
        expect(component.type()).toBe("div");
    });

    it("create widget then on componnetDidMount", () => {
        shallow(
            <TestComponent />
        );

        expect(WidgetMock.mock.instances.length).toBe(1);
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

        expect(WidgetMock.mock.instances.length).toBe(2);
        expect(WidgetMock.mock.instances[1]).toEqual({});
    });
});

describe("templates", () => {

    it("renders function template", () => {
        mount(
            <TestComponent itemRender={ () => <div>Template</div> } />
        );
        const integrationOptions = WidgetMock.mock.calls[0][1].integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();
        expect(integrationOptions.templates.item).toBeDefined();

        const render = integrationOptions.templates.item.render;

        expect(typeof render).toBe("function");
        expect(render({
            container: document.createElement("div"), model: undefined
        }).outerHTML).toBe("<div><div>Template</div></div>");
    });

    it("renders component template", () => {
        const ItemTemplate = () => <div>Template</div>;

        mount(
            <TestComponent itemComponent={ItemTemplate} />
        );

        const integrationOptions = WidgetMock.mock.calls[0][1].integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();
        expect(integrationOptions.templates.item).toBeDefined();

        const render = integrationOptions.templates.item.render;

        expect(typeof render).toBe("function");
        expect(render({
            container: document.createElement("div"), model: undefined
        }).outerHTML).toBe("<div><div>Template</div></div>");
    });
});

describe("mutation detection", () => {

    it("prevents update if no option changed", () => {
        const component = shallow(
            <TestComponent prop="abc" />
        );

        component.setProps({ prop: "abc" });

        expectNoPropsUpdate();
    });

    it("prevents update if array-option mutated", () => {
        const arr = [1, 2, 3];
        const component = shallow(
            <TestComponent prop={arr} />
        );

        arr[0] = 123;
        component.setProps({ prop: arr });

        expectNoPropsUpdate();
    });

    it("prevents update if object-option mutated", () => {
        const obj = {
            field: 123
        };
        const component = shallow(
            <TestComponent prop={obj} />
        );

        obj.field = 456;
        component.setProps({ prop: obj });

        expectNoPropsUpdate();
    });

    it("triggers update if object-option replaced", () => {
        const component = shallow(
            <TestComponent prop={[1, 2, 3]} />
        );

        component.setProps({ prop: [1, 2, 3, 4] });

        expectPropsUpdated("prop", [1, 2, 3, 4]);
    });

    it("triggers update if option added", () => {
        const component = shallow(
            <TestComponent prop="123" />
        );

        component.setProps({ anotherProp: 456 });

        expectPropsUpdated("anotherProp", 456);
    });

    const expectNoPropsUpdate = () => {
        expect(OptionMock.mock.calls.length).toBe(0);
        expect(Widget.beginUpdate.mock.calls.length).toBe(0);
        expect(Widget.endUpdate.mock.calls.length).toBe(0);
    };

    const expectPropsUpdated = (expectedPath: string, value: any) => {
        expect(OptionMock.mock.calls.length).toBe(1);
        expect(Widget.beginUpdate.mock.calls.length).toBe(1);
        expect(Widget.endUpdate.mock.calls.length).toBe(1);
        expect(OptionMock.mock.calls[0][0]).toEqual(expectedPath);
        expect(OptionMock.mock.calls[0][1]).toEqual(value);
    };
});

it("calls option method on props update", () => {
    const component = mount(
        <TestComponent />
    );
    expect(OptionMock.mock.calls.length).toBe(0);

    component.mount();

    expect(OptionMock.mock.calls.length).toBe(0);

    const sampleProps = { text: "1" };
    component.setProps(sampleProps);

    expect(OptionMock.mock.calls.length).toBe(1);
    expect(OptionMock.mock.calls[0][0]).toEqual("text");
    expect(OptionMock.mock.calls[0][1]).toEqual("1");
});
