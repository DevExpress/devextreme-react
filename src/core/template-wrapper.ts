import * as React from "react";
import * as ReactDOM from "react-dom";

import * as events from "devextreme/events";

const DX_REMOVE_EVENT = "dxremove";

export interface ITemplateWrapperProps {
    content: any;
    container: Element;
    onRemoved: () => void;
    key: string;
}

export class TemplateWrapper extends React.PureComponent<ITemplateWrapperProps, object> {

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
}
