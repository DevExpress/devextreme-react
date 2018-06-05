import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";
import { IArrayDescr, ICustomType, IModel, IProp, ITypeDescr, IWidget } from "../integration-data-model";
import generateComponent, {
    IComponent,
    INestedComponent,
    IOption,
    IPropTyping
} from "./component-generator";
import { findCustomTypeRef, toPropTypingType } from "./converter";
import {
  isEmptyArray,
  isNotEmptyArray,
  removeElement,
  removeExtension,
  removePrefix,
  toKebabCase,
  toSingularName,
  uppercaseFirst
} from "./helpers";
import generateIndex from "./index-generator";

function generate(
  rawData: IModel,
  baseComponent: string,
  configComponent: string,
  out: {
    componentsDir: string,
    indexFileName: string
  }
) {
  const modulePaths: string[] = [];
  const customTypes: Record<string, ICustomType> = {};
  rawData.customTypes.forEach((t) => customTypes[t.name] = t);

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(data, baseComponent, configComponent, (t) => customTypes[t]);
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push(
      "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });
}

function mapWidget(
  raw: IWidget,
  baseComponent: string,
  configComponent: string,
  getCustomType: (name: string) => ICustomType
): {
  fileName: string;
  component: IComponent
} {
  const name = removePrefix(raw.name, "dx");
  const subscribableOptions: IOption[] = raw.options
    .filter((o) => o.isSubscribable)
    .map(mapOption);

  const nestedOptions = extractNestedComponents(name, raw.options, getCustomType);
  const propTypings = extractPropTypings(raw.options);

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
      nestedComponents: nestedOptions.length > 0 ? nestedOptions : null,
      propTypings: propTypings.length > 0 ? propTypings : null
    }
  };
}

function extractNestedComponents(
  owner: string,
  props: IProp[],
  getCustomType: (name: string) => ICustomType
): INestedComponent[] {
  const result: INestedComponent[] = [];
  props.forEach((p) => {
    let isCollectionItem = false;

    let nestedProps: IProp[];
    const customTypeRef = findCustomTypeRef(p.types);
    if (customTypeRef) {
      nestedProps = getCustomType(customTypeRef.type).props;
      isCollectionItem = customTypeRef.isCollectionItem;
    } else {
      nestedProps = p.props;
    }

    if (!p.isSubscribable || isEmptyArray(nestedProps)) {
      return;
    }

    const className = `${owner}${uppercaseFirst(isCollectionItem ? toSingularName(p.name) : p.name)}`;

    result.push({
      owner,
      className,
      optionName: p.name,
      options: nestedProps.map(mapOption),
      isCollectionItem
    });

    result.push(...extractNestedComponents(className, nestedProps, getCustomType));
  });

  return result;
}

function extractPropTypings(options: IProp[]): IPropTyping[] {
  return options
    .map(createPropTyping)
    .filter((t) => t != null);
}

function createPropTyping(option: IProp): IPropTyping {
  const isRestrictedType = (t: ITypeDescr): boolean => t.acceptableValues && t.acceptableValues.length > 0;

  const rawTypes = option.types.filter((t) => !isRestrictedType(t));
  const restrictedTypes = option.types.filter((t) => isRestrictedType(t));

  const types = toPropTypingType(rawTypes.map((t) => t.isCustomType ? "Object" : t.type));

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
