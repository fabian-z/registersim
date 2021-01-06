import { parse } from './parser/parser.js';
import { RegisterMachine } from './register.js';

let reg = new RegisterMachine(); // actual register machine instance used
let executed = []; // contains executed instructions
let steps = []; // contains register contents after execution
let outputStep = -1;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("execute").addEventListener("click", function() {
        // Reset register machine and history
        reg.reset();
        executed = [];
        steps = [];
        outputStep = -1;

        // Reset output
        removeOutputRows();
        document.getElementById("output-step").innerText = "";
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

        let executionLog = document.getElementById("execution-log");
        let instructionCallback = function(instruction) {
            let prefix = "";
            if (instruction.action !== "loopUntilZero") {
                executed.push(instruction);
                steps.push([...reg.registers.entries()]);
                prefix = `(${executed.length}) `;
            }

            executionLog.innerText += prefix + `${instructionToText(instruction)}\n`;
            executionLog.scrollTop = executionLog.scrollHeight;
        };

        try {
            let ast = parse(source);
            reg.processInstructions(ast, instructionCallback);
        } catch (e) {
            let errorMsg;
            if (e.name === "SyntaxError") {
                errorMsg = `Syntax error on line ${e.location.start.line}, column ${e.location.start.column}: ${e.message}`;
            } else {
                errorMsg = "Unexpected error: " + e.message;
            }
            executionLog.innerText = errorMsg;
            console.log(e);
            return;
        }

        // extract and sort results
        let registers = [...reg.registers.entries()].sort((a, b) => a[0] - b[0]);

        // execution log final padding
        executionLog.innerText += "\n";
        executionLog.scrollTop = executionLog.scrollHeight;

        // show results in DOM
        outputStep = steps.length;
        document.getElementById("output-step").innerText = outputStep;
        renderRegisterValues(registers);
    });

    document.getElementById("add-register").addEventListener("click", function() {
        let input = document.getElementById("input-table");

        let registers = input.querySelectorAll(".input-register");
        let newRegister = parseInt(registers[registers.length-1].value) + 1;

        let inputRow = document.createElement("tr");
        inputRow.className = "input-row";
        inputRow.innerHTML = `<td><input class="input-register" type="number" min="0" step="1" value="${newRegister}"></td>
        <td><input class="input-value" type="number" min="0" step="1" value="0"></td>`;

        input.append(inputRow);
    });

    document.getElementById("remove-register").addEventListener("click", function() {
        let inputRows = document.querySelectorAll(".input-row");
        if (inputRows.length > 1) {
            inputRows[inputRows.length - 1].remove();
        }
    });

    document.getElementById("output-prev").addEventListener("click", function() {
        showPreviousStep();
    });

    document.getElementById("output-next").addEventListener("click", function() {
      showNextStep();
    });

    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
          return;
        }

        let tagName = event.target.tagName.toLowerCase();
        if (tagName === "input" || tagName === "textarea") {
            return;
        }
      
        switch (event.key) {
          case "Left": // IE/Edge specific value
          case "ArrowLeft": {
            showPreviousStep();
            break;
          }  
          case "Right": // IE/Edge specific value
          case "ArrowRight": {
            showNextStep();
            break;
          }
          default:
            return;
        }
        event.preventDefault();
      }, true);
      
});

function showPreviousStep() {
    if (outputStep <= 1 || steps.length < 1) {
        return;
    }
    outputStep -= 1;
    let registers = steps[outputStep - 1].sort((a, b) => a[0] - b[0]);
    document.getElementById("output-step").innerText = outputStep;
    renderRegisterValues(registers);
}

function showNextStep() {
    if (outputStep < 0 || steps.length < 1) {
        return;
    }
    if (outputStep + 1 > steps.length) {
        return;
    }
    outputStep += 1;
    let registers = steps[outputStep - 1].sort((a, b) => a[0] - b[0]);
    document.getElementById("output-step").innerText = outputStep;
    renderRegisterValues(registers);
}

function removeOutputRows() {
    let outRows = document.querySelectorAll(".output-row");
    for (let row of outRows) {
        row.remove();
    }
}

function renderRegisterValues(registers) {
    removeOutputRows();
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
}

function instructionToText(instruction) {
    switch (instruction.action) {
        case "increment": {
            return `Incrementing register ${instruction.register}`;
        }
        case "decrement": {
            return `Decrementing register ${instruction.register}`;
        }
        case "loopUntilZero": {
            return `Looping ${instruction.commands.length} instruction(s) while register ${instruction.register} is not 0`;
        }
        default: {
            throw new Error("invalid instruction: " + instruction.action);
        }
    }
}