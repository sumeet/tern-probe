import * as ts from 'typescript';

function customJsxTransformer(context: ts.TransformationContext) {
  return (rootNode: ts.SourceFile) => {
    function visit(node: ts.Node): ts.Node {
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tagName = node.kind === ts.SyntaxKind.JsxElement 
          ? (node.openingElement.tagName as ts.Identifier).getText() 
          : (node as ts.JsxSelfClosingElement).tagName.getText();

        // Only transform if the tag name matches 'sup.html'
        if (tagName === 'sup.html') {
          const jsxAsString = node.getText().replace(/<\/?sup.html>/g, ''); // Remove the <sup.html> tags
          const callExpression = ts.factory.createCallExpression(
            ts.factory.createIdentifier("sup.html"),
            undefined,
            [ts.factory.createStringLiteral(jsxAsString)]
          );
          return callExpression;
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };
}

const code = `
  const element = <sup.html>
   function hi(asdf) {
     return 123;
   }
  </sup.html>;
`;

const result = ts.transpileModule(code, {
  compilerOptions: {
    jsx: ts.JsxEmit.Preserve, // Preserve JSX for custom processing
    target: ts.ScriptTarget.ES2015,
  },
  transformers: { before: [customJsxTransformer] }
});

console.log(result.outputText);
