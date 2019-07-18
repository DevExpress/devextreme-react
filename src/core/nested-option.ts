import * as React from "react";
import { ElementType, getElementInfo } from "./configuration/react/element";

interface INestedOptionMeta {
    optionName: string;
    registerNestedOption(component: React.ReactElement<any>): any;
    updateFunc(newProps: any, prevProps: any): void;
    makeDirty(): void;
}

class NestedOption<P> extends React.PureComponent<P, any> {

    public render() {
        if (!this.props.children) {
            return null;
        }
        const children = React.Children.map(
            this.props.children,
            (child) => {
                return {
                    type: getElementInfo(child).type,
                    child
                };
            }
        );
        return React.createElement(
            React.Fragment,
            {},
            children.filter((child) => child.type === ElementType.Option).map((child) => child.child)
        );
    }
}

export default NestedOption;
export {
    INestedOptionMeta
};
