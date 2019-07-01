import { ComponentBase } from "../component-base";
import TemplatesManager from "../templates-manager";
import { OptionConfiguration } from "./option-configuration";
import { OptionsBuilder } from "./options-builder";
import { buildOptionsTree } from "./options-tree";
import { createChildNodes } from "./react-node";

class OptionsManagerNew {
    private _widgetComponent: ComponentBase<any>;
    private _templatesManager: TemplatesManager;

    constructor(widgetComponent: ComponentBase<any>, templatesManager: TemplatesManager) {
        this._widgetComponent = widgetComponent;
        this._templatesManager = templatesManager;
    }

    public getInitialOptions(): object {
        const configurationTree = this._getConfigurationTree();
        const optionsBuilder = new OptionsBuilder(
            this._templatesManager,
            false
        );

        return optionsBuilder.build(configurationTree, "");
    }

    private _getConfigurationTree(): OptionConfiguration {
        const rootOption = new OptionConfiguration(this._widgetComponent.descriptor, this._widgetComponent.props);

        createChildNodes(this._widgetComponent.props.children).map(
            (childNode) => {
                buildOptionsTree(childNode, rootOption);
            }
        );

        return rootOption;
    }
}

export {
    OptionsManagerNew
};
