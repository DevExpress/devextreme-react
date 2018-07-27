import * as events from "devextreme/events";
import * as React from "react";
import * as ReactDOM from "react-dom";

const DX_REMOVE_EVENT = "dxremove";

interface ITemplateWrapperProps {
    content: any;
    container: Element;
    onRemoved: () => void;
    onRendered?: () => void;
    key: string;
}

class TemplateWrapper extends React.PureComponent<ITemplateWrapperProps, object> {

    public render() {
        return ReactDOM.createPortal(this.props.content, this.props.container);
    }

    public componentDidMount() {
        if (this.props.onRendered) {
            setTimeout(() => {
                if (this.props.onRendered) {
                    this.props.onRendered();
                }
            });
        }

        const templateElement = ReactDOM.findDOMNode(this);
        const templateParent = templateElement && templateElement.parentNode;

        const isGridRow = templateParent && templateParent.nodeName !== "DIV";
        const element: Element = (isGridRow ? templateElement : templateParent) as Element;

        events.one(element, DX_REMOVE_EVENT, this.props.onRemoved);
    }
}

export {
    ITemplateWrapperProps,
    TemplateWrapper
};
