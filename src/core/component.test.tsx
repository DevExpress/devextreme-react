import { configure as configureEnzyme, mount, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import Component from "../core/component";

const Widget = {
    option: jest.fn(),
    beginUpdate: jest.fn(),
    endUpdate: jest.fn()
};

const WidgetClass = jest.fn(() => Widget);

class TestComponent extends Component<any> {

    constructor(props: any) {
        super(props);

        this.WidgetClass = WidgetClass;
    }
}

configureEnzyme({ adapter: new Adapter() });

beforeEach(() => {
    jest.clearAllMocks();
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

        expect(WidgetClass.mock.instances.length).toBe(1);
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
});

describe("templates", () => {

    describe("function template", () => {

        it("pass integrationOptions to widget", () => {
            const itemRender: any = () => <div>Template</div>;
            mount(
                <ComponentWithTemplates itemRender={itemRender} />
            );
            const integrationOptions = WidgetClass.mock.calls[0][1].integrationOptions;

            expect(integrationOptions).toBeDefined();
            expect(integrationOptions.templates).toBeDefined();
            expect(integrationOptions.templates.item).toBeDefined();
            expect(typeof integrationOptions.templates.item.render).toBe("function");
        });

        it("renders", () => {
            const itemRender: any = (props: any) => <div>Template {props.text}</div>;
            mount(
                <ComponentWithTemplates itemRender={itemRender} />
            );

            const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;

            expect(render({
                container: document.createElement("div"), model: { text: "with data" }
            }).outerHTML).toBe("<div><div>Template with data</div></div>");
        });
    });

    describe("component template", () => {

        it("pass integrationOptions to widget", () => {
            const ItemTemplate = () => <div>Template</div>;
            mount(
                <ComponentWithTemplates itemComponent={ItemTemplate} />
            );

            const integrationOptions = WidgetClass.mock.calls[0][1].integrationOptions;

            expect(integrationOptions).toBeDefined();
            expect(integrationOptions.templates).toBeDefined();
            expect(integrationOptions.templates.item).toBeDefined();
            expect(typeof integrationOptions.templates.item.render).toBe("function");
        });

        it("renders", () => {
            const ItemTemplate = (props: any) => <div>Template {props.text}</div>;
            mount(
                <ComponentWithTemplates itemComponent={ItemTemplate} />
            );

            const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;

            expect(render({
                container: document.createElement("div"), model: { text: "with data" }
            }).outerHTML).toBe("<div><div>Template with data</div></div>");
        });
    });

    // tslint:disable-next-line:max-classes-per-file
    class ComponentWithTemplates extends TestComponent {

        constructor(props: any) {
            super(props);

            this.templateProps = [{
                tmplOption: "item",
                render: "itemRender",
                component: "itemComponent"
            }];
        }
    }
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
        expect(Widget.option.mock.calls.length).toBe(0);
        expect(Widget.beginUpdate.mock.calls.length).toBe(0);
        expect(Widget.endUpdate.mock.calls.length).toBe(0);
    };

    const expectPropsUpdated = (expectedPath: string, value: any) => {
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.beginUpdate.mock.calls.length).toBe(1);
        expect(Widget.endUpdate.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0][0]).toEqual(expectedPath);
        expect(Widget.option.mock.calls[0][1]).toEqual(value);
    };
});

it("calls option method on props update", () => {
    const component = mount(
        <TestComponent />
    );
    expect(Widget.option.mock.calls.length).toBe(0);

    component.mount();

    expect(Widget.option.mock.calls.length).toBe(0);

    const sampleProps = { text: "1" };
    component.setProps(sampleProps);

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0][0]).toEqual("text");
    expect(Widget.option.mock.calls[0][1]).toEqual("1");
});
