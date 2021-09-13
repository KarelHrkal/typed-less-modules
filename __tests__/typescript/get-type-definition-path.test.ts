import { getTypeDefinitionPath } from "../../lib/typescript";

describe("getTypeDefinitionPath", () => {
  it("returns the type definition path", () => {
    const path = getTypeDefinitionPath("/some/path/style.less", "default");

    expect(path).toEqual("/some/path/style.less.d.ts");
  });
});
