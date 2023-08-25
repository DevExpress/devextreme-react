import {
  writeFileSync as writeFile, existsSync, mkdirSync,
} from 'fs';

import {
  dirname as getDirName,
  join as joinPaths,
  relative as getRelativePath,
  sep as pathSeparator,
} from 'path';

import {
  IArrayDescr,
  IComplexProp,
  ICustomType,
  IFunctionDescr,
  IModel,
  IObjectDescr,
  IProp,
  ITypeDescr,
  IWidget,
} from 'devextreme-internal-tools/integration-data-model';

import * as defaultImportOverridesMetadata from './import-overrides.json';

import { convertTypes } from './converter';
import generateIndex, { IReExport } from './index-generator';
import generateCommonReexports from './common-reexports-generator';

import generateComponent, {
  IComponent,
  IIndependentEvents,
  INestedComponent,
  IOption,
  IPropTyping,
  ISubscribableOption,
} from './component-generator';

import {
  isEmptyArray,
  isNotEmptyArray,
  removeExtension,
  removePrefix,
  toKebabCase,
  uppercaseFirst,
} from './helpers';

enum BaseTypes {
  Any = 'any',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Object = 'Record<string, any>',
  Null = 'null',
  True = 'true',
  False = 'false',
}

const UNKNOWN_MODULE = 'UNKNOWN_MODULE';
const LOCAL_MODULE = 'LOCAL_MODULE';

export type ImportOverridesMetadata = {
  importOverrides?: Record<string, string>,
  genericTypes?: Record<string, unknown>,
  defaultImports?: Record<string, string>,
  nameConflictsResolutionNamespaces?: Record<string, string>,
  typeResolutions?: Record<string, string>,
};

type TypeResolver = (typeDescriptor: ITypeDescr) => string;

type TypeGenerationOptions = {
  generateReexports?: boolean,
  generateCustomTypes?: boolean
  importOverridesMetadata?: ImportOverridesMetadata,
};

function isFunctionDescriptor(typeDescriptor: ITypeDescr): typeDescriptor is IFunctionDescr {
  return typeDescriptor.type === 'Function';
}

function isArrayDescriptor(typeDescriptor: ITypeDescr): typeDescriptor is IArrayDescr {
  return typeDescriptor.type === 'Array';
}

function isObjectDescriptor(typeDescriptor: ITypeDescr): typeDescriptor is IObjectDescr {
  return typeDescriptor.type === 'Object' && (typeDescriptor as IObjectDescr).fields !== undefined;
}

export function convertToBaseType(type: string): BaseTypes {
  return BaseTypes[type];
}

export function createCustomTypeResolver(
  customTypeHash: Record<string, ICustomType>,
  importOverridesMetadata: ImportOverridesMetadata,
  customTypeModulesCollector: Record<string, string[]>,
  resolveNameConflicts: (typeName: string, module?: string) => string = (typeName) => typeName,
): TypeResolver {
  return (typeDescriptor: ITypeDescr) => {
    const resolvedType = importOverridesMetadata.typeResolutions?.[typeDescriptor.type]
      || typeDescriptor.type;

    const customType = customTypeHash[resolvedType];

    const moduleImport = typeDescriptor.type === resolvedType && typeDescriptor.isImportedType
      ? typeDescriptor.importPath
      : customType && customType.module;
    const fullModuleImport = moduleImport ? `devextreme/${moduleImport}` : UNKNOWN_MODULE;

    customTypeModulesCollector[resolvedType] = [
      ...(customTypeModulesCollector[resolvedType] || []),
      fullModuleImport,
    ];

    const resultingType = importOverridesMetadata.nameConflictsResolutionNamespaces?.[resolvedType]
      ? `${importOverridesMetadata.nameConflictsResolutionNamespaces[resolvedType]}.${resolvedType}`
      : resolveNameConflicts(resolvedType, fullModuleImport);
    return importOverridesMetadata.genericTypes?.[resultingType] ? `${resultingType}<any>` : resultingType;
  };
}

export function getComplexOptionType(
  types: ITypeDescr[], resolveCustomType?: TypeResolver,
): string | undefined {
  function formatTypeDescriptor(typeDescriptor: ITypeDescr): string {
    function formatArrayDescriptor(arrayDescriptor: IArrayDescr): string {
      const filteredDescriptors = arrayDescriptor.itemTypes?.map((t) => formatTypeDescriptor(t))
        .filter((t) => t !== undefined);
      const itemTypes = filteredDescriptors && filteredDescriptors.length
        ? Array.from(new Set(filteredDescriptors)).join(' | ')
        : BaseTypes.Any;
      return `Array<${itemTypes}>`;
    }

    function formatFunctionDescriptor(functionDescriptor: IFunctionDescr): string {
      const parameters = functionDescriptor.params?.map((p) => {
        const parameterType = getComplexOptionType(p.types, resolveCustomType) || BaseTypes.Any;
        return `${p.name}: ${parameterType === BaseTypes.Object ? BaseTypes.Any : parameterType}`;
      })
        .join(', ') || '';
      let returnType = '';
      if (functionDescriptor.returnValueTypes) {
        returnType = functionDescriptor.returnValueTypes.length > 1
          ? functionDescriptor.returnValueTypes.map((t) => formatTypeDescriptor(t)).join(' | ')
          : (formatTypeDescriptor(functionDescriptor.returnValueTypes[0]) || (functionDescriptor.returnValueTypes[0].type === 'void' && 'void')) || BaseTypes.Any;
      } else {
        returnType = BaseTypes.Any;
      }
      return `(${parameters}) => ${returnType}`;
    }

    function formatObjectDescriptor(objectDescriptor: IObjectDescr): string {
      const fields = objectDescriptor.fields.map((f) => `${f.name}: ${getComplexOptionType(f.types, resolveCustomType) || BaseTypes.Any}`);
      return fields ? `{ ${fields.join(', ')} }` : BaseTypes.Object;
    }

    if (isArrayDescriptor(typeDescriptor)) {
      return formatArrayDescriptor(typeDescriptor);
    }
    if (isFunctionDescriptor(typeDescriptor)) {
      const result = formatFunctionDescriptor(typeDescriptor);
      // TS1385
      return `(${result})`;
    }
    if (isObjectDescriptor(typeDescriptor)) {
      return formatObjectDescriptor(typeDescriptor);
    }
    if (typeDescriptor.acceptableValues !== undefined
       && typeDescriptor.acceptableValues.length > 0) {
      return Array.from(new Set(typeDescriptor.acceptableValues)).join(' | ');
    }
    if ((typeDescriptor.isCustomType || typeDescriptor.isImportedType) && resolveCustomType) {
      return resolveCustomType(typeDescriptor);
    }
    return convertToBaseType(typeDescriptor.type);
  }

  return types && isNotEmptyArray(types) ? Array.from(new Set(types))
    .map((t) => formatTypeDescriptor(t))
    .filter((t) => t !== undefined)
    .join(' | ') : undefined;
}

export function mapSubscribableOption(
  prop: IProp, typeResolver?: TypeResolver,
): ISubscribableOption {
  return {
    name: prop.name,
    type: getComplexOptionType(prop.types, typeResolver) || BaseTypes.Any,
    isSubscribable: prop.isSubscribable || undefined,
  };
}

export function mapIndependentEvents(prop: IProp): IIndependentEvents {
  return {
    name: prop.name,
  };
}

export function isNestedOptionArray(prop: IProp): boolean {
  return isNotEmptyArray(prop.types) && (prop.types[0].type === 'Array');
}

export function mapOption(prop: IProp, typeResolver?: TypeResolver): IOption {
  return isEmptyArray(prop.props)
    ? {
      name: prop.name,
      type: getComplexOptionType(prop.types, typeResolver) || BaseTypes.Any,
      isSubscribable: prop.isSubscribable || undefined,

    } : {
      name: prop.name,
      isSubscribable: prop.isSubscribable || undefined,
      type: getComplexOptionType(prop.types, typeResolver),
      nested: (prop.props as IProp[]).map((p) => mapOption(p, typeResolver)),
      isArray: isNestedOptionArray(prop),
    };
}

function getWidgetComponentNames(rawWidgetName: string, widgetName: string, props: IComplexProp[]) {
  const nameClassMap: Record<string, string> = {};
  nameClassMap[rawWidgetName] = widgetName;
  props.forEach((p) => {
    nameClassMap[p.name] = uppercaseFirst(p.name);
  });
  return nameClassMap;
}

export function extractNestedComponents(
  props: IComplexProp[],
  rawWidgetName: string,
  widgetName: string,
  typeResolver?: TypeResolver,
): INestedComponent[] {
  const nameClassMap = getWidgetComponentNames(rawWidgetName, widgetName, props);
  return props.map((p) => ({
    className: nameClassMap[p.name],
    owners: p.owners.map((o) => nameClassMap[o]),
    optionName: p.optionName,
    options: p.props.map((prop) => mapOption(prop, typeResolver)),
    isCollectionItem: p.isCollectionItem,
    templates: p.templates,
    predefinedProps: p.predefinedProps,
    expectedChildren: p.nesteds,
  }));
}

export function createPropTyping(
  option: IProp,
  customTypes: Record<string, ICustomType>,
): IPropTyping | null {
  const isRestrictedType = (t: ITypeDescr): boolean => t.acceptableValues?.length > 0;

  const rawTypes = option.types.filter((t) => !isRestrictedType(t));
  const restrictedTypes = option.types.filter((t) => isRestrictedType(t));

  const types = convertTypes(rawTypes, customTypes);

  if (restrictedTypes.length > 0) {
    return {
      propName: option.name,
      types: types || [],
      acceptableType: restrictedTypes[0].type.toLowerCase(),
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

export function extractPropTypings(
  options: IProp[],
  customTypes: Record<string, ICustomType>,
): (IPropTyping | null)[] {
  return options
    .map((o) => createPropTyping(o, customTypes))
    .filter((t) => t != null);
}

export function collectIndependentEvents(options: IProp[]): IProp[] {
  return options.reduce((acc, option) => {
    if (option.types.filter((type) => type.type === 'Function').length === 1
        && (!option.firedEvents || option.firedEvents.length === 0)
        && option.name.substr(0, 2) === 'on'
        && !option.name.match(/^(?!.*Value).*Changed/)
    ) {
      acc.push(option);
    }
    return acc;
  }, [] as IProp[]);
}

export function collectSubscribableRecursively(options: IProp[], prefix = ''): IProp[] {
  return options.reduce((acc, option) => {
    if (option.isSubscribable) {
      acc.push({
        ...option,
        name: `${prefix}${option.name}`,
      });
    }
    if (option.props?.length) {
      acc.push(...collectSubscribableRecursively(
        option.props,
        `${option.name}.`,
      ));
    }
    return acc;
  }, [] as IProp[]);
}

export function mapWidget(
  raw: IWidget,
  baseComponent: string,
  extensionComponent: string,
  configComponent: string,
  customTypes: ICustomType[],
  widgetPackage: string,
  typeGenerationOptions?: TypeGenerationOptions,
): {
    fileName: string;
    component: IComponent,
    customTypeImports?: Record<string, Array<string>>,
    defaultTypeImports?: Record<string, string>,
    wildcardTypeImports?: Record<string, string>,
  } {
  const name = removePrefix(raw.name, 'dx');

  const { importOverridesMetadata, generateCustomTypes } = typeGenerationOptions || {};

  const existingTypes: Record<string, string[]> = Object.values(
    getWidgetComponentNames(raw.name, name, raw.complexOptions || []),
  ).reduce((result, current) => {
    result[current] = [LOCAL_MODULE];
    return result;
  }, {});

  const typeAliases: Record<string, Record<string, string>> = {};

  const resolveGeneratedComponentNamesConflict = (
    typeName: string, module: string = UNKNOWN_MODULE,
  ) => {
    const existingTypeEntry = existingTypes[typeName] || [];
    const isModuleProcessed = existingTypeEntry.includes(module);
    const isConflicted = existingTypeEntry.length && (
      existingTypeEntry[0] === LOCAL_MODULE || !isModuleProcessed
    );
    if (!isModuleProcessed) {
      existingTypeEntry.push(module);
      existingTypes[typeName] = existingTypeEntry;
    }
    if (isConflicted) {
      const typePrefix = module === UNKNOWN_MODULE || !module.length
        ? 'Aliased'
        : module
          .substring(module.lastIndexOf('/') + 1)
          .split(/[-_]+/)
          .map((s) => (s.charAt(0).toUpperCase() + s.slice(1)))
          .join('');

      const aliasedTypeName = `${typePrefix}${typeName}`;
      const moduleKey = module && module.length ? module : UNKNOWN_MODULE;
      typeAliases[typeName] = { ...(typeAliases[typeName] || {}), [moduleKey]: aliasedTypeName };
      return aliasedTypeName;
    }
    return typeName;
  };

  const getTypeImportStatement = (typeName: string, module: string = UNKNOWN_MODULE) => (
    typeAliases[typeName]?.[module] ? `${typeName} as ${typeAliases[typeName][module]}` : typeName
  );

  const customTypeHash = customTypes.reduce<Record<string, ICustomType>>((result, type) => {
    result[type.name] = type;
    return result;
  }, {});

  const customTypeModules: Record<string, string[]> = {};
  const typeResolver = generateCustomTypes
    ? createCustomTypeResolver(
      customTypeHash,
      importOverridesMetadata || {},
      customTypeModules,
      resolveGeneratedComponentNamesConflict,
    ) : undefined;

  const subscribableOptions: ISubscribableOption[] = collectSubscribableRecursively(raw.options)
    .map((option) => mapSubscribableOption(option, typeResolver));

  const eventOptions = collectIndependentEvents(raw.options);

  const hasNarrowedEventArgument = (option) => option.types[0].params[0].types[0].isImportedType;
  const narrowedEvents = eventOptions
    .filter(hasNarrowedEventArgument)
    .map((prop) => mapOption(prop, typeResolver));

  const independentEvents: IIndependentEvents[] = eventOptions.map(mapIndependentEvents);

  const nestedOptions = raw.complexOptions
    ? extractNestedComponents(raw.complexOptions, raw.name, name, typeResolver)
    : null;

  const propTypings = extractPropTypings(raw.options, customTypeHash)
    .filter((propType) => propType !== null) as IPropTyping[];

  const customTypeImports: Record<string, string[]> = {};
  const defaultTypeImports: Record<string, string> = {};
  const wildcardTypeImports: Record<string, string> = {};

  Object.keys(customTypeModules).forEach((t) => {
    if (importOverridesMetadata?.defaultImports?.[t]) {
      defaultTypeImports[t] = importOverridesMetadata.defaultImports[t];
      return;
    }

    const modules = customTypeModules[t].map(
      (m) => (importOverridesMetadata?.importOverrides?.[t] ?? m),
    );

    if (modules.length) {
      modules
        .forEach((module, index) => {
          const importNamespace = importOverridesMetadata?.nameConflictsResolutionNamespaces?.[t];
          if (importNamespace) {
            wildcardTypeImports[module] = importNamespace;
          } else {
            const moduleImports = new Set(customTypeImports[module]);
            const initialModule = customTypeModules[t][index];
            moduleImports.add(getTypeImportStatement(t, initialModule));
            customTypeImports[module] = Array.from(moduleImports);
          }
        });
    }
  });

  const dxExportPath = `${widgetPackage}/${raw.exportPath}`;
  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      extensionComponentPath: extensionComponent,
      configComponentPath: configComponent,
      dxExportPath,
      isExtension: raw.isExtension,
      templates: raw.templates,
      subscribableOptions: subscribableOptions.length > 0 ? subscribableOptions : undefined,
      independentEvents: independentEvents.length > 0 ? independentEvents : undefined,
      nestedComponents: nestedOptions && nestedOptions.length > 0 ? nestedOptions : undefined,
      expectedChildren: raw.nesteds,
      propTypings: propTypings.length > 0 ? propTypings : undefined,
      optionsTypeParams: raw.optionsTypeParams,
      containsReexports: !!raw.reexports.filter((r) => r !== 'default').length,
      narrowedEvents,
    },
    customTypeImports,
    defaultTypeImports,
    wildcardTypeImports,
  };
}

function generate({
  metaData: rawData,
  components: { baseComponent, extensionComponent, configComponent },
  out,
  widgetsPackage,
  typeGenerationOptions = {},
}: {
  metaData: IModel,
  components: {
    baseComponent: string,
    extensionComponent: string,
    configComponent: string,
  },
  out: {
    componentsDir: string,
    indexFileName: string
  },
  widgetsPackage: string,
  typeGenerationOptions?: TypeGenerationOptions,
}): void {
  const modulePaths: IReExport[] = [];
  const {
    generateReexports,
    generateCustomTypes,
    importOverridesMetadata,
  } = typeGenerationOptions;

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(
      data,
      baseComponent,
      extensionComponent,
      configComponent,
      rawData.customTypes,
      widgetsPackage,
      {
        generateCustomTypes,
        importOverridesMetadata: importOverridesMetadata || defaultImportOverridesMetadata,
      },
    );
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component, generateReexports, widgetFile.customTypeImports, widgetFile.defaultTypeImports, widgetFile.wildcardTypeImports), { encoding: 'utf8' });
    modulePaths.push({
      name: widgetFile.component.name,
      path: `./${removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, '/')}`,
    });
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: 'utf8' });

  if (generateReexports && rawData.commonReexports) {
    const commonTargetFolderName = 'common';
    const commonPath = joinPaths(out.componentsDir, commonTargetFolderName);
    if (!existsSync(commonPath)) {
      mkdirSync(commonPath);
    }
    Object.keys(rawData.commonReexports).forEach((key) => {
      const targetFileName = key === commonTargetFolderName ? 'index.ts' : `${key.replace(`${commonTargetFolderName}/`, '')}.ts`;
      const fullPath = joinPaths(commonPath, targetFileName);
      mkdirSync(getDirName(fullPath), { recursive: true });
      writeFile(
        fullPath,
        generateCommonReexports(key, rawData.commonReexports[key]),
        { encoding: 'utf8' },
      );
    });
  }
}

export default generate;
