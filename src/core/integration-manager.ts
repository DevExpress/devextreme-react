import { ComponentBase } from "./component-base";
import { OptionConfiguration } from "./configuration/option-configuration";
import { OptionsBuilder } from "./configuration/options-builder";
import { buildOptionsTree } from "./configuration/options-tree";
import { createChildNodes } from "./configuration/react-node";
import TemplatesManager from "./templates-manager";
import { TemplatesStore } from "./templates-store";

class IntegrationManager {
    public readonly templatesStore: TemplatesStore;
    private _templatesManager: TemplatesManager;
    private _optionsBuilder: OptionsBuilder;

    private _containerElement: HTMLDivElement;
    private _instance: any;
    private _component: ComponentBase<any>;
    private _currentOptions: Record<string, any>;

    constructor(component: ComponentBase<any>) {
        this._component = component;

        this.templatesStore = new TemplatesStore(() => {
            if (this._component.templatesRenderer) {
                this._component.templatesRenderer.forceUpdate();
            }
        });
        this._templatesManager = new TemplatesManager(this.templatesStore);
        this._optionsBuilder = new OptionsBuilder(this._templatesManager);
    }

    public createWidget(containerElement: HTMLDivElement) {
        this._containerElement = containerElement;

        this._currentOptions = this._getOptions(false);
        this._instance = new this._component.widgetClass(this._containerElement, this._currentOptions);
    }

    public updateOptions() {
        const options = this._getOptions(true);
        this._instance.option(options);
        this._currentOptions = options;
    }

    private _getOptions(ignoreInitialValues: boolean): Record<string, any> {
        const config = new OptionConfiguration(this._component.descriptor, this._component.props);

        createChildNodes(this._component.props.children).map(
            (childNode) => {
                buildOptionsTree(childNode, config);
            }
        );

        return this._optionsBuilder.build(config, ignoreInitialValues);
    }
}

export {
    IntegrationManager
};
