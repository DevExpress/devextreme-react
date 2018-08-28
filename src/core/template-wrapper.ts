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

    public render() {
        return ReactDOM.createPortal(this.props.content, this.props.container);
    }

    public componentDidMount() {
        if (this.props.onRendered) {
            const onRendered: () => void = this.props.onRendered;
            setTimeout(() => onRendered());
        }
        const restoreRemovedContent = () => {
            // Let React remove it itself
            const node = ReactDOM.findDOMNode(this);
            if (node) {
                this.props.container.appendChild(node);
            }
        };
        events.one(this.props.container, DX_REMOVE_EVENT, () => {
            restoreRemovedContent();
            this.props.onRemoved();
        });
    }
}

export {
    ITemplateWrapperProps,
    TemplateWrapper
};
