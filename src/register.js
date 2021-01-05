export class RegisterMachine {
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
            throw new Error(`invalid set - register ${reg} negative`);
        }
        this.registers.set(reg, val);
    }

    reset() {
        this.registers.clear();
    }

    increment(reg) {
        this.registers.set(reg, this.get(reg) + 1);
    }

    decrement(reg) {
        let res = this.get(reg) - 1;
        if (res < 0) {
            res = 0;
        }
        this.registers.set(reg, res);
    }

    length() {
        return this.registers.size();
    }

    processInstructions(ast, instructionCallback) {
        // Setup callback if requested, noop otherwise
        // instructionCallback is executed after commands and before
        // entering loops
        let callback = noop;
        if (instructionCallback) {
            callback = instructionCallback;
        }

        // Process commands
        for (let command of ast) {
            switch (command.action) {
                case "increment": {
                    this.increment(command.register);
                    callback(command);
                    break;
                }
                case "decrement": {
                    this.decrement(command.register);
                    callback(command);
                    break;
                }
                case "loopUntilZero": {
                    callback(command);
                    while (this.get(command.register) !== 0) {
                        this.processInstructions(command.commands, instructionCallback);
                    }
                    break;
                }
                default:
                    throw new Error("invalid command parsed");
            }
        }
    }
}

function noop() {}