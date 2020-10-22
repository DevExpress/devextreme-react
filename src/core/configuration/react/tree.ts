import * as React from 'react';

import { ITemplateMeta, ITemplateProps } from '../../template';
import { separateProps } from '../../widget-config';

import {
  ElementType, getElementInfo, IExpectedChild, IOptionElement,
} from './element';

import { IConfigNode, ITemplate } from '../config-node';
import { mergeNameParts } from '../utils';
import { getAnonymousTemplate, getNamedTemplate } from './templates';

interface IWidgetDescriptor {
  templates: ITemplateMeta[];
  initialValuesProps: Record<string, string>;
  predefinedValuesProps: Record<string, any>;
  expectedChildren: Record<string, IExpectedChild>;
}

function buildConfigTree(widgetDescriptor: IWidgetDescriptor, props: Record<string, any>) {
  return createConfigNode(
    {
      type: ElementType.Option,
      descriptor: {
        name: '',
        isCollection: false,
        ...widgetDescriptor,
      },
      props,
    },
    '',
  );
}

function createConfigNode(element: IOptionElement, path: string): IConfigNode {
  const fullName = element.descriptor.isCollection
    ? path
    : mergeNameParts(path, element.descriptor.name);

  const separatedValues = separateProps(
    element.props,
    element.descriptor.initialValuesProps,
    element.descriptor.templates,
  );

  const childrenData = processChildren(element, fullName);

  element.descriptor.templates.forEach((templateMeta) => {
    const template = getAnonymousTemplate(
      element.props,
      templateMeta,
      path.length > 0 ? childrenData.hasTranscludedContent : false,
    );
    if (template) {
      childrenData.templates.push(template);
    }
  });

  return {
    fullName,
    predefinedOptions: element.descriptor.predefinedValuesProps,
    initialOptions: separatedValues.defaults,
    options: separatedValues.options,
    templates: childrenData.templates,
    configCollections: childrenData.configCollections,
    configs: childrenData.configs,
  };
}

function processChildren(parentElement: IOptionElement, parentFullName: string) {
  const templates: ITemplate[] = [];
  const configCollections: Record<string, IConfigNode[]> = {};
  const configs: Record<string, IConfigNode> = {};
  let hasTranscludedContent = false;

  React.Children.map(
    parentElement.props.children,
    (child) => {
      const element = getElementInfo(child, parentElement.descriptor.expectedChildren);
      if (element.type === ElementType.Unknown) {
        hasTranscludedContent = true;
        return;
      }

      if (element.type === ElementType.Template) {
        const template = getNamedTemplate(element.props as ITemplateProps);

        if (template) {
          templates.push(template);
        }
        return;
      }

      if (element.descriptor.isCollection) {
        let collection = configCollections[element.descriptor.name];
        if (!collection) {
          collection = [];
          configCollections[element.descriptor.name] = collection;
        }

        const collectionItem = createConfigNode(
          element,
          `${mergeNameParts(
            parentFullName,
            element.descriptor.name,
          )}[${collection.length}]`,
        );

        collection.push(collectionItem);
        return;
      }

      const configNode = createConfigNode(
        element,
        parentFullName,
      );

      configs[element.descriptor.name] = configNode;
    },
  );

  return {
    configs,
    configCollections,
    templates,
    hasTranscludedContent,
  };
}

export {
  buildConfigTree,
};
