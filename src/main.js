import { parse, SyntaxError } from './parser/parser.js';
import { RegisterMachine } from './register.js'

let reg = new RegisterMachine();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("execute").addEventListener("click", function() {
        // execute source code
        let source = document.getElementById("source").value;
        // set register from input
        reg.reset();
        reg.set(0, 5);
        reg.set(1, 10);
        try {
            let ast = parse(source);
            reg.processInstructions(ast);
        } catch (e) {
            console.log(e);
        }

        let outTable = document.getElementById("output-table");
        let outRows = document.querySelectorAll(".output-row");
        for (let row of outRows) {
            row.remove();
        }

        for (let regVal of reg.registers) {
            let register = regVal[0];
            let value = regVal[1];

            let outerRow = document.createElement("tr");
            outerRow.className = "output-row";

            let firstCol = document.createElement("td");
            firstCol.innerText = register;

            let secondCol = document.createElement("td");
            secondCol.innerText = value;

            outerRow.append(firstCol);
            outerRow.append(secondCol);
            outTable.append(outerRow);
        }

        console.log(reg.registers.entries());
    });
});