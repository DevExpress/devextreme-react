import TemplatesManager from './templates-manager';

import { getChanges } from './configuration/comparer';
import { IConfigNode } from './configuration/config-node';
import { buildConfig, findValue, ValueType } from './configuration/tree';
import { mergeNameParts } from './configuration/utils';
import { capitalizeFirstLetter } from './helpers';

class OptionsManager {
  private readonly _guards: Record<string, number> = {};

  private readonly _updatedOptions: Set<string> = new Set();

  private _templatesManager: TemplatesManager;

  private _instance: any;

  private _isUpdating = false;

  private _currentConfig: IConfigNode;

  constructor(templatesManager: TemplatesManager) {
    this._templatesManager = templatesManager;

    this.onOptionChanged = this.onOptionChanged.bind(this);
    this._wrapOptionValue = this._wrapOptionValue.bind(this);
  }

  public setInstance(instance: unknown, config: IConfigNode): void {
    this._instance = instance;
    this._currentConfig = config;
  }

  public getInitialOptions(rootNode: IConfigNode): Record<string, any> {
    const config = buildConfig(rootNode, false);

    Object.keys(config.templates).forEach((key) => {
      this._templatesManager.add(key, config.templates[key]);
    });
    const options: Record<string, any> = {};

    Object.keys(config.options).forEach((key) => {
      options[key] = this._wrapOptionValue(key, config.options[key]);
    });

    if (this._templatesManager.templatesCount > 0) {
      options.integrationOptions = {
        templates: this._templatesManager.templates,
      };
    }

    return options;
  }

  public update(config: IConfigNode): void {
    const changes = getChanges(config, this._currentConfig);

    if (!changes.options && !changes.templates && !changes.removedOptions.length) {
      return;
    }

    this._instance.beginUpdate();
    this._isUpdating = true;

    changes.removedOptions.forEach((optionName) => {
      this._resetOption(optionName);
    });

    Object.keys(changes.templates).forEach((key) => {
      this._templatesManager.add(key, changes.templates[key]);
    });
    if (this._templatesManager.templatesCount > 0) {
      this._setValue(
        'integrationOptions',
        {
          templates: this._templatesManager.templates,
        },
      );
    }

    Object.keys(changes.options).forEach((key) => {
      this._updatedOptions.add(key);
      this._setValue(key, changes.options[key]);
    });

    this._isUpdating = false;
    this._instance.endUpdate();

    this._currentConfig = config;
  }

  public onOptionChanged(e: { name: string, fullName: string, value: any }): void {
    if (this._isUpdating) {
      return;
    }

    if (this._updatedOptions.has(e.fullName)) {
      this._updatedOptions.delete(e.fullName);
    } else {
      this._callOptionChangeHandler(e.fullName, e.value);
    }
    const valueDescriptor = findValue(this._currentConfig, e.fullName.split('.'));
    if (!valueDescriptor) {
      return;
    }

    const { value, type } = valueDescriptor;
    if (type === ValueType.Complex) {
      Object.keys(value).forEach((key) => {
        if (value[key] === e.value[key]) {
          return;
        }
        this._setGuard(mergeNameParts(e.fullName, key), value[key]);
      });
    } else {
      if (value === e.value) {
        return;
      }
      this._setGuard(e.fullName, value);
    }
  }

  public dispose(): void {
    Object.keys(this._guards).forEach((optionName) => {
      window.clearTimeout(this._guards[optionName]);
      delete this._guards[optionName];
    });
  }

  private _callOptionChangeHandler(optionName: string, optionValue: any) {
    const parts = optionName.split('.');
    const propName = parts[parts.length - 1];

    if (propName.startsWith('on')) {
      return;
    }

    const eventName = `on${capitalizeFirstLetter(propName)}Change`;
    parts[parts.length - 1] = eventName;
    const changeEvent = findValue(this._currentConfig, parts);

    if (!changeEvent) {
      return;
    }

    if (typeof changeEvent.value !== 'function') {
      throw new Error(
        `Invalid value for the ${eventName} property.
                ${eventName} must be a function.`,
      );
    }
    changeEvent.value(optionValue);
  }

  private _wrapOptionValue(name: string, value: any) {
    if (name.substr(0, 2) === 'on' && typeof value === 'function') {
      return (...args: any[]) => {
        if (!this._isUpdating) {
          value(...args);
        }
      };
    }

    return value;
  }

  private _setGuard(optionName: string, optionValue: any): void {
    if (this._guards[optionName] !== undefined) {
      return;
    }

    const guardId = window.setTimeout(() => {
      this._setValue(optionName, optionValue);
      window.clearTimeout(guardId);
      delete this._guards[optionName];
    });

    this._guards[optionName] = guardId;
  }

  private _resetOption(name: string) {
    this._instance.resetOption(name);
  }

  private _setValue(name: string, value: any) {
    if (this._guards[name]) {
      window.clearTimeout(this._guards[name]);
      delete this._guards[name];
    }

    this._instance.option(
      name,
      this._wrapOptionValue(name, value),
    );
  }
}

export {
  OptionsManager,
};
