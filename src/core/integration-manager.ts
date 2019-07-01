import { ComponentBase } from "./component-base";
import { OptionConfiguration } from "./configuration/option-configuration";
import { OptionsBuilder } from "./configuration/options-builder";
import { buildOptionsTree } from "./configuration/options-tree";
import { createChildNodes } from "./configuration/react-node";
import TemplatesManager from "./templates-manager";
import { TemplatesStore } from "./templates-store";

class IntegrationManager {
    private _templatesStore: TemplatesStore;
    private _templatesManager: TemplatesManager;

    private _containerElement: HTMLDivElement;
    private _instance: any;
    private _component: ComponentBase<any>;

    constructor(component: ComponentBase<any>) {
        this._component = component;

        this._templatesStore = new TemplatesStore(() => this._component.scheduleUpdate());
        this._templatesManager = new TemplatesManager(this._templatesStore);
    }

    public createWidget(containerElement: HTMLDivElement) {
        this._containerElement = containerElement;

        const options = this._getOptions(false);
        // console.log(options);
        this._instance = new this._component.widgetClass(this._containerElement, options);
    }

    public getWrappers() {
        return this._templatesStore.renderWrappers();
    }

    private _getOptions(ignoreInitialValues: boolean): Record<string, any> {
        const config = new OptionConfiguration(this._component.descriptor, this._component.props);

        createChildNodes(this._component.props.children).map(
            (childNode) => {
                buildOptionsTree(childNode, config);
            }
        );

        const optionsBuilder = new OptionsBuilder(this._templatesManager);

        return optionsBuilder.build(config, ignoreInitialValues);
    }
}

export {
    IntegrationManager
};
