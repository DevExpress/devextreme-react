import { writeFileSync as writeFile } from 'fs';

import {
  dirname as getDirName,
  join as joinPaths,
  normalize as normalizePath,
  relative as getRelativePath,
  sep as pathSeparator,
} from 'path';

import {
  IComplexProp,
  ICustomType,
  IModel,
  IProp,
  ITypeDescr,
  IWidget,
} from '../integration-data-model';

import { convertTypes } from './converter';
import generateIndex, { IReExport } from './index-generator';

import generateComponent, {
  generateReExport,
  IComponent,
  INestedComponent,
  IOption,
  IPropTyping,
  ISubscribableOption,
} from './component-generator';

import {
  isEmptyArray,
  removeExtension,
  removePrefix,
  toKebabCase,
  uppercaseFirst,
} from './helpers';

function generate({
  metaData: rawData,
  components: { baseComponent, extensionComponent, configComponent },
  out,
  widgetsPackage,
}: {
  metaData: IModel,
  components: {
    baseComponent: string,
    extensionComponent: string,
    configComponent: string,
  },
  out: {
    componentsDir: string,
    oldComponentsDir: string,
    indexFileName: string
  },
  widgetsPackage: string
}): void {
  const modulePaths: IReExport[] = [];

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(
      data,
      baseComponent,
      extensionComponent,
      configComponent,
      rawData.customTypes,
      widgetsPackage,
    );
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: 'utf8' });
    modulePaths.push({
      name: widgetFile.component.name,
      path: `./${removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, '/')}`,
    });

    writeFile(
      joinPaths(out.oldComponentsDir, widgetFile.fileName),
      generateReExport(
        normalizePath(`./${removeExtension(getRelativePath(out.oldComponentsDir, widgetFilePath))}`)
          .replace(pathSeparator, '/'),
        removeExtension(widgetFile.fileName),
      ),
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: 'utf8' });
}

function mapWidget(
  raw: IWidget,
  baseComponent: string,
  extensionComponent: string,
  configComponent: string,
  customTypes: ICustomType[],
  widgetPackage: string,
): {
    fileName: string;
    component: IComponent
  } {
  const name = removePrefix(raw.name, 'dx');
  const subscribableOptions: ISubscribableOption[] = raw.options
    .filter((o) => o.isSubscribable)
    .map(mapSubscribableOption);

  const nestedOptions = raw.complexOptions
    ? extractNestedComponents(raw.complexOptions, raw.name, name)
    : null;

  const customTypeHash = customTypes.reduce((result, type) => {
    result[type.name] = type;
    return result;
  }, {});
  const propTypings = extractPropTypings(raw.options, customTypeHash);

  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      extensionComponentPath: extensionComponent,
      configComponentPath: configComponent,
      dxExportPath: `${widgetPackage}/${raw.exportPath}`,
      isExtension: raw.isExtension,
      templates: raw.templates,
      subscribableOptions: subscribableOptions.length > 0 ? subscribableOptions : undefined,
      nestedComponents: nestedOptions && nestedOptions.length > 0 ? nestedOptions : undefined,
      expectedChildren: raw.nesteds,
      propTypings: propTypings.length > 0 ? propTypings : undefined,
    },
  };
}

function extractNestedComponents(
  props: IComplexProp[],
  rawWidgetName: string,
  widgetName: string,
): INestedComponent[] {
  const nameClassMap: Record<string, string> = {};
  nameClassMap[rawWidgetName] = widgetName;
  props.forEach((p) => {
    nameClassMap[p.name] = uppercaseFirst(p.name);
  });

  return props.map((p) => ({
    className: nameClassMap[p.name],
    owners: p.owners.map((o) => nameClassMap[o]),
    optionName: p.optionName,
    options: p.props.map(mapOption),
    isCollectionItem: p.isCollectionItem,
    templates: p.templates,
    predefinedProps: p.predefinedProps,
    expectedChildren: p.nesteds,
  }));
}

function extractPropTypings(
  options: IProp[],
  customTypes: Record<string, ICustomType>,
): IPropTyping[] {
  return options
    .map((o) => createPropTyping(o, customTypes))
    .filter((t) => t != null);
}

function createPropTyping(option: IProp, customTypes: Record<string, ICustomType>): IPropTyping {
  const isRestrictedType = (t: ITypeDescr): boolean => t.acceptableValues
    && t.acceptableValues.length > 0;

  const rawTypes = option.types.filter((t) => !isRestrictedType(t));
  const restrictedTypes = option.types.filter((t) => isRestrictedType(t));

  const types = convertTypes(rawTypes, customTypes);

  if (restrictedTypes.length > 0) {
    return {
      propName: option.name,
      types: types || [],
      acceptableValues: restrictedTypes[0].acceptableValues,
    };
  }

  if ((!types || types.length === 0)) {
    return null;
  }

  return {
    propName: option.name,
    types,
  };
}

function mapOption(prop: IProp): IOption {
  return isEmptyArray(prop.props)
    ? {
      name: prop.name,
      type: 'any',
      isSubscribable: prop.isSubscribable || undefined,

    } : {
      name: prop.name,
      isSubscribable: prop.isSubscribable || undefined,
      nested: prop.props.map(mapOption),
    };
}

function mapSubscribableOption(prop: IProp): ISubscribableOption {
  return {
    name: prop.name,
    type: 'any',
    isSubscribable: prop.isSubscribable || undefined,
  };
}

export default generate;
