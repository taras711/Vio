import { Project } from "ts-morph";
import fs from "fs";
import path from "path";

const project = new Project({
  tsConfigFilePath: "tsconfig.json"
});

const sourceFiles = project.getSourceFiles("src/**/*.ts");

for (const file of sourceFiles) {
  const classes = file.getClasses();

  for (const cls of classes) {
    const className = cls.getName();
    const methods = cls.getMethods();

    const testFilePath = file.getFilePath().replace(".ts", ".test.ts");

    let testContent = `
import { ${className} } from "./${path.basename(file.getFilePath(), ".ts")}";

describe("${className}", () => {
  let service: ${className};

  beforeEach(() => {
    service = new ${className}({} as any);
  });
`;

    for (const method of methods) {
      const methodName = method.getName();

      testContent += `
  it("should test ${methodName}", async () => {
    // TODO: auto-generated test
    const result = await service.${methodName}();
    expect(result).toBeDefined();
  });
`;
    }

    testContent += `});`;

    fs.writeFileSync(testFilePath, testContent);
  }
}
