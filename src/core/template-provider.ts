import * as ReactDOM from "react-dom";

import * as events from "devextreme/events";

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

const generateID = () => Math.random().toString(36).substr(2);

export function prepareTemplate(tmplFn: any, component: React.Component): object {
  return {
    render: (data: any) => {
      const element = document.createElement("div");
      element.className = DX_TEMPLATE_WRAPPER_CLASS;
      data.container.appendChild(element);

      const templateId = "__template_" + generateID();
      events.one(element, DX_REMOVE_EVENT, () => {
        component.setState((state: any) => {
          const updatedTemplates = {...state.templates};
          delete updatedTemplates[templateId];
          return {
            templates : updatedTemplates
          };
        });
      });

      const portal: any = () => ReactDOM.createPortal(tmplFn(data.model), element);

      component.setState((state: any) => {
        const updatedTemplates = {...state.templates};
        updatedTemplates[templateId] = portal;
        return {
          templates : updatedTemplates
        };
      });
      return element;
    }
  };
}
