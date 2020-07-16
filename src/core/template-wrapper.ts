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

interface ITemplateWrapperState {
    removalListenerRequired: boolean;
}

type TemplateWrapperRenderer = () => TemplateWrapper;

const removalListenerStyle = { display: "none" };

class TemplateWrapper extends React.PureComponent<ITemplateWrapperProps, ITemplateWrapperState> {
    private readonly _removalListenerRef = React.createRef<HTMLElement>();

    private get _listenerElement(): HTMLElement {
        return this._removalListenerRef.current as HTMLElement;
    }

    constructor(props: ITemplateWrapperProps) {
        super(props);

        this.state = { removalListenerRequired: false };

        this._onDxRemove = this._onDxRemove.bind(this);
    }

    public render() {
        const removalListener = this.state.removalListenerRequired
            ? React.createElement("span", { style: removalListenerStyle, ref: this._removalListenerRef })
            : undefined;

        return ReactDOM.createPortal(
            React.createElement(
                React.Fragment,
                null,
                this.props.content,
                removalListener
            ),
            this.props.container
        );
    }

    public componentDidMount() {
        this.props.onRendered?.()

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
        if (this._listenerElement) {
            this.props.container.appendChild(this._listenerElement);
        }
    }

    private _subscribeOnRemove() {
        const node = ReactDOM.findDOMNode(this);

        if (node && node.nodeType === Node.ELEMENT_NODE) {
            this._subscribeOnElementRemoval(node as Element);
            return;
        }

        if (!this.state.removalListenerRequired) {
            this.setState({ removalListenerRequired: true });
            return;
        }

        if (this._listenerElement) {
            this._subscribeOnElementRemoval(this._listenerElement);
        }
    }

    private _subscribeOnElementRemoval(element: Element): void {
        events.off(element, DX_REMOVE_EVENT, this._onDxRemove);
        events.one(element, DX_REMOVE_EVENT, this._onDxRemove);
    }

    private _onDxRemove(): void {
        this.props.onRemoved();
    }
}

export {
    ITemplateWrapperProps,
    TemplateWrapper,
    TemplateWrapperRenderer
};
