import * as ts from "typescript";

// Your JavaScript code as a string
const code = `
let x = [1, 2, 3];
console.log(x.map(n => n * 2));
`;

// Create a virtual SourceFile from the code string
const sourceFile = ts.createSourceFile(
  'main.js',       // File name (can be anything, just for identification)
  code,            // Code string
  ts.ScriptTarget.ESNext, // Language version
  true             // SetParentNodes: needed for a full AST
);

// Create a program and include the source file
const program = ts.createProgram({
  rootNames: ['main.js'],  // The root file names (in memory)
  options: {
    allowJs: true,
    checkJs: true,
    noEmit: true,
    lib: ["esnext"], // Use the latest ESNext library
  },
  host: ts.createCompilerHost({
    allowJs: true,
    checkJs: true,
    noEmit: true,
    lib: ["esnext"],
  }),
});

// Now perform the analysis and handle errors
const syntacticDiagnostics = program.getSyntacticDiagnostics(sourceFile);
const semanticDiagnostics = program.getSemanticDiagnostics(sourceFile);

const diagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];

if (diagnostics.length > 0) {
  diagnostics.forEach((diag) => {
    console.error(`Error: ${diag.messageText}`);
  });
} else {
  console.log("No errors found.");
}