import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";
import { IOption as IRawOption, ISubscribableOption, IWidget, } from "../integration-data-model";
import generateComponent, { IComponent, IPropTyping } from "./component-generator";
import { convertTypes } from "./converter";
import { removeElement, removeExtension, removePrefix, toKebabCase } from "./helpers";
import generateIndex from "./index-generator";

function generate(
  rawData: IWidget[],
  baseComponent: string,
  out: {
    componentsDir: string,
    indexFileName: string
  }
) {
  const modulePaths: string[] = [];

  rawData.forEach((data) => {
    const widgetFile = mapWidget(data, baseComponent);
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push(
      "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });
}

function mapWidget(raw: IWidget, baseComponent: string): {
  fileName: string;
  component: IComponent
} {
  const name = removePrefix(raw.name, "dx");

  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      dxExportPath: raw.exportPath,
      templates: raw.templates,
      subscribableOptions: raw.subscribableOptions,
      propTypings: extractPropTypings(raw.options)
    }
  };
}

function extractPropTypings(options: IRawOption[]): IPropTyping[]  {
  return options
    .map(createPropTyping)
    .filter((t) => t != null);
}

function createPropTyping(option: IRawOption) {
  const rawTypes = option.types;
  if (option.valueRestriction) {
    removeElement(rawTypes, option.valueRestriction.type);
  }

  const types = convertTypes(rawTypes);

  if (option.valueRestriction) {
    return {
      propName: option.name,
      types: types || [],
      acceptableValues: option.valueRestriction.acceptableValues
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
