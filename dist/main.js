/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _parser_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser/parser.js */ "./src/parser/parser.js");
/* harmony import */ var _register_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./register.js */ "./src/register.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var reg = new _register_js__WEBPACK_IMPORTED_MODULE_1__.RegisterMachine(); // actual register machine instance used

var executed = []; // contains executed instructions

var steps = []; // contains register contents after execution

var outputStep = -1;
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("execute").addEventListener("click", function () {
    // Reset register machine and history
    reg.reset();
    executed = [];
    steps = [];
    outputStep = -1; // Reset output

    removeOutputRows();
    document.getElementById("output-step").innerText = "";
    document.getElementById("execution-log").innerText = ""; // set register from input

    var inRows = document.querySelectorAll(".input-row");

    var _iterator = _createForOfIteratorHelper(inRows),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var row = _step.value;
        var curReg = parseInt(row.querySelector(".input-register").value);
        var curVal = parseInt(row.querySelector(".input-value").value);
        reg.set(curReg, curVal);
      } // execute source code

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var source = document.getElementById("source").value;
    var executionLog = document.getElementById("execution-log");

    var instructionCallback = function instructionCallback(instruction) {
      var prefix = "";

      if (instruction.action !== "loopUntilZero") {
        executed.push(instruction);
        steps.push(_toConsumableArray(reg.registers.entries()));
        prefix = "(".concat(executed.length, ") ");
      }

      executionLog.innerText += prefix + "".concat(instructionToText(instruction), "\n");
      executionLog.scrollTop = executionLog.scrollHeight;
    };

    try {
      var ast = (0,_parser_parser_js__WEBPACK_IMPORTED_MODULE_0__.parse)(source);
      reg.processInstructions(ast, instructionCallback);
    } catch (e) {
      var errorMsg;

      if (e.name === "SyntaxError") {
        errorMsg = "Syntax error on line ".concat(e.location.start.line, ", column ").concat(e.location.start.column, ": ").concat(e.message);
      } else {
        errorMsg = "Unexpected error: " + e.message;
      }

      executionLog.innerText = errorMsg;
      console.log(e);
      return;
    } // extract and sort results


    var registers = _toConsumableArray(reg.registers.entries()).sort(function (a, b) {
      return a[0] - b[0];
    }); // execution log final padding


    executionLog.innerText += "\n";
    executionLog.scrollTop = executionLog.scrollHeight; // show results in DOM

    outputStep = steps.length;
    document.getElementById("output-step").innerText = outputStep;
    renderRegisterValues(registers);
  });
  document.getElementById("add-register").addEventListener("click", function () {
    var input = document.getElementById("input-table");
    var registers = input.querySelectorAll(".input-register");
    var newRegister = parseInt(registers[registers.length - 1].value) + 1;
    var inputRow = document.createElement("tr");
    inputRow.className = "input-row";
    inputRow.innerHTML = "<td><input class=\"input-register\" type=\"number\" min=\"0\" step=\"1\" value=\"".concat(newRegister, "\"></td>\n        <td><input class=\"input-value\" type=\"number\" min=\"0\" step=\"1\" value=\"0\"></td>");
    input.append(inputRow);
  });
  document.getElementById("remove-register").addEventListener("click", function () {
    var inputRows = document.querySelectorAll(".input-row");

    if (inputRows.length > 1) {
      inputRows[inputRows.length - 1].remove();
    }
  });
  document.getElementById("output-prev").addEventListener("click", function () {
    showPreviousStep();
  });
  document.getElementById("output-next").addEventListener("click", function () {
    showNextStep();
  });
  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return;
    }

    var tagName = event.target.tagName.toLowerCase();

    if (tagName === "input" || tagName === "textarea") {
      return;
    }

    switch (event.key) {
      case "Left": // IE/Edge specific value

      case "ArrowLeft":
        {
          showPreviousStep();
          break;
        }

      case "Right": // IE/Edge specific value

      case "ArrowRight":
        {
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
  var registers = steps[outputStep - 1].sort(function (a, b) {
    return a[0] - b[0];
  });
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
  var registers = steps[outputStep - 1].sort(function (a, b) {
    return a[0] - b[0];
  });
  document.getElementById("output-step").innerText = outputStep;
  renderRegisterValues(registers);
}

function removeOutputRows() {
  var outRows = document.querySelectorAll(".output-row");

  var _iterator2 = _createForOfIteratorHelper(outRows),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var row = _step2.value;
      row.remove();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

function renderRegisterValues(registers) {
  removeOutputRows();
  var outTable = document.getElementById("output-table");

  var _iterator3 = _createForOfIteratorHelper(registers),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var regVal = _step3.value;
      var register = regVal[0];
      var value = regVal[1];
      var outerRow = document.createElement("tr");
      outerRow.className = "output-row";
      var firstCol = document.createElement("td");
      firstCol.innerText = register;
      var secondCol = document.createElement("td");
      secondCol.innerText = value;
      outerRow.append(firstCol);
      outerRow.append(secondCol);
      outTable.append(outerRow);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}

function instructionToText(instruction) {
  switch (instruction.action) {
    case "increment":
      {
        return "Incrementing register ".concat(instruction.register);
      }

    case "decrement":
      {
        return "Decrementing register ".concat(instruction.register);
      }

    case "loopUntilZero":
      {
        return "Looping ".concat(instruction.commands.length, " instruction(s) while register ").concat(instruction.register, " is not 0");
      }

    default:
      {
        throw new Error("invalid instruction: " + instruction.action);
      }
  }
}

/***/ }),

/***/ "./src/parser/parser.js":
/*!******************************!*\
  !*** ./src/parser/parser.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyntaxError": () => /* binding */ peg$SyntaxError,
/* harmony export */   "parse": () => /* binding */ peg$parse,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// Generated by PEG.js v0.11.0-master.f69239d, https://pegjs.org/
function peg$subclass(child, parent) {
  function C() {
    this.constructor = child;
  }

  C.prototype = parent.prototype;
  child.prototype = new C();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = "SyntaxError"; // istanbul ignore next

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function (expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function literal(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },
    "class": function _class(expectation) {
      var escapedParts = expectation.parts.map(function (part) {
        return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
      });
      return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
    },
    any: function any() {
      return "any character";
    },
    end: function end() {
      return "end of input";
    },
    other: function other(expectation) {
      return expectation.description;
    },
    not: function not(expectation) {
      return "not " + describeExpectation(expectation.expected);
    }
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function (ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return "\\x" + hex(ch);
    });
  }

  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function (ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return "\\x" + hex(ch);
    });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = expected.map(describeExpectation);
    var i, j;
    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }

      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== undefined ? options : {};
  var peg$FAILED = {};
  var peg$startRuleFunctions = {
    commandSequence: peg$parsecommandSequence
  };
  var peg$startRuleFunction = peg$parsecommandSequence;
  var peg$c0 = "(";
  var peg$c1 = ")";
  var peg$r0 = /^[aA]/;
  var peg$r1 = /^[sS]/;
  var peg$r2 = /^[0-9]/;
  var peg$r3 = /^[ \t\n\r]/;
  var peg$e0 = peg$literalExpectation("(", false);
  var peg$e1 = peg$literalExpectation(")", false);
  var peg$e2 = peg$classExpectation(["a", "A"], false, false);
  var peg$e3 = peg$classExpectation(["s", "S"], false, false);
  var peg$e4 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e5 = peg$otherExpectation("whitespace");

  var peg$f0 = function peg$f0(command) {
    return command;
  };

  var peg$f1 = function peg$f1(commands, reg) {
    return {
      action: "loopUntilZero",
      register: reg,
      commands: commands
    };
  };

  var peg$f2 = function peg$f2(reg) {
    return {
      action: "increment",
      register: reg
    };
  };

  var peg$f3 = function peg$f3(reg) {
    return {
      action: "decrement",
      register: reg
    };
  };

  var peg$f4 = function peg$f4(digits) {
    return parseInt(digits.join(""));
  };

  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{
    line: 1,
    column: 1
  }];
  var peg$expected = [];
  var peg$silentFails = 0;
  var peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return [peg$savedPos, peg$currPos];
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined ? location : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
  }

  function error(message, location) {
    location = location !== undefined ? location : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return {
      type: "literal",
      text: text,
      ignoreCase: ignoreCase
    };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return {
      type: "class",
      parts: parts,
      inverted: inverted,
      ignoreCase: ignoreCase
    };
  }

  function peg$anyExpectation() {
    return {
      type: "any"
    };
  }

  function peg$endExpectation() {
    return {
      type: "end"
    };
  }

  function peg$otherExpectation(description) {
    return {
      type: "other",
      description: description
    };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;

    if (details) {
      return details;
    } else {
      p = pos - 1;

      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  var peg$VALIDFILENAME = typeof options.filename === "string" && options.filename.length > 0;

  function peg$computeLocation(startPos, endPos) {
    var loc = {};
    if (peg$VALIDFILENAME) loc.filename = options.filename;
    var startPosDetails = peg$computePosDetails(startPos);
    loc.start = {
      offset: startPos,
      line: startPosDetails.line,
      column: startPosDetails.column
    };
    var endPosDetails = peg$computePosDetails(endPos);
    loc.end = {
      offset: endPos,
      line: endPosDetails.line,
      column: endPosDetails.column
    };
    return loc;
  }

  function peg$begin() {
    peg$expected.push({
      pos: peg$currPos,
      variants: []
    });
  }

  function peg$expect(expected) {
    var top = peg$expected[peg$expected.length - 1];

    if (peg$currPos < top.pos) {
      return;
    }

    if (peg$currPos > top.pos) {
      top.pos = peg$currPos;
      top.variants = [];
    }

    top.variants.push(expected);
  }

  function peg$end(invert) {
    var expected = peg$expected.pop();
    var top = peg$expected[peg$expected.length - 1];
    var variants = expected.variants;

    if (top.pos !== expected.pos) {
      return;
    }

    if (invert) {
      variants = variants.map(function (e) {
        return e.type === "not" ? e.expected : {
          type: "not",
          expected: e
        };
      });
    }

    Array.prototype.push.apply(top.variants, variants);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
  }

  function peg$buildError() {
    var expected = peg$expected[0];
    var failPos = expected.pos;
    return peg$buildStructuredError(expected.variants, failPos < input.length ? input.charAt(failPos) : null, failPos < input.length ? peg$computeLocation(failPos, failPos + 1) : peg$computeLocation(failPos, failPos));
  }

  function peg$parsecommandSequence() {
    var s0, s1;

    var rule$expects = function rule$expects(expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    };

    s0 = [];
    s1 = peg$parsecommand();

    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parsecommand();
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecommand() {
    var s0, s1, s2, s3;

    var rule$expects = function rule$expects(expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    };

    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = peg$parsedecrementLoop();

    if (s2 === peg$FAILED) {
      s2 = peg$parseincrementCommand();

      if (s2 === peg$FAILED) {
        s2 = peg$parsedecrementCommand();
      }
    }

    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      peg$savedPos = s0;
      s0 = peg$f0(s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedecrementLoop() {
    var s0, s1, s2, s3, s4, s5, s6;

    var rule$expects = function rule$expects(expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    };

    s0 = peg$currPos;
    rule$expects(peg$e0);

    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c0;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
    }

    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parsecommandSequence();

      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        rule$expects(peg$e1);

        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
        }

        if (s5 !== peg$FAILED) {
          s6 = peg$parseinteger();

          if (s6 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f1(s3, s6);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseincrementCommand() {
    var s0, s1, s2;

    var rule$expects = function rule$expects(expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    };

    s0 = peg$currPos;
    rule$expects(peg$e2);

    if (peg$r0.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
    }

    if (s1 !== peg$FAILED) {
      s2 = peg$parseinteger();

      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f2(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedecrementCommand() {
    var s0, s1, s2;

    var rule$expects = function rule$expects(expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    };

    s0 = peg$currPos;
    rule$expects(peg$e3);

    if (peg$r1.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
    }

    if (s1 !== peg$FAILED) {
      s2 = peg$parseinteger();

      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f3(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseinteger() {
    var s0, s1, s2;

    var rule$expects = function rule$expects(expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    };

    s0 = peg$currPos;
    s1 = [];
    rule$expects(peg$e4);

    if (peg$r2.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
    }

    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        rule$expects(peg$e4);

        if (peg$r2.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
        }
      }
    } else {
      s1 = peg$FAILED;
    }

    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f4(s1);
    }

    s0 = s1;
    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    var rule$expects = function rule$expects(expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    };

    rule$expects(peg$e5);
    peg$silentFails++;
    s0 = [];

    if (peg$r3.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
    }

    while (s1 !== peg$FAILED) {
      s0.push(s1);

      if (peg$r3.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
      }
    }

    peg$silentFails--;
    return s0;
  }

  peg$begin();
  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$expect(peg$endExpectation());
    }

    throw peg$buildError();
  }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
});

/***/ }),

/***/ "./src/register.js":
/*!*************************!*\
  !*** ./src/register.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegisterMachine": () => /* binding */ RegisterMachine
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RegisterMachine = /*#__PURE__*/function () {
  function RegisterMachine() {
    _classCallCheck(this, RegisterMachine);

    _defineProperty(this, "registers", new Map());
  }

  _createClass(RegisterMachine, [{
    key: "get",
    value: function get(reg) {
      if (!this.registers.has(reg)) {
        this.registers.set(reg, 0);
        return 0;
      }

      return this.registers.get(reg);
    }
  }, {
    key: "set",
    value: function set(reg, val) {
      if (val < 0) {
        throw new Error("invalid set - register ".concat(reg, " negative"));
      }

      this.registers.set(reg, val);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.registers.clear();
    }
  }, {
    key: "increment",
    value: function increment(reg) {
      this.registers.set(reg, this.get(reg) + 1);
    }
  }, {
    key: "decrement",
    value: function decrement(reg) {
      var res = this.get(reg) - 1;

      if (res < 0) {
        res = 0;
      }

      this.registers.set(reg, res);
    }
  }, {
    key: "length",
    value: function length() {
      return this.registers.size();
    }
  }, {
    key: "processInstructions",
    value: function processInstructions(ast, instructionCallback) {
      // Setup callback if requested, noop otherwise
      // instructionCallback is executed after commands and before
      // entering loops
      var callback = noop;

      if (instructionCallback) {
        callback = instructionCallback;
      } // Process commands


      var _iterator = _createForOfIteratorHelper(ast),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var command = _step.value;

          switch (command.action) {
            case "increment":
              {
                this.increment(command.register);
                callback(command);
                break;
              }

            case "decrement":
              {
                this.decrement(command.register);
                callback(command);
                break;
              }

            case "loopUntilZero":
              {
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
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return RegisterMachine;
}();

function noop() {}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/main.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=main.js.map