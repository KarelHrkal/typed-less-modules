import { fileToClassNames } from "../../lib/less";

describe("fileToClassNames", () => {
  test("it converts a file path to an array of class names (default camel cased)", async () => {
    const result = await fileToClassNames(`${__dirname}/../complex.less`);

    expect(result).toEqual([
      { value: "someStyles", valueOriginal: "some-styles" },
      { value: "nestedClass", valueOriginal: "nested-class" },
      { value: "nestedAnother", valueOriginal: "nested-another" }
    ]);
  });

  describe("nameFormat", () => {
    test("it converts a file path to an array of class names with kebab as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.less`, {
        nameFormat: "kebab"
      });

      expect(result).toEqual([
        { value: "some-styles", valueOriginal: "some-styles" },
        { value: "nested-class", valueOriginal: "nested-class" },
        { value: "nested-another", valueOriginal: "nested-another" }
      ]);
    });

    test("it converts a file path to an array of class names with param as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.less`, {
        nameFormat: "param"
      });

      expect(result).toEqual([
        { value: "some-styles", valueOriginal: "some-styles" },
        { value: "nested-class", valueOriginal: "nested-class" },
        { value: "nested-another", valueOriginal: "nested-another" }
      ]);
    });

    test("it converts a file path to an array of class names where only classes with dashes in the names are altered", async () => {
      const result = await fileToClassNames(`${__dirname}/../dashes.less`, {
        nameFormat: "dashes"
      });

      expect(result).toEqual([
        { value: "App", valueOriginal: "App" },
        { value: "Logo", valueOriginal: "Logo" },
        { value: "appHeader", valueOriginal: "App-Header" }
      ]);
    });

    test("it does not change class names when nameFormat is set to none", async () => {
      const result = await fileToClassNames(`${__dirname}/../dashes.less`, {
        nameFormat: "none"
      });

      expect(result).toEqual([
        { value: "App", valueOriginal: "App" },
        { value: "Logo", valueOriginal: "Logo" },
        { value: "App-Header", valueOriginal: "App-Header" }
      ]);
    });
  });

  describe.skip("aliases", () => {
    test("it converts a file that contains aliases", async () => {
      const result = await fileToClassNames(`${__dirname}/../aliases.less`, {
        aliases: {
          "~fancy-import": "complex",
          "~another": "style"
        }
      });

      expect(result).toEqual([
        "someStyles",
        "nestedClass",
        "nestedAnother",
        "someClass",
        "myCustomClass"
      ]);
    });
  });

  describe.skip("aliasPrefixes", () => {
    test("it converts a file that contains alias prefixes (but prioritizes aliases)", async () => {
      const result = await fileToClassNames(
        `${__dirname}/../alias-prefixes.less`,
        {
          aliases: {
            "~fancy-import": "complex"
          },
          aliasPrefixes: {
            "~": "nested-styles/"
          }
        }
      );

      expect(result).toEqual([
        "someStyles",
        "nestedClass",
        "nestedAnother",
        "nestedStyles",
        "myCustomClass"
      ]);
    });
  });
});
