import * as events from "devextreme/events";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { DX_REMOVE_EVENT } from "./component-base";

interface ITemplateWrapperProps {
    content: any;
    container: Element;
    onRemoved: () => void;
    onRendered?: () => void;
    key: string;
}

type TemplateWrapperRenderer = () => TemplateWrapper;

class TemplateWrapper extends React.PureComponent<ITemplateWrapperProps> {
    private readonly _removalListenerRef = React.createRef<HTMLElement>();

    constructor(props: ITemplateWrapperProps) {
        super(props);
    }

    public render() {
        return ReactDOM.createPortal(
            React.createElement(
                React.Fragment,
                null,
                this.props.content,
                React.createElement(
                    this.props.container.nodeName === "TABLE" ? "tbody" : "span",
                    {
                        style: { display: "none" },
                        ref: this._removalListenerRef
                    }
                )
            ),
            this.props.container
        );
    }

    public componentDidMount() {
        if (this.props.onRendered) {
            const onRendered: () => void = this.props.onRendered;
            setTimeout(() => onRendered());
        }

        this._subscribeOnRemove();
    }

    public componentDidUpdate() {
        this._subscribeOnRemove();
    }

    public componentWillUnmount() {
        // Let React remove it itself
        const node = ReactDOM.findDOMNode(this);

        if (node) {
            this.props.container.appendChild(node);
        }
        this.props.container.appendChild(
            this._removalListenerRef.current as HTMLElement
        );
    }

    private _subscribeOnRemove() {
        const removalListener = this._removalListenerRef.current;
        if (!removalListener) {
            // T713245 (ref to removalListener is undefined under certain conditions)
            return;
        }
        events.one(removalListener, DX_REMOVE_EVENT, () => {
            this.props.onRemoved();
        });
    }
}

export {
    ITemplateWrapperProps,
    TemplateWrapper,
    TemplateWrapperRenderer
};
