import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";
import { IOption as IRawOption, ITypeDescriptor, IWidget } from "../integration-data-model";
import generateComponent, { IComponent, IOption, IPropTyping } from "./component-generator";
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
  const subscribableOptions: IOption[] = raw.options
    .filter((o) => o.isSubscribable)
    .map((o) => ({
      name: o.name,
      type: "any"
    }));

  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      dxExportPath: raw.exportPath,
      templates: raw.templates,
      subscribableOptions:  subscribableOptions.length > 0 ? subscribableOptions : null,
      propTypings: extractPropTypings(raw.options)
    }
  };
}

function extractPropTypings(options: IRawOption[]): IPropTyping[]  {
  return options
    .map(createPropTyping)
    .filter((t) => t != null);
}

function createPropTyping(option: IRawOption): IPropTyping {
  const isRestrictedType = (t: ITypeDescriptor): boolean => t.acceptableValues && t.acceptableValues.length > 0;

  const rawTypes = option.types.filter((t) => !isRestrictedType(t));
  const restrictedTypes = option.types.filter((t) => isRestrictedType(t));

  const types = convertTypes(rawTypes.map((t) => t.type));

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
