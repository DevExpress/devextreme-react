import { ComponentBase } from "../component-base";
import { INode, NodeType } from "./node";
import { Option } from "./option";
import { createChildNodes } from "./react-node";

function getOptions(widget: ComponentBase<any>) {
    const rootOption = new Option(widget.getDescriptor(), "");

    createChildNodes(widget.props.children).map(
        (childNode) => {
            buildOptionsTree(childNode, rootOption);
        }
    );

    // console.log(rootOption.getValues(false));
}

function buildOptionsTree(node: INode, parentOption: Option) {
    if (node.type === NodeType.Template) {
        // register tempalates
        return;
    }

    let currentOption = parentOption;
    if (node.type === NodeType.Option) {
        const option = parentOption.createChild(node.descriptor);
        option.setValues(node.values);
        currentOption = option;
    }

    node.getChildren().map(
        (childNode) => {
            buildOptionsTree(childNode, currentOption);
        }
    );
}

export {
    getOptions
};
