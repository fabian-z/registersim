import { parse, SyntaxError } from './parser/parser.js';
import { RegisterMachine } from './register.js'

// addition of registers 0 & 1 -> register 2
// (s0 a2 a3 )0 (s3 a0 )3 (s1 a2 a3 )1 (s3 a1 )3
let ast;
try {
    ast = parse("(s0)0");
} catch (e) {
    console.log(e.message);
    process.exit(1);
}

let reg = new RegisterMachine();

reg.set(0, 10);
reg.set(1, 5);

let processFunction = function(ast) {
    for (let command of ast) {
        console.log(command);
        switch (command.action) {
            case "increment": {
                reg.increment(command.register);
                break;
            }
            case "decrement": {
                reg.decrement(command.register);
                break;
            }
            case "loopUntilZero": {
                while (reg.get(command.register) != 0) {
                    processFunction(command.commands);
                }
                break;
            }
            default:
                throw new Error("invalid command parsed");
        }
    }
}
processFunction(ast);

console.log(reg.registers.entries());