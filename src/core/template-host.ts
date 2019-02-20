import { ITemplateMeta, ITemplateProps } from "./template";

import * as React from "react";

import { generateID } from "./helpers";
import { ITemplateUpdater } from "./template-updater";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";

type RenderedTemplate = React.ReactElement<ITemplateWrapperProps>;
type PropsGetter = (propName: string) => any;

interface IDxTemplateData {
    container: any;
    model?: any;
    index?: any;
    onRendered?: () => void;
}

interface IDxTemplate {
    render: (data: IDxTemplateData) => any;
}

interface IIntegrationDescr {
    props: Record<string, any>;
    templateProps: ITemplateMeta[];
    ownerName: string;
    propsGetter: PropsGetter;
    useChildren: (name: string) => boolean;
}

const contentCreators = {
    component: (name: string, propsGetter: PropsGetter) => React.createElement.bind(null, propsGetter(name)),
    render: (name: string, propsGetter: PropsGetter) => propsGetter(name),
    children: (_: string, propsGetter: PropsGetter) => () => propsGetter("children")
};

class TemplateHost {
    private readonly _templateUpdater: ITemplateUpdater;

    private _templates: Record<string, any> = {};
    private _stubs: Record<string, any> = {};
    private _nestedTemplateProps: Record<string, {
        render: any;
        component: any;
        children: any;
    }> = {};

    constructor(templateUpdater: ITemplateUpdater) {
        this._templateUpdater = templateUpdater;
    }

    public add(meta: IIntegrationDescr) {
        const templates: Record<string, IDxTemplate> = {};
        const stubs: Record<string, any> = {};

        const props = meta.props;
        const templateProps = meta.templateProps || [];
        const ownerName = meta.ownerName;

        for (const tmpl of templateProps) {
            let contentCreator;
            let propName;

            if (meta.useChildren(tmpl.tmplOption)) {
                contentCreator = contentCreators.children;
            }

            if (props[tmpl.render]) {
                propName = tmpl.render;
                contentCreator = contentCreators.render;
            }

            if (props[tmpl.component]) {
                propName = tmpl.component;
                contentCreator = contentCreators.component;
            }

            if (!contentCreator) {
                continue;
            }

            contentCreator = contentCreator.bind(this, propName, meta.propsGetter);

            const name = ownerName ? `${ownerName}.${tmpl.tmplOption}` : tmpl.tmplOption;
            stubs[name] = name;
            templates[name] = wrapTemplate(contentCreator, this._templateUpdater, meta.propsGetter(tmpl.keyFn));
        }

        this._templates = {
            ...this._templates,
            ...templates
        };

        this._stubs = {
            ...this._stubs,
            ...stubs
        };
    }

    public addNested(props: ITemplateProps): void {
        const name: string = props.name;
        this._nestedTemplateProps[name] = {
            component: props.component,
            render: props.render,
            children: props.children
        };

        const type = !!props.component ? "component" : !!props.render ? "render" : "children";
        const propsGetter: PropsGetter = (prop) => this._nestedTemplateProps[name][prop];

        const contentCreator = contentCreators[type].bind(this, type, propsGetter);
        this._templates[name] = wrapTemplate(contentCreator, this._templateUpdater, props.keyFn);
    }

    public get options(): Record<string, any> | undefined {
        if (!Object.keys(this._templates).length) {
            return;
        }

        return {
            integrationOptions: {
                templates: this._templates
            },
            ...this._stubs
        };
    }
}

function wrapTemplate(
    createContentProvider: () => (model: any) => any,
    templateUpdater: ITemplateUpdater,
    keyFn?: (data: any) => string
): IDxTemplate {

    const renderedContainers: HTMLElement[] = [];
    return {
        render: (data: IDxTemplateData) => {
            const templateId = keyFn ? keyFn(data.model) : "__template_" + generateID();
            const container = unwrapElement(data.container);

            if (renderedContainers.indexOf(container) > -1) {
                return container;
            }
            renderedContainers.push(container);

            templateUpdater.setTemplate(templateId, () => {
                const model = data.model;
                if (model && model.hasOwnProperty("key")) {
                    model.dxkey = model.key;
                }
                const contentProvider = createContentProvider();
                return React.createElement<ITemplateWrapperProps>(
                    TemplateWrapper,
                    {
                        content: contentProvider(model),
                        container,
                        onRemoved: () => templateUpdater.removeTemplate(templateId),
                        onRendered: data.onRendered,
                        key: templateId
                    }
                );
            });

            return container;
        }
    };
}

function unwrapElement(element: any): HTMLElement {
    return element.get ? element.get(0) : element;
}

export default TemplateHost;
export {
    RenderedTemplate,
    wrapTemplate
};
