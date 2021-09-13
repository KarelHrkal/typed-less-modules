import reserved from "reserved-words";

import { ClassNames, ClassName } from "lib/less/file-to-class-names";
import { alerts, MainOptions } from "../core";

export type ExportType = "named" | "values" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "values", "default"];

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className.value}: string;`;

const classNameToValues = (className: ClassName) =>
  `export const ${className.value} = "${className.valueOriginal}";`;

const classNameToInterfaceKey = (className: ClassName) =>
  `  '${className.value}': string;`;

const isReservedKeyword = (className: ClassName) =>
  reserved.check(className.value, "es5", true) ||
  reserved.check(className.value, "es6", true);

const isValidName = (className: ClassName) => {
  if (isReservedKeyword(className)) {
    alerts.warn(
      `[SKIPPING] '${className.value}' is a reserved keyword (consider renaming or using --exportType default).`
    );
    return false;
  } else if (/-/.test(className.value)) {
    alerts.warn(
      `[SKIPPING] '${className.value}' contains dashes (consider using 'camelCase' or 'dashes' for --nameFormat or using --exportType default).`
    );
    return false;
  }

  return true;
};

export const classNamesToTypeDefinitions = (
  classNames: ClassNames,
  options: MainOptions
): string | null => {
  if (classNames.length) {
    let typeDefinitions;

    const newLine = options.lineEnding
      .replace("\\n", "\n")
      .replace("\\r", "\r");

    switch (options.exportType) {
      case "default":
        typeDefinitions = `export interface Styles {${newLine}`;
        typeDefinitions += classNames
          .map(classNameToInterfaceKey)
          .join(newLine);
        typeDefinitions += `${newLine}}${newLine}${newLine}`;
        typeDefinitions += `export type ClassNames = keyof Styles;${newLine}${newLine}`;
        typeDefinitions += `declare const styles: Styles;${newLine}${newLine}`;
        typeDefinitions += `export default styles;${newLine}`;
        return typeDefinitions;
      case "named":
        typeDefinitions = classNames
          .filter(isValidName)
          .map(classNameToNamedTypeDefinition);

        // Sepearte all type definitions be a newline with a trailing newline.
        return typeDefinitions.join(newLine) + newLine;
      case "values":
        typeDefinitions = classNames.filter(isValidName).map(classNameToValues);

        // Sepearte all type definitions be a newline with a trailing newline.
        return typeDefinitions.join(newLine) + newLine;
      default:
        return null;
    }
  } else {
    return null;
  }
};
