import { ExportType } from "./class-names-to-type-definition";

/**
 * Given a file path to a LESS file, generate the corresponding type defintion
 * file path.
 *
 * @param file the LESS file path
 */
export const getTypeDefinitionPath = (
  file: string,
  exportType: ExportType
): string =>
  exportType == "values"
    ? `${file.replace(/\.less$/, "")}.const.ts`
    : `${file}.d.ts`;
