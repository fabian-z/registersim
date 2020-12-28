import { parse, SyntaxError } from './parser/parser.js';
import { RegisterMachine } from './register.js'

// addition of registers 0 & 1 -> register 2
// (s0 a2 a3 )0 (s3 a0 )3 (s1 a2 a3 )1 (s3 a1 )3
let ast;
try {
    ast = parse("(s0 a2 a3 )0 (s3 a0 )3 (s1 a2 a3 )1 (s3 a1 )3");
} catch (e) {
    console.log(e.message);
    process.exit(1);
}

let reg = new RegisterMachine();

reg.set(0, 10);
reg.set(1, 5);
reg.processInstructions(ast, console.log);

console.log(reg.registers.entries());