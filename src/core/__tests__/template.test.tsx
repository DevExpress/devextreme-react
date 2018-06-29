import * as events from "devextreme/events";

import ConfigurationComponent from "../../core/nested-option";
import { Template } from "../../core/template";
import { mount, React, shallow } from "./setup";
import { TestComponent, Widget, WidgetClass } from "./test-component";

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

function renderTemplate(name: string, model?: any, container?: any): Element {
    model = model || {};
    container = container || document.createElement("div");
    const render = WidgetClass.mock.calls[0][1].integrationOptions.templates[name].render;
    return render({
        container, model
    });
}

function renderItemTemplate(model?: any, container?: any): Element {
    return renderTemplate("item", model, container);
}

describe("function template", () => {

    it("pass integrationOptions to widget", () => {
        const itemRender: any = () => <div>Template</div>;
        shallow(
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
        renderItemTemplate({}, { get: () => document.createElement("div") });
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

    it("renders new template after component change", () => {
        const ItemTemplate = () => <div className={"template"}>First Template</div>;
        const component = mount(
            <ComponentWithTemplates itemRender={ItemTemplate} />
        );

        const SecondItemTemplate = () => <div className={"template"}>Second Template</div>;
        component.setProps({
            itemRender: SecondItemTemplate
        });

        renderItemTemplate();
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">Second Template</div>');
    });
});

describe("component template", () => {

    it("pass integrationOptions to widget", () => {
        const ItemTemplate = () => <div>Template</div>;
        shallow(
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

    it("renders new template after component change", () => {
        const ItemTemplate = () => <div className={"template"}>First Template</div>;
        const component = mount(
            <ComponentWithTemplates itemComponent={ItemTemplate} />
        );

        const SecondItemTemplate = () => <div className={"template"}>Second Template</div>;
        component.setProps({
            itemComponent: SecondItemTemplate
        });

        renderItemTemplate();
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">Second Template</div>');
    });
});

describe("nested template", () => {
    it("pass integrationOptions to widget", () => {
        const ItemTemplate = () => <div>Template</div>;
        mount(
            <ComponentWithTemplates>
                <Template name={"item1"} render={ItemTemplate} />
                <Template name={"item2"} component={ItemTemplate} />
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

    it("renders nested templates", () => {
        const FirstTemplate = () => <div className={"template"}>Template</div>;
        const component = mount(
            <ComponentWithTemplates>
                <Template name={"item1"} render={FirstTemplate} />
            </ComponentWithTemplates >
        );
        renderTemplate("item1");
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">Template</div>');
    });

    it("renders nested templates", () => {
        const FirstTemplate = () => <div className={"template"}>First Template</div>;
        const component = mount(
            <ComponentWithTemplates>
                <Template name={"item1"} render={FirstTemplate} />
            </ComponentWithTemplates >
        );
        renderTemplate("item1");
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">First Template</div>');

        const SecondTemplate = () => <div className={"template"}>Second Template</div>;
        component.setProps({
            children: <Template name={"item1"} render={SecondTemplate} />
        });
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">Second Template</div>');
    });

});

describe("component/render in nested options", () => {

    // tslint:disable-next-line:max-classes-per-file
    class NestedComponentWithTemplates extends ConfigurationComponent<{
        item?: any;
        itemRender?: any;
        itemComponent?: any;
    }> {
        public static OwnerType = TestComponent;
        public static OptionName = "option";
        public static TemplateProps = [{
            tmplOption: "item",
            render: "itemRender",
            component: "itemComponent"
        }];
    }

    it("pass integrationOptions options to widget", () => {
        const ItemTemplate = () => <div>Template</div>;
        mount(
            <TestComponent>
                <NestedComponentWithTemplates itemComponent={ItemTemplate} />
            </TestComponent>
        );

        const options = WidgetClass.mock.calls[0][1];

        expect(options.option.item).toBe("item");

        const integrationOptions = options.integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();
        expect(integrationOptions.templates.item).toBeDefined();
        expect(typeof integrationOptions.templates.item.render).toBe("function");
    });

});

it("pass component option changes to widget", () => {
    const ItemTemplate = () => <div>First Template</div>;
    const component = shallow(
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
    const component = shallow(
        <ComponentWithTemplates itemComponent={ItemTemplate} />
    );
    renderItemTemplate({ text: 1 });
    renderItemTemplate({ text: 2 });

    const templatesKeys = Object.getOwnPropertyNames(component.state("templates"));
    expect(templatesKeys.length).toBe(2);
    expect(templatesKeys[0]).not.toBe(templatesKeys[1]);
});

it("mounts empty template without errors", () => {
    const component = mount(
        <ComponentWithTemplates itemRender={() => null}/>
    );
    renderItemTemplate({ text: 1 });
    expect(component.update.bind(component)).not.toThrow();
});

it("removes deleted nodes from state", () => {
    const ItemTemplate = (props: any) => <div className={"template"}>Template {props.text}</div>;
    const component = mount(
        <ComponentWithTemplates itemComponent={ItemTemplate} />
    );
    renderItemTemplate();
    expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(1);
    component.update();
    events.triggerHandler(component.find(".template").getDOMNode().parentNode, "dxremove");
    component.update();
    expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(0);
});
