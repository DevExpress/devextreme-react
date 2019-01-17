import * as React from "react";

type RegisterNestedOptionFunc = (component: React.ReactElement<any>) => any;
type UpdateFunc = (newProps, prevProps) => void;
type MakeDirtyFunc = () => void;

interface INestedOptionMeta {
    optionName: string;
    registerNestedOption: RegisterNestedOptionFunc;
    updateFunc: UpdateFunc;
    makeDirty?: MakeDirtyFunc;
}

class NestedOption<P> extends React.PureComponent<P, any> {
    private readonly _isAttached: boolean;

    private readonly _optionFullName: string;
    private readonly _registerNestedOption: RegisterNestedOptionFunc;
    private readonly _updateFunc: UpdateFunc;

    constructor(props: P) {
        super(props);
        const meta = this.props as any as INestedOptionMeta;
        this._optionFullName = meta.optionName;
        this._registerNestedOption = meta.registerNestedOption;
        this._updateFunc = meta.updateFunc;

        if (meta.makeDirty) { meta.makeDirty(); }

        this._isAttached = !!this._registerNestedOption && !!this._updateFunc && !!this._optionFullName;

    }

    public render() {
        if (!this.props.children || !this._isAttached) { return null; }

        const children: any[] = [];
        React.Children.forEach(this.props.children, (c: React.ReactElement<any>) => {
            const processedChild = this._registerNestedOption(c);
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
            this._updateFunc(clearProps(this.props), prevProps);
        }
    }

    public componentWillUnmount() {
        const meta = this.props as any as INestedOptionMeta;
        meta.makeDirty();
    }
}

function clearProps(props: any) {
    const result: INestedOptionMeta = { ...props };
    delete result.registerNestedOption;
    delete result.updateFunc;
    delete result.makeDirty;
    return result;
}

function createOptionComponent<P>(rawElement: React.ReactElement<P>, metaData: INestedOptionMeta) {
    return React.cloneElement(rawElement, metaData as any);
}

export default NestedOption;
export {
    createOptionComponent,
    INestedOptionMeta,
    RegisterNestedOptionFunc,
    UpdateFunc
};
