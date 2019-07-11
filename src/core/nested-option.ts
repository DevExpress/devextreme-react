import * as React from "react";
import { NodeType } from "./configuration/node";
import { createNode } from "./configuration/react-node";

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

    constructor(props: P & INestedOptionProps) {
        super(props);
    }

    public render() {
        if (!this.props.children) {
            return null;
        }
        const children = React.Children.map(
            this.props.children,
            (child) => {
                return {
                    type: createNode(child).type,
                    child
                };
            }
        );
        return React.createElement(
            React.Fragment,
            {},
            children.filter((child) => child.type === NodeType.Option).map((child) => child.child)
        );
    }
}

export default NestedOption;
export {
    INestedOptionMeta
};
