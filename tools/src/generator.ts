import { writeFileSync as writeFile } from "fs";

import {
  dirname as getDirName,
  join as joinPaths,
  relative as getRelativePath,
  sep as pathSeparator
} from "path";

import {
  IComplexProp,
  ICustomType,
  IModel,
  IProp,
  ITypeDescr,
  IWidget
} from "../integration-data-model";

import { convertTypes } from "./converter";
import generateIndex, { IReExport } from "./index-generator";

import generateComponent, {
  IComponent,
  INestedComponent,
  IOption,
  IPropTyping
} from "./component-generator";

import {
  isNotEmptyArray,
  removeExtension,
  removePrefix,
  toKebabCase,
  uppercaseFirst
} from "./helpers";

function generate(
  rawData: IModel,
  baseComponent: string,
  configComponent: string,
  out: {
    componentsDir: string,
    indexFileName: string
  }
) {
  const modulePaths: IReExport[] = [];

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(data, baseComponent, configComponent, rawData.customTypes);
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push({
      name: widgetFile.component.name,
      path: "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    });
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });
}

function mapWidget(
  raw: IWidget,
  baseComponent: string,
  configComponent: string,
  customTypes: ICustomType[]
): {
  fileName: string;
  component: IComponent
} {
  const name = removePrefix(raw.name, "dx");
  const subscribableOptions: IOption[] = raw.options
    .filter((o) => o.isSubscribable)
    .map(mapOption);

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
      configComponentPath: configComponent,
      dxExportPath: raw.exportPath,
      isExtension: raw.isExtension,
      templates: raw.templates,
      subscribableOptions: subscribableOptions.length > 0 ? subscribableOptions : null,
      nestedComponents: nestedOptions && nestedOptions.length > 0 ? nestedOptions : null,
      propTypings: propTypings.length > 0 ? propTypings : null
    }
  };
}

function extractNestedComponents(props: IComplexProp[], rawWidgetName: string, widgetName: string): INestedComponent[] {
  const nameClassMap: Record<string, string> = {};
  const result: INestedComponent[] = [];

  nameClassMap[rawWidgetName] = widgetName;
  props.forEach((p) => {
    nameClassMap[p.name] = uppercaseFirst(p.name);
  });

  return props.map((p) => {
    return {
      className: nameClassMap[p.name],
      ownerClassName: nameClassMap[p.owner],
      optionName: p.optionName,
      options: p.props.map(mapOption),
      isCollectionItem: p.isCollectionItem,
      templates: p.templates
    };
  });
}

function extractPropTypings(options: IProp[], customTypes: Record<string, ICustomType>): IPropTyping[] {
  return options
    .map((o) => createPropTyping(o, customTypes))
    .filter((t) => t != null);
}

function createPropTyping(option: IProp, customTypes: Record<string, ICustomType>): IPropTyping {
  const isRestrictedType = (t: ITypeDescr): boolean => t.acceptableValues && t.acceptableValues.length > 0;

  const rawTypes = option.types.filter((t) => !isRestrictedType(t));
  const restrictedTypes = option.types.filter((t) => isRestrictedType(t));

  const types = convertTypes(rawTypes, customTypes);

  if (restrictedTypes.length > 0) {
    return {
      propName: option.name,
      types: types || [],
      acceptableValues: restrictedTypes[0].acceptableValues
    };
  }

  if ((!types || types.length === 0)) {
    return null;
  }

  return {
    propName: option.name,
    types
  };
}

function mapOption(prop: IProp): IOption {
  const result: IOption = {
    name: prop.name,
    type: "any",
    isSubscribable: prop.isSubscribable
  };

  if (isNotEmptyArray(prop.props)) {
    result.nested = prop.props.map(mapOption);
  }

  return result;
}

export default generate;
