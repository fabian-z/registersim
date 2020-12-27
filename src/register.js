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