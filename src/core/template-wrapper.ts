import * as events from "devextreme/events";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { generateID } from "./helpers";

const DX_REMOVE_EVENT = "dxremove";

interface ITemplateData {
    container: any;
    model?: any;
    index?: any;
}

interface ITemplateWrapper {
    render: (data: ITemplateData) => any;
}

interface IWrapperProps {
    content: any;
    container: Element;
    onRemoved: () => void;
    key: string;
}

class TemplateWrapper extends React.PureComponent<IWrapperProps, any> {

    public render() {
        return ReactDOM.createPortal(this.props.content, this.props.container);
    }

    public componentDidMount() {
        const element = ReactDOM.findDOMNode(this);
        events.one(element, DX_REMOVE_EVENT, this.props.onRemoved);
    }
}

function wrapTemplate(
    tmplFn: any,
    updateTemplates: (callback: (templates: Record<string, any>) => void) => void
): ITemplateWrapper {
    return {
        render: (data: ITemplateData) => {
            const templateId = "__template_" + generateID();

            const wrapper = () =>
                React.createElement(TemplateWrapper, {
                    content: tmplFn(data.model),
                    container: unwrapElement(data.container),
                    onRemoved: () => updateTemplates((t) => delete t[templateId]),
                    key: templateId
                });

            updateTemplates((t) => t[templateId] = wrapper);
        }
    };
}

function unwrapElement(element: any) {
    return element.get ? element.get(0) : element;
}

export {
    ITemplateWrapper,
    ITemplateData,
    wrapTemplate
};
