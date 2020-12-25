import { parse, SyntaxError } from './parser/parser.js';

let err;
try {
err = parse("a2 (s1)1");
} catch (e) {
console.log(e.message);
}
