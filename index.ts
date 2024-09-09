import * as ts from "typescript";
import * as fs from "node:fs";

const codes = [] as ts.SourceFile[];

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
x.

let y = x();
`,
    "main.js",
);

// stdlib
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

code(
    fs.readFileSync(require.resolve("typescript/lib/lib.es5.d.ts"), "utf-8"),
    "lib.es5.d.ts",
);
code(
    fs.readFileSync(
        require.resolve("typescript/lib/lib.es2015.core.d.ts"),
        "utf-8",
    ),
    "lib.es2015.core.d.ts",
);
code(
    fs.readFileSync(
        require.resolve("typescript/lib/lib.es2019.array.d.ts"),
        "utf-8",
    ),
    "lib.es2019.array.d.ts",
);

// sup lib .d.ts (will be pulled in from the MAP service)
code(fs.readFileSync("./sup.d.ts", "utf-8"), "sup.d.ts");

// Create a program and include the source file
const host = {
    getSourceFile: (fileName: string) =>
        codes.find((c) => c.fileName === fileName),
    writeFile: () => {},
    getDefaultLibFileName: () => "lib.d.ts",
    getCurrentDirectory: () => "",
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
    fileExists: (fileName: string) =>
        codes.some((c) => c.fileName === fileName),
    readFile: () => undefined,
    directoryExists: () => true,
    getDirectories: () => [],
};
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
    host,
});

// Now perform the analysis and handle errors
const syntacticDiagnostics = program.getSyntacticDiagnostics(main);
const semanticDiagnostics = program.getSemanticDiagnostics(main);

const diagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];

console.log(`---\n${main.text.trim()}\n---`);
console.error(ts.formatDiagnostics(diagnostics, host));

// Create a language service to get completions
const languageService = ts.createLanguageService(
    {
        getScriptFileNames: () => codes.map((c) => c.fileName),
        getScriptVersion: () => "1",
        getScriptSnapshot: (fileName) => {
            const code = codes.find((c) => c.fileName === fileName);
            if (code) {
                return ts.ScriptSnapshot.fromString(code.getFullText());
            }
            return undefined;
        },
        getCurrentDirectory: () => "",
        getCompilationSettings: () => program.getCompilerOptions(),
        getDefaultLibFileName: (options) => ts.getDefaultLibFileName(options),
        readFile: () => undefined,
        fileExists: (fileName) => codes.some((c) => c.fileName === fileName),
    },
    ts.createDocumentRegistry(),
);

// Find the position of "x."
const position = main.getText().lastIndexOf("x.") + 2;

// Get completions at the position of "x."
const completions = languageService.getCompletionsAtPosition(
    "main.js",
    position,
    {},
);

if (completions && completions.entries.length > 0) {
    const typeChecker = program.getTypeChecker();

    completions.entries.forEach((entry) => {
        if (
            entry.kind === ts.ScriptElementKind.functionElement ||
            entry.kind === ts.ScriptElementKind.memberFunctionElement
        ) {
            const details = languageService.getCompletionEntryDetails(
                "main.js",
                position,
                entry.name,
                undefined,
                undefined,
                undefined,
                undefined,
            );

            if (details) {
                console.log(`Function: ${entry.name}`);
                const sourceFile = program.getSourceFile("main.js");

                if (details.documentation) {
                    console.log(
                        `Documentation: ${ts.displayPartsToString(details.documentation)}`,
                    );
                } else {
                    console.log("No documentation found.");
                }

                if (details.tags) {
                    for (const tag of details.tags) {
                        console.log(`Tag`, tag);
                    }
                } else {
                    console.log("No tags found.");
                }
            }
        }
    });
} else {
    console.log("No completions found.");
}
