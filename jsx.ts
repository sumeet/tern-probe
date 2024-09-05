import * as ts from "typescript";

const code = `
  const element = <sup.html>
    {1 && <div class="hi">hi</div>}
    {2 && <div class="hi">hi</div>}
  </sup.html>;
  
  const el2 = <div>hi</div>;
  
  const el3 = <>hi</>;
`;

const result = ts.transpileModule(code, {
    compilerOptions: {
        jsx: ts.JsxEmit.React,
        jsxFactory: "jsxFactory",
        jsxFragmentFactory: "jsxFragmentFactory",
        target: ts.ScriptTarget.ESNext,
    },
});

console.log(result.outputText);
