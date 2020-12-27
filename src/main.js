import { parse, SyntaxError } from './parser/parser.js';

class RegisterMachine {
    registers = new Map();

    get(reg) {
        if (!this.registers.has(reg)) {
            this.registers.set(reg, 0);
            return 0;
        }
        return this.registers.get(reg);
    }
    set(reg, val) {
        if (val < 0) {
            throw new Error(`register ${reg} negative`);
        }
        this.registers.set(reg, val);
    }
    increment(reg) {
        this.registers.set(reg, this.get(reg) + 1);
    }
    decrement(reg) {
        let res = this.get(reg) - 1;
        if (res < 0) {
            throw new Error(`register ${reg} negative`);
        }
        this.registers.set(reg, res);
    }
    length() {
        return this.registers.size();
    }
}

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