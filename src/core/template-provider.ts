import * as React from "react";

import TemplateWrapper from "./template-wrapper";

const generateID = () => Math.random().toString(36).substr(2);

const unwrapElement = (element: any) =>  element.get ? element.get(0) : element;

export interface ITemplateData {
  container: any;
  model?: any;
  index?: any;
}

export function prepareTemplate(tmplFn: any, component: React.Component): { render: (data: ITemplateData) => any } {
  return {
    render: (data: ITemplateData) => {
      const templateId = "__template_" + generateID();
      const removedHandler = () => {
      component.setState((state: any) => {
          const updatedTemplates = {...state.templates};
          delete updatedTemplates[templateId];
          return {
            templates: updatedTemplates
          };
        });
      };

      const templateWrapper: any = () =>
        React.createElement(TemplateWrapper, {
          content: tmplFn(data.model),
          container: unwrapElement(data.container),
          onRemoved: removedHandler,
          key: templateId
        });

      component.setState((state: any) => {
        const updatedTemplates = {...state.templates};
        updatedTemplates[templateId] = templateWrapper;
        return {
          templates: updatedTemplates
        };
      });
    }
  };
}
