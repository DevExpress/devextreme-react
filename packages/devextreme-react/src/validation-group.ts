import dxValidationGroup, {
  Properties,
} from 'devextreme/ui/validation_group';

import * as PropTypes from 'prop-types';
import type * as ValidationGroupTypes from 'devextreme/ui/validation_group_types';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IValidationGroupOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>;

class ValidationGroup extends BaseComponent<React.PropsWithChildren<IValidationGroupOptions>> {
  public get instance(): dxValidationGroup {
    return this._instance;
  }

  protected _WidgetClass = dxValidationGroup;

  protected independentEvents = ['onDisposing', 'onInitialized'];
}
(ValidationGroup as any).propTypes = {
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};
export default ValidationGroup;
export {
  ValidationGroup,
  IValidationGroupOptions,
};
export { ValidationGroupTypes };
