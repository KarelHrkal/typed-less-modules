import { classNamesToTypeDefinitions, ExportType } from "../../lib/typescript";

describe("classNamesToTypeDefinitions", () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  describe("named", () => {
    it("converts an array of class name strings to type definitions", () => {
      const definition = classNamesToTypeDefinitions(
        [{ value: "myClass" }, { value: "yourClass" }],
        {
          watch: false,
          ignoreInitial: false,
          exportType: "named",
          listDifferent: false,
          lineEnding: "\\n"
        }
      );

      expect(definition).toEqual(
        "export const myClass: string;\nexport const yourClass: string;\n"
      );
    });

    it("returns null if there are no class names", () => {
      const definition = classNamesToTypeDefinitions([], {
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        listDifferent: false,
        lineEnding: "\\n"
      });

      expect(definition).toBeNull;
    });

    it("prints a warning if a classname is a reserved keyword and does not include it in the type definitions", () => {
      const definition = classNamesToTypeDefinitions(
        [{ value: "myClass" }, { value: "if" }],
        {
          watch: false,
          ignoreInitial: false,
          exportType: "named",
          listDifferent: false,
          lineEnding: "\\n"
        }
      );

      expect(definition).toEqual("export const myClass: string;\n");
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[SKIPPING] 'if' is a reserved keyword`)
      );
    });

    it("prints a warning if a classname is invalid and does not include it in the type definitions", () => {
      const definition = classNamesToTypeDefinitions(
        [{ value: "myClass" }, { value: "invalid-variable" }],
        {
          watch: false,
          ignoreInitial: false,
          exportType: "named",
          listDifferent: false,
          lineEnding: "\\n"
        }
      );

      expect(definition).toEqual("export const myClass: string;\n");
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[SKIPPING] 'invalid-variable' contains dashes`)
      );
    });
  });

  describe("default", () => {
    it("converts an array of class name strings to type definitions", () => {
      const definition = classNamesToTypeDefinitions(
        [{ value: "myClass" }, { value: "yourClass" }],
        {
          watch: false,
          ignoreInitial: false,
          exportType: "default",
          listDifferent: false,
          lineEnding: "\\n"
        }
      );

      expect(definition).toEqual(
        "export interface Styles {\n  'myClass': string;\n  'yourClass': string;\n}\n\nexport type ClassNames = keyof Styles;\n\ndeclare const styles: Styles;\n\nexport default styles;\n"
      );
    });

    it("returns null if there are no class names", () => {
      const definition = classNamesToTypeDefinitions([], {
        watch: false,
        ignoreInitial: false,
        exportType: "default",
        listDifferent: false,
        lineEnding: "\\n"
      });

      expect(definition).toBeNull;
    });
  });

  describe("invalid export type", () => {
    it("returns null", () => {
      const definition = classNamesToTypeDefinitions([{ value: "myClass" }], {
        watch: false,
        ignoreInitial: false,
        exportType: "invalid" as ExportType,
        listDifferent: false,
        lineEnding: "\\n"
      });

      expect(definition).toBeNull;
    });
  });
});
