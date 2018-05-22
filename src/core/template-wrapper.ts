import * as events from "devextreme/events";
import * as React from "react";
import * as ReactDOM from "react-dom";

import Component, { IState } from "./component";
import { generateID } from "./helpers";

const DX_REMOVE_EVENT = "dxremove";

interface ITemplateData {
    container: any;
    model?: any;
    index?: any;
}

interface ITemplate {
    render: (data: ITemplateData) => any;
}

interface IWrapperProps {
    content: any;
    container: Element;
    onRemoved: () => void;
    key: string;
}

class TemplateWrapper {
    private readonly _component: Component<any>;

    constructor(component: Component<any>) {
        this._component = component;

        this.wrapTemplate = this.wrapTemplate.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    public wrapTemplate(component: any, render: any): ITemplate {
        const tmplFn = !!component
            ? React.createElement.bind(this, component)
            : render.bind(this);

        return {
            render: (data: ITemplateData) => {
                const templateId = "__template_" + generateID();
                const wrapper = () =>
                    React.createElement(WrappedTemplate, {
                        content: tmplFn(data.model),
                        container: unwrapElement(data.container),
                        onRemoved: () => this._updateState((t) => delete t[templateId]),
                        key: templateId
                    });

                this._updateState((t) => t[templateId] = wrapper);
            }
        };
    }

    private _updateState(callback: (templates: Record<string, any>) => void) {
        this._component.setState((state: IState) => {
            const templates = { ...state.templates };
            callback(templates);
            return {
                templates
            };
        });
    }
}

function unwrapElement(element: any) {
    return element.get ? element.get(0) : element;
}

class WrappedTemplate extends React.PureComponent<IWrapperProps, any> {

    public render() {
        return ReactDOM.createPortal(this.props.content, this.props.container);
    }

    public componentDidMount() {
        const templateElement = ReactDOM.findDOMNode(this);
        const templateParent = templateElement.parentNode;

        const isGridRow = templateParent && templateParent.nodeName !== "DIV";
        const element = isGridRow ? templateElement : templateParent;

        events.one(element, DX_REMOVE_EVENT, this.props.onRemoved);
    }
} // tslint:disable-line:max-classes-per-file

export {
    ITemplate,
    ITemplateData,
    TemplateWrapper
};
