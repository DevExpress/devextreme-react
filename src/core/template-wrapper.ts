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

class TemplateWrapper extends React.PureComponent<ITemplateWrapperProps> {
    private _removeListener: HTMLDivElement;

    public render() {
        return ReactDOM.createPortal(
            React.createElement(React.Fragment,
                {},
                this.props.content,
                React.createElement(this.props.container.nodeName === "TABLE" ? "tbody" : "span", {
                    style: { display: "none" },
                    ref: (element: HTMLDivElement) => this._removeListener = element
                }),
            )
        , this.props.container);
    }

    public componentDidMount() {
        if (this.props.onRendered) {
            const onRendered: () => void = this.props.onRendered;
            setTimeout(() => onRendered());
        }
        const restoreRemovedContent = () => {
            // Let React remove it itself
            const node = ReactDOM.findDOMNode(this);
            if (node && node.parentElement) {
                Array.from(node.parentElement.children).forEach((element) => {
                    this.props.container.appendChild(element);
                });
            }
        };
        events.one(this._removeListener, DX_REMOVE_EVENT, () => {
            restoreRemovedContent();
            this.props.onRemoved();
        });
    }
}

export {
    ITemplateWrapperProps,
    TemplateWrapper
};
