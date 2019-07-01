import { INode, NodeType } from "./node";
import { OptionConfiguration } from "./option-configuration";

function buildOptionsTree(node: INode, parentOption: OptionConfiguration) {
    if (node.type === NodeType.Template) {
        // register tempalate
        return;
    }

    const currentOption = node.type === NodeType.Option
        ? parentOption.createChild(node.descriptor, node.values)
        : parentOption;

    node.getChildren().map(
        (childNode) => {
            buildOptionsTree(childNode, currentOption);
        }
    );
}

export {
    buildOptionsTree
};
