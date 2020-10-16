import * as React from 'react';
import { ElementType, getElementInfo } from './configuration/react/element';

interface INestedOptionMeta {
    optionName: string;
    registerNestedOption(component: React.ReactElement<any>): any;
    updateFunc(newProps: any, prevProps: any): void;
    makeDirty(): void;
}

class NestedOption<P> extends React.PureComponent<P, any> {

    public render() {
        const children = React.Children.map(
            this.props.children,
            (child) => {
                const childElementInfo = getElementInfo(child);

                return childElementInfo.type === ElementType.Option ? child : null;
            }
        );
        return React.createElement(
            React.Fragment,
            {},
            children
        );
    }
}

export default NestedOption;
export {
    INestedOptionMeta
};
