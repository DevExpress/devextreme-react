import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";
import { IModel, IProp, ITypeDescr, IWidget } from "../integration-data-model";
import generateComponent, { IComponent, IOption, IPropTyping } from "./component-generator";
import { convertTypes } from "./converter";
import { isNotEmptyArray, removeElement, removeExtension, removePrefix, toKebabCase } from "./helpers";
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

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(data, baseComponent, configComponent);
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push(
      "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });
}

function mapWidget(raw: IWidget, baseComponent: string, configComponent: string): {
  fileName: string;
  component: IComponent
} {
  const name = removePrefix(raw.name, "dx");
  const subscribableOptions: IOption[] = raw.options
    .filter((o) => o.isSubscribable)
    .map(mapOption);

  const nestedOptions: IOption[] = raw.options
    .filter((o) => o.isSubscribable && isNotEmptyArray(o.props))
    .map(mapOption);

  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      configComponentPath: configComponent,
      dxExportPath: raw.exportPath,
      templates: raw.templates,
      subscribableOptions: subscribableOptions.length > 0 ? subscribableOptions : null,
      nestedOptions: nestedOptions.length > 0 ? nestedOptions : null,
      propTypings: extractPropTypings(raw.options)
    }
  };
}

function mapOption(opt: IProp): IOption {
  const result: IOption = {
    isCollectionItem: false,
    name: opt.name,
    type: "any"
  };

  if (isNotEmptyArray(opt.props)) {
    result.nested = opt.props.map(mapOption);
  }

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

  const types = convertTypes(rawTypes.map((t) => t.isCustomType ? "Object" : t.type));

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

export default generate;
