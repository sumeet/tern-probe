import * as ts from "typescript";

const codes = [];

function code(code: string, filename: string) {
  const sourceFile = ts.createSourceFile(
    filename,
    code,
    ts.ScriptTarget.ESNext,
    true,
  );
  codes.push(sourceFile);
  return sourceFile;
}

const main = code(
  `\
let x = [1, 2, 3];
console.log(x.map(n => n * 2));
`,
  "main.js",
);

code(
  `\
declare var console: {
  log: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
  // Add other console methods as needed
};
  `,
  "console.d.ts",
);

// Create a program and include the source file
const program = ts.createProgram({
  rootNames: codes.map((c) => c.fileName), // The root file names (in memory)
  options: {
    allowJs: true,
    checkJs: true,
    noEmit: true,
    strict: false, // Disables all strict rules
    noImplicitAny: false, // Explicitly disable `noImplicitAny`
    strictNullChecks: false,
    strictFunctionTypes: false,
    strictPropertyInitialization: false,
    alwaysStrict: false,
    noImplicitThis: false,
    noUnusedParameters: false,
    noUnusedLocals: false,
    noImplicitReturns: false,
    noFallthroughCasesInSwitch: false,
  },
  host: {
    getSourceFile: (fileName: string) => {
      return codes.find((c) => c.fileName === fileName);
    },
    writeFile: () => {},
    getDefaultLibFileName: () => "lib.d.ts",
    getCurrentDirectory: () => "",
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
    fileExists: (fileName: string) => {
      return codes.some((c) => c.fileName === fileName);
    },
    readFile: () => undefined,
    directoryExists: () => true,
    getDirectories: () => [],
  },
});

// Now perform the analysis and handle errors
const syntacticDiagnostics = program.getSyntacticDiagnostics(main);
const semanticDiagnostics = program.getSemanticDiagnostics(main);

const diagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];

if (diagnostics.length > 0) {
  diagnostics.forEach((diag) => {
    console.error(`Error: ${diag.messageText}`);
  });
} else {
  console.log("No errors found.");
}
