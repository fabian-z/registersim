import { parse, SyntaxError } from './parser/parser.js';
import { RegisterMachine } from './register.js'

let reg = new RegisterMachine();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("execute").addEventListener("click", function() {
        // Reset register machine
        reg.reset();

        // Reset output
        let outRows = document.querySelectorAll(".output-row");
        for (let row of outRows) {
            row.remove();
        }
        document.getElementById("execution-log").innerText = "";

        // set register from input
        let inRows = document.querySelectorAll(".input-row");
        for (let row of inRows) {
            let curReg = parseInt(row.querySelector(".input-register").value);
            let curVal = parseInt(row.querySelector(".input-value").value);
            reg.set(curReg, curVal);
        }

        // execute source code
        let source = document.getElementById("source").value;

        try {
            let ast = parse(source);
            reg.processInstructions(ast);
        } catch (e) {
            document.getElementById("execution-log").innerText = "Error: " + e.message;
            console.log(e);
            return;
        }

        // extract and sort results
        let registers = [...reg.registers.entries()].sort((a, b) => a[0] - b[0]);

        // show results in DOM
        let outTable = document.getElementById("output-table");
        for (let regVal of registers) {
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
    });

    document.getElementById("add-register").addEventListener("click", function() {
        let input = document.getElementById("input-table");

        let inputRow = document.createElement("tr");
        inputRow.className = "input-row";
        inputRow.innerHTML = `<td><input class="input-register" type="number" min="0" step="1" value="0"></td>
        <td><input class="input-value" type="number" min="0" step="1" value="0"></td>`;

        input.append(inputRow);
    });

    document.getElementById("remove-register").addEventListener("click", function() {
        let inputRows = document.querySelectorAll(".input-row");
        if (inputRows.length > 1) {
            inputRows[inputRows.length - 1].remove();
        }
    });
});