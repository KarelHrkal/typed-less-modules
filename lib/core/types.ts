import { Options } from "../less";
import { ExportType } from "../typescript";

export interface MainOptions extends Options {
  exportType: ExportType;
  listDifferent: boolean;
  watch: boolean;
  ignoreInitial: boolean;
  lineEnding: string;
}
