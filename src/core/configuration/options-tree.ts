import { ConfigNode } from "./config-node";
import { INode, NodeType } from "./node";

function buildOptionsTree(node: INode, parentOption: ConfigNode) {
    if (node.type === NodeType.Unknown) {
        return;
    }

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
