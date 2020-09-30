import { writeFileSync as writeFile } from "fs";

const missingImports = require('../missing-types.json')

import {
  dirname as getDirName,
  join as joinPaths,
  normalize as normalizePath,
  relative as getRelativePath,
  sep as pathSeparator
} from "path";

import {
  IArrayDescr,
  IComplexProp,
  ICustomType,
  IFunctionDescr,
  IModel,
  IObjectDescr,
  IProp,
  ITypeDescr,
  IWidget
} from "../integration-data-model";

import { convertTypes } from "./converter";
import generateIndex, { IReExport } from "./index-generator";

const hardTypes = { values: new Set() }
const realized = { values: new Set() }
const importCustomTypesSet = { values: new Set() }

import generateComponent, {
  generateReExport,
  IComponent,
  INestedComponent,
  IOption,
  IPropTyping,
  ISubscribableOption
} from "./component-generator";

import {
  isEmptyArray,
  isNotEmptyArray,
  removeExtension,
  removePrefix,
  toKebabCase,
  uppercaseFirst
} from "./helpers";

function generate({
  metaData: rawData,
  components: { baseComponent, extensionComponent, configComponent },
  out,
  widgetsPackage
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
}) {
  const modulePaths: IReExport[] = [];

  const SAMPLE = parseCustomTypes(rawData.customTypes)
  const importStr = missingImports.values.map((imp) => `import ${imp.name} from "${imp.path}";`).join('\n');
  const exportStr = missingImports.values.map((imp) => `export {${imp.name}};`).join('\n');
  writeFile('./src/types.d.ts', importStr + '\n' + SAMPLE + exportStr);
  let output = ""
  const difference = new Set(
    [...hardTypes.values].filter(x => !realized.values.has(x)));
  difference.forEach(v => output += v + "\n");
  writeFile('./hard-types.ts', output)

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(
      data,
      baseComponent,
      extensionComponent,
      configComponent,
      rawData.customTypes,
      widgetsPackage
    );
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, `import { ${widgetFile.importCustomTypes.join(', ')}} from "./types"\n` + generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push({
      name: widgetFile.component.name,
      path: "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    });

    writeFile(
      joinPaths(out.oldComponentsDir, widgetFile.fileName),
      generateReExport(
        normalizePath("./" + removeExtension(getRelativePath(out.oldComponentsDir, widgetFilePath)))
          .replace(pathSeparator, "/"),
        removeExtension(widgetFile.fileName)
      )
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });

}

function mapWidget(
  raw: IWidget,
  baseComponent: string,
  extensionComponent: string,
  configComponent: string,
  customTypes: ICustomType[],
  widgetPackage: string
): {
  fileName: string;
  component: IComponent;
  importCustomTypes: string[]
} {
  const name = removePrefix(raw.name, "dx");
  const subscribableOptions: ISubscribableOption[] = raw.options
    .filter((o) => o.isSubscribable)
    .map(mapSubscribableOption);

  importCustomTypesSet.values = new Set();

  const nestedOptions = raw.complexOptions
    ? extractNestedComponents(raw.complexOptions, raw.name, name)
    : null;

  const customTypeHash = customTypes.reduce((result, type) => {
    result[type.name] = type;
    return result;
  }, {});
  const propTypings = extractPropTypings(raw.options, customTypeHash);

  const importsSet = new Set(
    [...importCustomTypesSet.values].filter(x => realized.values.has(x)));

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
      propTypings: propTypings.length > 0 ? propTypings : undefined
    },
    importCustomTypes: Array.from(importsSet) as string[]
  };
}

function extractNestedComponents(props: IComplexProp[], rawWidgetName: string, widgetName: string): INestedComponent[] {
  const nameClassMap: Record<string, string> = {};
  nameClassMap[rawWidgetName] = widgetName;
  props.forEach((p) => {
    nameClassMap[p.name] = uppercaseFirst(p.name);
  });

  return props.map((p) => {
    return {
      className: nameClassMap[p.name],
      owners: p.owners.map((o) => nameClassMap[o]),
      optionName: p.optionName,
      options: p.props.map(mapOption),
      isCollectionItem: p.isCollectionItem,
      templates: p.templates,
      predefinedProps: p.predefinedProps,
      expectedChildren: p.nesteds
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
  return isEmptyArray(prop.props) ?
    {
      name: prop.name,
      type: typePropToStr(prop, true) || "any",
      isSubscribable: prop.isSubscribable || undefined

    } : {
      name: prop.name,
      isSubscribable: prop.isSubscribable || undefined,
      nested: prop.props.map(mapOption)
    };
}

function mapSubscribableOption(prop: IProp): ISubscribableOption {
  return {
    name: prop.name,
    type: "any",
    isSubscribable: prop.isSubscribable || undefined
  };
}

function parseCustomTypes(customTypes: ICustomType[]): string {
  const customDeclaration = customTypes.map(type => {
    return customTypeToString(type)
  })
  return customDeclaration.join('\n')
}

function _typeToStr(type: ITypeDescr): string {
  if (type.acceptableValues)
    return type.acceptableValues.join('|')
  if (type.type == 'Any')
    return 'any'
  if (type.isCustomType) {
    importCustomTypesSet.values.add(type.type)
    hardTypes.values.add(type.type)
  }

  return type.type.replace(/\./g, '')
}

function _typeArrToStr(type_arr: IArrayDescr): string {
  if (isNotEmptyArray(type_arr.itemTypes)) {
    return `Array<${type_arr.itemTypes.map(ITypeDescrToStr).join('|')}>`
  }

}

function _typeFuncToStr(func: IFunctionDescr): string {
  if (isNotEmptyArray(func.params)) {
    const declarations = func.params.map(p => {
      const types = p.types.map(t => ITypeDescrToStr(t))
      return `${p.name}: ${types.join('|')}`
    });
    const ret = ITypeDescrToStr(func.returnValueType);
    return `((${declarations.join(',')})=>${ret})`
  }
  else return 'Function'
}

function _typeObjToStr(obj: IObjectDescr): string {
  if (isNotEmptyArray(obj.fields)) {
    const fields = obj.fields.map(f => {
      const types = f.types.map(t => ITypeDescrToStr(t))
      return `${f.name}: ${types.join('|')}`
    })
    return `{${fields.join(',\n')}}`;
  }
  else return 'Object';

}

function ITypeDescrToStr(basic_type: ITypeDescr | IArrayDescr | IFunctionDescr | IObjectDescr) {
  switch (basic_type.type) {
    case ('Object'):
      return _typeObjToStr(basic_type as IObjectDescr)
    case ('Function'):
      return _typeFuncToStr(basic_type as IFunctionDescr)
    case ('Array'):
      return _typeArrToStr(basic_type as IArrayDescr)
    default:
      return _typeToStr(basic_type)
  }
}

function typePropToStr(prop: IProp, noname: Boolean = false): string {
  const name = noname ? '' : `${prop.name.replace(/\(.*\)/, '')}: `
  if (isNotEmptyArray(prop.props)) {
    return `${name}{${prop.props.map(p => typePropToStr(p))}}`

  }
  else {
    if (isNotEmptyArray(prop.types)) {
      return `${name}${prop.types.map(ITypeDescrToStr).join('|')}`
    }
    else return `${name}any`
  }
}

function customTypeToString(type: ICustomType): string {
  const name = type.name.replace(/\./g, '')
  realized.values.add(name)
  const statements = []
  let prev = ''
  let tempStatements = []
  if (isNotEmptyArray(type.props)) {
    type.props.map(p => {
      const Pname = p.name.replace(/\(.*\)/, '')
      if (Pname !== prev) {
        statements.push([...tempStatements, typePropToStr(p)].reverse().join('|'))
        prev = Pname
        tempStatements = []
      }
      else {
        tempStatements.push(typePropToStr(p, true))
      }
    })
    return `export interface ${name} {
      ${statements.map((s) => '\t' + s).join(',\n')}
            }\n`;
  }
  else return `export interface ${name}{}`

}

export default generate;