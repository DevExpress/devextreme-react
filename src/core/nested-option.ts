import * as React from "react";

interface INestedOptionProps {
    meta?: INestedOptionMeta;
}

interface INestedOptionMeta {
    optionName: string;
    registerNestedOption(component: React.ReactElement<any>): any;
    updateFunc(newProps: any, prevProps: any): void;
    makeDirty(): void;
}

class NestedOption<P> extends React.PureComponent<P, any> {

    private readonly _meta?: INestedOptionMeta;

    constructor(props: P & INestedOptionProps) {
        super(props);

        if (!!props.meta &&
            !!props.meta.registerNestedOption &&
            !!props.meta.updateFunc &&
            !!props.meta.optionName
        ) {
            this._meta = { ...props.meta };
        }

        if (this._meta && this._meta.makeDirty) { this._meta.makeDirty(); }

    }

    public render() {
        if (!this.props.children || !this._meta) { return null; }

        const registerNestedOption = this._meta.registerNestedOption;

        const children: any[] = [];
        React.Children.forEach(this.props.children, (c: React.ReactElement<any>) => {
            const processedChild = registerNestedOption(c);
            if (processedChild) {
                children.push(processedChild);
            }
        });

        return children.length === 0
            ? null
            : React.createElement(React.Fragment, {}, ...children);
    }

    public componentDidUpdate(prevProps: P) {
        if (this._meta) { this._meta.updateFunc(getCleanProps(this.props), prevProps); }
    }

    public componentWillUnmount() {
        if (this._meta && this._meta.makeDirty) { this._meta.makeDirty(); }
    }

}

function getCleanProps(props: any) {
    const { meta, ...cleanProps } = props;

    return cleanProps;
}

function createOptionComponent<P>(rawElement: React.ReactElement<P>, meta: INestedOptionMeta) {
    const props: INestedOptionProps = { meta };
    return React.cloneElement(rawElement, props as any);
}

export default NestedOption;
export {
    createOptionComponent,
    INestedOptionMeta
};
