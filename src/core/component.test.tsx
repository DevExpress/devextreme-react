import * as events from "devextreme/events";
import { configure as configureEnzyme, mount, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import Component from "../core/component";
import ConfigurationComponent from "../core/nested-option";
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

function fireOptionChange(fullName: string, value: any) {
    eventHandlers.optionChanged({
        name: fullName.split(".")[0],
        fullName,
        value
    });
}

const WidgetClass = jest.fn(() => Widget);

class TestComponent<P = any> extends Component<P> {

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

    it("has templates in state with unique ids", () => {
        const ItemTemplate = (props: any) => <div className={"template"}>Template {props.text}</div>;
        const component = mount(
            <ComponentWithTemplates itemComponent={ItemTemplate} />
        );
        renderItemTemplate({text: 1});
        renderItemTemplate({text: 2});

        const templatesKeys = Object.getOwnPropertyNames(component.state("templates"));
        expect(templatesKeys.length).toBe(2);
        expect(templatesKeys[0]).not.toBe(templatesKeys[1]);
    });

    it("removes deleted nodes from state", () => {
        const ItemTemplate = (props: any) => <div className={"template"}>Template {props.text}</div>;
        const component = mount(
            <ComponentWithTemplates itemComponent={ItemTemplate} />
        );
        renderItemTemplate({});
        expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(1);
        component.update();
        events.triggerHandler(component.find(".template").getDOMNode().parentNode, "dxremove");
        component.update();
        expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(0);
    });

    // tslint:disable-next-line:max-classes-per-file
    class ComponentWithTemplates extends TestComponent {

        protected _templateProps = [{
            tmplOption: "item",
            render: "itemRender",
            component: "itemComponent"
        }];

        constructor(props: any) {
            super(props);
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

    it("rolls option value back", () => {
        mount(
            <ControlledComponent everyOption={123} />
        );

        fireOptionChange("everyOption", 234);
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "everyOption", 123 ]);
    });

    it("rolls nested option value back", () => {
        mount(
            <ControlledComponent>
                <NestedComponent a={123} />
            </ControlledComponent>
        );

        fireOptionChange("nestedOption.a", 234);
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "nestedOption.a", 123 ]);
    });

    it("rolls nested option value if parent object changes another field", () => {
        mount(
            <ControlledComponent>
                <NestedComponent a={123} />
            </ControlledComponent>
        );

        fireOptionChange("nestedOption", { b: "abc" });
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "nestedOption.a", 123 ]);
    });

    it("rolls nested option value and preserves parent object", () => {
        mount(
            <ControlledComponent>
                <NestedComponent a={123} />
            </ControlledComponent>
        );

        fireOptionChange("nestedOption", { a: 456, b: "abc" });
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "nestedOption.a", 123 ]);
    });

    it("rolls option value back if value has no changes", () => {
        const component = mount(
            <ControlledComponent everyOption={123} anotherOption={"const"}/>
        );

        fireOptionChange("anotherOption", "changed");
        component.setProps({everyOption: 234});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(2);
        expect(Widget.option.mock.calls[0]).toEqual([ "everyOption", 234 ]);
        expect(Widget.option.mock.calls[1]).toEqual([ "anotherOption", "const" ]);
    });

    it("rolls nested option value back if value has no changes", () => {
        const component = shallow(
            <ControlledComponent>
                <NestedComponent a={123} b="const" />
            </ControlledComponent>
        );
        const nested = component.find(NestedComponent).dive();

        fireOptionChange("nestedOption.b", "changed");
        nested.setProps({a: 234});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(2);
        expect(Widget.option.mock.calls[0]).toEqual([ "nestedOption.a", 234 ]);
        expect(Widget.option.mock.calls[1]).toEqual([ "nestedOption.b", "const" ]);
    });

    it("apply option change if value really change", () => {
        const component = mount(
            <ControlledComponent everyOption={123}/>
        );

        fireOptionChange("everyOption", 234);
        component.setProps({everyOption: 234});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "everyOption", 234 ]);
    });

    it("apply nested option change if value really change", () => {
        const component = shallow(
            <ControlledComponent>
                <NestedComponent a={123} b="const" />
            </ControlledComponent>
        );
        const nested = component.find(NestedComponent).dive();

        fireOptionChange("nestedOption.a", 234);
        nested.setProps({a: 234});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual([ "nestedOption.a", 234 ]);
    });

    it("does not control not specified nested option", () => {
        shallow(
            <ControlledComponent>
                <NestedComponent a={123} />
            </ControlledComponent>
        );

        fireOptionChange("nestedOption.b", "abc");
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(0);
    });

    describe("default values", () => {

        it("pass default values to widget", () => {
            mount(
                <ControlledComponent defaultControlledOption={"default"}/>
            );

            expect(WidgetClass.mock.calls[0][1].controlledOption).toBe("default");
            expect(WidgetClass.mock.calls[0][1]).not.toHaveProperty("defaultControlledOption");
        });

        it("pass nested default values to widget", () => {
            mount(
                <ControlledComponent>
                    <NestedComponent defaultC="default" />
                </ControlledComponent>
            );

            expect(WidgetClass.mock.calls[0][1].nestedOption.c).toBe("default");
            expect(WidgetClass.mock.calls[0][1].nestedOption).not.toHaveProperty("defaultC");
        });

        it("ignores option with default prefix", () => {
            mount(
                <ControlledComponent defaultControlledOption={"default"}/>
            );

            fireOptionChange("controlledOption", "changed");
            jest.runAllTimers();
            expect(Widget.option.mock.calls.length).toBe(0);
        });

        it("ignores nested option with default prefix", () => {
            mount(
                <ControlledComponent>
                    <NestedComponent defaultC="default" />
                </ControlledComponent>
            );

            fireOptionChange("nestedOption.c", "changed");
            jest.runAllTimers();
            expect(Widget.option.mock.calls.length).toBe(0);
        });

        it("ignores 3rd-party changes in default props", () => {
            const component = mount(
                <ControlledComponent defaultControlledOption={"default"}/>
            );
            component.setProps({
                defaultControlledOption: "changed"
            });
            jest.runAllTimers();
            expect(Widget.option.mock.calls.length).toBe(0);
        });

        it("ignores 3rd-party changes in nested default props", () => {
            const component = shallow(
                <ControlledComponent>
                    <NestedComponent defaultC="default" />
                </ControlledComponent>

            );
            const nested = component.find(NestedComponent).dive();

            nested.setProps({
                defaultC: "changed"
            });
            jest.runAllTimers();
            expect(Widget.option.mock.calls.length).toBe(0);
        });

        it("ignores 3rd-party changes in nested default props if parent object changes", () => {
            mount(
                <ControlledComponent>
                    <NestedComponent defaultC="default" />
                </ControlledComponent>
            );

            fireOptionChange("nestedOption", { a: 456, b: "abc" });
            jest.runAllTimers();
            expect(Widget.option.mock.calls.length).toBe(0);
        });

        it("does not pass default values to widget if controlledOption set", () => {
            mount(
                <ControlledComponent defaultControlledOption={"default"} controlledOption={"controlled"}/>
            );

            expect(Widget.option.mock.calls.length).toBe(0);
            expect(WidgetClass.mock.calls[0][1].controlledOption).toBe("controlled");
            expect(WidgetClass.mock.calls[0][1]).not.toHaveProperty("defaultControlledOption");
        });

        it("does not pass nested default values to widget if controlledOption set", () => {
            mount(
                <ControlledComponent>
                    <NestedComponent defaultC="default" c="controlled" />
                </ControlledComponent>
            );

            expect(Widget.option.mock.calls.length).toBe(0);
            expect(WidgetClass.mock.calls[0][1].nestedOption.c).toBe("controlled");
            expect(WidgetClass.mock.calls[0][1].nestedOption).not.toHaveProperty("defaultC");
        });

    });

    interface IControlledComponentProps {
        defaultControlledOption?: string;
        controlledOption?: string;
        onControlledOptionChanged?: () => void;
        everyOption?: number;
        anotherOption?: string;
    }

    class ControlledComponent extends TestComponent<IControlledComponentProps> {

        protected _defaults = {
            defaultControlledOption : "controlledOption"
        };
    } // tslint:disable-line:max-classes-per-file

    class NestedComponent extends ConfigurationComponent<{
        a?: number;
        b?: string;
        c?: string;
        defaultC?: string;
    }> {
        public static OwnerType = ControlledComponent;
        public static OptionName = "nestedOption";

        public static DefaultsProps = {
            defaultC : "c"
        };
    } // tslint:disable-line:max-classes-per-file
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

describe("nested options", () => {

    it("pulls options from a single nested component", () => {
        mount(
            <TestComponent>
                <NestedComponent1 a={123} />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option1: {
                a: 123
            }
        });
    });

    it("doesn't pull options from wrong component", () => {
        mount(
            <TestComponent>
                <NestedComponent1 a={123} />
                <WrongNestedComponent x={456} />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option1: {
                a: 123
            }
        });
    });

    it("pulls overriden options from the same nested component", () => {
        mount(
            <TestComponent>
                <NestedComponent1 a={123} />
                <NestedComponent1 a={456} />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option1: {
                a: 456
            }
        });
    });

    it("pulls array options from a nested component", () => {
        mount(
            <TestComponent>
                <CollectionNestedComponent c={123} d="abc" />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            itemOptions: [
                { c: 123, d: "abc" }
            ]
        });
    });

    it("pulls array options from several nested components", () => {
        mount(
            <TestComponent>
                <CollectionNestedComponent c={123} d="abc" />
                <CollectionNestedComponent c={456} />
                <CollectionNestedComponent d="def" />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            itemOptions: [
                { c: 123, d: "abc" },
                { c: 456 },
                { d: "def" }
            ]
        });
    });

    it("pulls options from several nested components", () => {
        mount(
            <TestComponent>
                <NestedComponent1 a={123} />
                <WrongNestedComponent x={456} />
                <NestedComponent2 b="abc" />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option1: {
                a: 123
            },
            option2: {
                b: "abc"
            }
        });
    });

    it("pulls updated options", () => {

        const component = shallow(
            <TestComponent>
                <NestedComponent1 a={123} />
            </TestComponent>
        );
        const nested = component.find(NestedComponent1).dive();

        nested.setProps({ a: 456 });
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual(["option1.a", 456]);
    });

    class NestedComponent1 extends ConfigurationComponent<{ a: number }> {
        public static OwnerType = TestComponent;
        public static OptionName = "option1";
    } // tslint:disable-line:max-classes-per-file

    class NestedComponent2 extends ConfigurationComponent<{ b: string }> {
        public static OwnerType = TestComponent;
        public static OptionName = "option2";
    } // tslint:disable-line:max-classes-per-file

    class CollectionNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
        public static IsCollectionItem = true;
        public static OwnerType = TestComponent;
        public static OptionName = "itemOptions";
    } // tslint:disable-line:max-classes-per-file

    class WrongNestedComponent extends ConfigurationComponent<{ x: number }> {
        public static OwnerType = WrongNestedComponent;
        public static OptionName = "optionW";
    } // tslint:disable-line:max-classes-per-file
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
