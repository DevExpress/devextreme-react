import * as events from "devextreme/events";
import { configure as configureEnzyme, mount, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import Component from "../core/component";
import { Template } from "../core/template";

const eventHandlers: { [index: string]: (e?: any) => void}  = {};
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

    public _nestedOptionIdPrefix: string = "abc-testComponent-";

    constructor(props: P) {
        super(props);

        this._WidgetClass = WidgetClass;
    }
}

configureEnzyme({ adapter: new Adapter() });
jest.useFakeTimers();

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

    it("pass templatesRenderAsynchronously to widgets", () => {
        shallow(
            <TestComponent />
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({templatesRenderAsynchronously: true});
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
});

describe("templates", () => {
    function renderItemTemplate(model: any, container?: any): Element {
        container = container || document.createElement("div");
        const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;
        return render({
            container, model
        });
    }

    describe("function template", () => {

        it("pass integrationOptions to widget", () => {
            const itemRender: any = () => <div>Template</div>;
            mount(
                <ComponentWithTemplates itemRender={itemRender} />
            );
            const options = WidgetClass.mock.calls[0][1];

            expect(options.item).toBe("item");

            const integrationOptions = options.integrationOptions;

            expect(integrationOptions).toBeDefined();
            expect(integrationOptions.templates).toBeDefined();
            expect(integrationOptions.templates.item).toBeDefined();
            expect(typeof integrationOptions.templates.item.render).toBe("function");
        });

        it("renders", () => {
            const itemRender: any = jest.fn((props: any) => <div className={"template"}>Template {props.text}</div>);
            const component = mount(
                <ComponentWithTemplates itemRender={itemRender} />
            );
            renderItemTemplate({ text: "with data" });

            expect(itemRender).toBeCalled();
            component.update();
            expect(component.find(".template").html()).toBe('<div class="template">Template with data</div>');
        });

        it("renders inside unwrapped container", () => {
            function itemRender() {
                return <div className={"template"}>Template</div>;
            }
            const component = mount(
                <ComponentWithTemplates itemRender={itemRender} />
            );
            renderItemTemplate({}, { get: () => document.createElement("div")});
            component.update();
            expect(component.find(".template").html()).toBe('<div class="template">Template</div>');
        });

        it("renders simple item", () => {
            const itemRender: any = jest.fn((text: string) => <div className={"template"}>Template {text}</div>);
            const component = mount(
                <ComponentWithTemplates itemRender={itemRender} />
            );
            renderItemTemplate("with data");

            expect(itemRender).toBeCalled();
            component.update();
            expect(component.find(".template").html()).toBe('<div class="template">Template with data</div>');
        });

        it("renders inside component", () => {
            const itemRender: any = jest.fn((props: any) => <div className={"template"}>Template {props.text}</div>);
            const component = mount(
                <ComponentWithTemplates itemRender={itemRender} />
            );
            renderItemTemplate({ text: "is rendered" });
            expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(1);
            component.update();
            expect(component.find(".template").html()).toBe('<div class="template">Template is rendered</div>');
        });
    });

    describe("component template", () => {

        it("pass integrationOptions to widget", () => {
            const ItemTemplate = () => <div>Template</div>;
            mount(
                <ComponentWithTemplates itemComponent={ItemTemplate} />
            );

            const options = WidgetClass.mock.calls[0][1];

            expect(options.item).toBe("item");

            const integrationOptions = options.integrationOptions;

            expect(integrationOptions).toBeDefined();
            expect(integrationOptions.templates).toBeDefined();
            expect(integrationOptions.templates.item).toBeDefined();
            expect(typeof integrationOptions.templates.item.render).toBe("function");
        });

        it("renders", () => {
            const ItemTemplate = (props: any) => <div className={"template"}>Template {props.text}</div>;
            const component = mount(
                <ComponentWithTemplates itemComponent={ItemTemplate} />
            );

            renderItemTemplate({ text: "with data" });
            component.update();
            expect(component.find(".template").html()).toBe('<div class="template">Template with data</div>');
        });

        it("renders inside component", () => {
            const ItemTemplate = (props: any) => <div className={"template"}>Template {props.text}</div>;
            const component = mount(
                <ComponentWithTemplates itemComponent={ItemTemplate} />
            );
            renderItemTemplate({ text: "is rendered" });
            expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(1);
            component.update();
            expect(component.find(".template").html()).toBe('<div class="template">Template is rendered</div>');
        });
    });

    describe("nested template", () => {
        it("pass integrationOptions to widget", () => {
            const ItemTemplate = () => <div>Template</div>;
            mount(
                <ComponentWithTemplates>
                    <Template name={"item1"} render={ItemTemplate}/>
                    <Template name={"item2"} component={ItemTemplate}/>
                </ComponentWithTemplates >
            );

            const options = WidgetClass.mock.calls[0][1];

            expect(options.item).toBeUndefined();

            const integrationOptions = options.integrationOptions;

            expect(integrationOptions).toBeDefined();
            expect(integrationOptions.templates).toBeDefined();

            expect(integrationOptions.templates.item1).toBeDefined();
            expect(typeof integrationOptions.templates.item1.render).toBe("function");

            expect(integrationOptions.templates.item2).toBeDefined();
            expect(typeof integrationOptions.templates.item2.render).toBe("function");
        });
    });

    it("pass component option changes to widget", () => {
        const ItemTemplate = () => <div>First Template</div>;
        const component = mount(
            <ComponentWithTemplates itemComponent={ItemTemplate} />
        );

        const SecondItemTemplate = () => <div>Second Template</div>;
        component.setProps({
            itemComponent: SecondItemTemplate
        });
        jest.runAllTimers();
        const optionCalls = Widget.option.mock.calls;
        expect(optionCalls.length).toBe(2);

        expect(optionCalls[0][0]).toBe("integrationOptions");
        expect(typeof optionCalls[0][1].templates.item.render).toBe("function");

        expect(optionCalls[1][0]).toBe("item");
        expect(optionCalls[1][1]).toBe("item");
    });

    it("removes deleted nodes from state", () => {
        const ItemTemplate = (props: any) => <div className={"template"}>Template {props.text}</div>;
        const component = mount(
            <ComponentWithTemplates itemComponent={ItemTemplate} />
        );
        renderItemTemplate({});
        expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(1);
        component.update();
        events.triggerHandler(component.find(".template").getDOMNode(), "dxremove");
        component.update();
        expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(0);
    });

    // tslint:disable-next-line:max-classes-per-file
    class ComponentWithTemplates extends TestComponent {

        constructor(props: any) {
            super(props);

            this._templateProps = [{
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

describe("controlled mode", () => {

    it("binds callback for optionChanged", () => {
        mount(
            <ControlledComponent everyOption={123} />
        );

        expect(eventHandlers).toHaveProperty("optionChanged");
    });

    it("rolls option value back", () => {
        mount(
            <ControlledComponent everyOption={123} />
        );

        eventHandlers.optionChanged({ name: "everyOption", value: 234});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "everyOption", 123 ]);
    });

    it("rolls option value back if value has no changes", () => {
        const component = mount(
            <ControlledComponent everyOption={123} anotherOption={"const"}/>
        );

        eventHandlers.optionChanged({ name: "anotherOption", value: "changed"});
        component.setProps({everyOption: 234});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(2);
        expect(Widget.option.mock.calls[1]).toEqual([ "anotherOption", "const" ]);
    });

    it("apply option change if option really change", () => {
        const component = mount(
            <ControlledComponent everyOption={123}/>
        );

        eventHandlers.optionChanged({ name: "everyOption", value: 234});
        component.setProps({everyOption: 234});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "everyOption", 234 ]);
    });

    it("pass default values to widget", () => {
        mount(
            <ControlledComponent defaultControlledOption={"default"}/>
        );

        expect(WidgetClass.mock.calls[0][1].controlledOption).toBe("default");
    });

    it("does not control option with default prefix", () => {
        mount(
            <ControlledComponent defaultControlledOption={"default"}/>
        );
        eventHandlers.optionChanged({ name: "controlledOption", value: "changed"});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(0);
    });

    it("ignores changes in default props", () => {
        const component = mount(
            <ControlledComponent defaultControlledOption={"default"}/>
        );
        component.setProps({
            defaultControlledOption: "changed"
        });
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(0);
    });

    it("does not pass default values to widget if controlledOption set", () => {
        mount(
            <ControlledComponent defaultControlledOption={"default"} controlledOption={"controlled"}/>
        );

        expect(WidgetClass.mock.calls[0][1].controlledOption).toBe("controlled");
    });

    it("does not fire events when option changed while props updating", () => {
        const controlledOptionChanged = jest.fn();
        const component = mount(
            <ControlledComponent controlledOption={"controlled"} onControlledOptionChanged={controlledOptionChanged}/>
        );
        Widget.option.mockImplementation(
            (name: string) => {
                if (name === "controlledOption") {
                    WidgetClass.mock.calls[0][1].onControlledOptionChanged();
                }
            }
        );
        component.setProps({
            controlledOption: "changed"
        });

        expect(controlledOptionChanged.mock.calls.length).toBe(0);

        Widget.option("controlledOption", "controlled");

        expect(controlledOptionChanged.mock.calls.length).toBe(1);

    });

    interface IControlledComponentProps {
        defaultControlledOption?: string;
        controlledOption?: string;
        onControlledOptionChanged?: () => void;
        everyOption?: number;
        anotherOption?: string;
    }

    // tslint:disable-next-line:max-classes-per-file
    class ControlledComponent extends TestComponent<IControlledComponentProps> {

        protected _defaults = { // tslint:disable-line:variable-name
            defaultControlledOption : "controlledOption"
        };
    }
});

describe("disposing", () => {

    it("call dispose", () => {
        const component = mount(
            <TestComponent/>
        );

        component.unmount();

        expect(Widget.dispose).toBeCalled();
    });

    it("fires dxremove", () => {
        const handleDxRemove = jest.fn();
        const component = mount(
            <TestComponent/>
        );

        events.on(component.getDOMNode(), "dxremove", handleDxRemove);
        component.unmount();

        expect(handleDxRemove).toHaveBeenCalledTimes(1);
    });
});

describe("nested objects", () => {

    class TestNestedComponent extends React.Component<{ a: number }, any> {
        public static OptionId: string = "abc-testComponent-optionX";

        public render() {
            return null;
        }
    } // tslint:disable-line:max-classes-per-file

    it("includes options from nested component", () => {
        mount(
            <TestComponent>
                <TestNestedComponent a={123} />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            optionX: {
                a: 123
            }
        });
    });

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
