import { parse, SyntaxError } from './parser/parser.js';

let ast;
try {
ast = parse("a2 (s1 a3)1 a5");
} catch (e) {
console.log(e.message);
}
console.log(ast);
