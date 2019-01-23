import * as React from "react";

interface INestedOptionMeta {
    optionName: string;
    registerNestedOption(component: React.ReactElement<any>): any;
    updateFunc(newProps: any, prevProps: any): void;
    makeDirty(): void;
}

class NestedOption<P> extends React.PureComponent<P & INestedOptionMeta, any> {

    private readonly _isAttached: boolean;
    private readonly _meta: INestedOptionMeta;

    constructor(props: P & INestedOptionMeta) {
        super(props);

        this._meta = {
            optionName: props.optionName,
            registerNestedOption: props.registerNestedOption,
            updateFunc: props.updateFunc,
            makeDirty: props.makeDirty
        };

        if (this._meta.makeDirty) { this._meta.makeDirty(); }

        this._isAttached =
            !!this._meta.registerNestedOption &&
            !!this._meta.updateFunc &&
            !!this._meta.optionName;
    }

    public render() {
        if (!this.props.children || !this._isAttached) { return null; }

        const children: any[] = [];
        React.Children.forEach(this.props.children, (c: React.ReactElement<any>) => {
            const processedChild = this._meta.registerNestedOption(c);
            if (processedChild) {
                children.push(processedChild);
            }
        });

        return children.length === 0
            ? null
            : React.createElement(React.Fragment, {}, ...children);
    }

    public componentDidUpdate(prevProps: P) {
        if (this._isAttached) {
            this._meta.updateFunc(clearProps(this.props), prevProps);
        }
    }

    public componentWillUnmount() {
        if (this._meta.makeDirty) { this._meta.makeDirty(); }
    }
}

function clearProps(props: any) {
    const {
        optionName,
        registerNestedOption,
        updateFunc,
        makeDirty,
        ...result
    } = props;

    return result;
}

function createOptionComponent<P>(rawElement: React.ReactElement<P>, metaData: INestedOptionMeta) {
    return React.cloneElement(rawElement, metaData as any);
}

export default NestedOption;
export {
    createOptionComponent,
    INestedOptionMeta
};
