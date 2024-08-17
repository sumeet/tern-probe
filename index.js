const ts = require('typescript');

// Your JavaScript code as a string
const code = `
  let x = 123;
  // TypeScript syntax example, which should cause an error
  //let x: string = "hello";
`;

// Create a virtual SourceFile from the code string
const sourceFile = ts.createSourceFile(
    'inline.js',       // File name (can be anything, just for identification)
    code,              // Code string
    ts.ScriptTarget.ESNext, // Language version
    true               // SetParentNodes: needed for a full AST
);

// Create a program and include the source file
const program = ts.createProgram({
    rootNames: ['inline.js'],  // The root file names (in memory)
    options: {
        allowJs: true,
        checkJs: true,
        noEmit: true,
        strict: true
    },
    host: {
        getSourceFile: (fileName) => (fileName === 'inline.js' ? sourceFile : undefined),
        writeFile: () => {},
        getDefaultLibFileName: () => "lib.d.ts",
        getCurrentDirectory: () => "",
        getCanonicalFileName: fileName => fileName,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => "\n",
        fileExists: (fileName) => fileName === 'inline.js',
        readFile: () => undefined,
        directoryExists: () => true,
        getDirectories: () => []
    }
});

// Now perform the analysis and handle errors
const syntacticDiagnostics = program.getSyntacticDiagnostics(sourceFile);
const semanticDiagnostics = program.getSemanticDiagnostics(sourceFile);

const diagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];

if (diagnostics.length > 0) {
    diagnostics.forEach(diag => {
        console.error(`Error: ${diag.messageText}`);
    });
} else {
    console.log("No errors found.");
}
