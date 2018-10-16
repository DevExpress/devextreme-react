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

function renderTemplate(name: string, model?: any, container?: any, onRendered?: () => void): Element {
    model = model || {};
    container = container || document.createElement("div");
    const render = WidgetClass.mock.calls[0][1].integrationOptions.templates[name].render;
    return render({
        container, model, onRendered
    });
}

function renderItemTemplate(model?: any, container?: any, onRendered?: () => void): Element {
    return renderTemplate("item", model, container, onRendered);
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

    it("renders template wrapper for simple item", () => {
        const itemRender: any = jest.fn((text: string) => <div>Template {text}</div>);
        const component = mount(
            <ComponentWithTemplates itemRender={itemRender} />
        );
        const container = document.createElement("div");
        renderItemTemplate("with data", container);
        component.update();
        expect(container.innerHTML).toBe('<div>Template with data</div><span style=\"display: none;\"></span>');
    });

    it("renders template for table", () => {
        const itemRender: any = (text: string) => <tbody><tr><td>Template {text}</td></tr></tbody>;
        const component = mount(
            <ComponentWithTemplates itemRender={itemRender} />
        );
        const container = document.createElement("table");
        renderItemTemplate("with data", container);
        component.update();
        expect(container.innerHTML)
            .toBe("<tbody><tr><td>Template with data</td></tr></tbody><tbody style=\"display: none;\"></tbody>");
    });

    it("calls onRendered callback", () => {
        const itemRender: any = (text: string) => <div className={"template"}>Template {text}</div>;
        const onRendered: () => void = jest.fn();
        const component = mount(
            <ComponentWithTemplates itemRender={itemRender} />
        );
        renderItemTemplate("with data", undefined, onRendered);
        component.update();
        jest.runAllTimers();
        expect(onRendered).toBeCalled();
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

    it("renders key prop", () => {
        const ItemTemplate = (props: any) => <div className={"template"}>key: {props.key}, dxkey: {props.dxkey}</div>;
        const component = mount(
            <ComponentWithTemplates itemComponent={ItemTemplate} />
        );

        renderItemTemplate({ key: "key_1" });
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">key: , dxkey: key_1</div>');
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

    it("renders new templates after component change", () => {
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
    class NestedComponent extends ConfigurationComponent<{
        item?: any;
        itemRender?: any;
        itemComponent?: any;
    }> {
        public static OptionName = "option";
        public static TemplateProps = [{
            tmplOption: "item",
            render: "itemRender",
            component: "itemComponent"
        }];
    }

    // tslint:disable-next-line:max-classes-per-file
    class CollectionNestedComponent extends ConfigurationComponent<{
        template?: any;
        render?: any;
        component?: any;
    }> {
        public static IsCollectionItem = true;
        public static OptionName = "collection";
        public static TemplateProps = [{
            tmplOption: "template",
            render: "render",
            component: "component"
        }];
    }

    it("pass integrationOptions options to widget", () => {
        const ItemTemplate = () => <div>Template</div>;
        mount(
            <TestComponent>
                <NestedComponent itemComponent={ItemTemplate} />
            </TestComponent>
        );

        const options = WidgetClass.mock.calls[0][1];

        expect(options.option.item).toBe("optionitem");

        const integrationOptions = options.integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();
        expect(integrationOptions.templates.optionitem).toBeDefined();
        expect(typeof integrationOptions.templates.optionitem.render).toBe("function");
    });

    it("pass integrationOptions options to widget with several templates", () => {
        const UserTemplate = () => <div>Template</div>;
        mount(
            <TestComponent>
                <NestedComponent itemComponent={UserTemplate} />
                <CollectionNestedComponent render={UserTemplate} />
            </TestComponent>
        );

        const options = WidgetClass.mock.calls[0][1];

        expect(options.option.item).toBe("optionitem");
        expect(options.collection[0].template).toBe("collection[0]template");

        const integrationOptions = options.integrationOptions;

        expect(Object.keys(integrationOptions.templates)).toEqual(["optionitem", "collection[0]template"]);
    });

    it("pass integrationOptions options for collection nested components", () => {
        const UserTemplate = () => <div>Template</div>;
        mount(
            <TestComponent>
                <CollectionNestedComponent render={UserTemplate} />
                <CollectionNestedComponent render={UserTemplate} />
            </TestComponent>
        );

        const options = WidgetClass.mock.calls[0][1];

        expect(options.collection[0].template).toBe("collection[0]template");
        expect(options.collection[1].template).toBe("collection[1]template");

        const integrationOptions = options.integrationOptions;

        expect(Object.keys(integrationOptions.templates)).toEqual(["collection[0]template", "collection[1]template"]);
    });

    it("renders templates", () => {
        const FirstTemplate = () => <div className={"template"}>First Template</div>;
        const component = mount(
            <TestComponent>
                <NestedComponent itemComponent={FirstTemplate} />
            </TestComponent >
        );
        renderTemplate("optionitem");
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">First Template</div>');

        const SecondTemplate = () => <div className={"template"}>Second Template</div>;
        component.setProps({
            children: <NestedComponent itemComponent={SecondTemplate} />
        });
        component.update();
        expect(component.find(".template").html()).toBe('<div class="template">Second Template</div>');
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
    const templateContent = component.find(".template").getDOMNode();

    const parentElement = templateContent.parentElement;
    if (!parentElement) { throw new Error(); }

    const removeListener = parentElement.getElementsByTagName("SPAN")[0];

    parentElement.removeChild(removeListener);
    parentElement.removeChild(templateContent);
    events.triggerHandler(removeListener, "dxremove");
    component.update();
    expect(Object.getOwnPropertyNames(component.state("templates")).length).toBe(0);
});
