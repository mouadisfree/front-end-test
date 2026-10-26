const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  currentEl.textContent = current;
  previousEl.textContent = previous !== null && operator ? `${previous} ${operator}` : "";
}

function inputDigit(digit) {
  if (justEvaluated || current === "0") {
    current = digit;
    justEvaluated = false;
  } else if (current !== "Error") {
    current += digit;
  } else {
    current = digit;
  }
}

function inputDecimal() {
  if (justEvaluated || current === "Error") {
    current = "0";
    justEvaluated = false;
  }
  if (!current.includes(".")) current += ".";
}

function compute(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;
  }
}

function format(n) {
  // Trim floating point noise like 0.1 + 0.2 = 0.30000000000000004
  return String(parseFloat(n.toPrecision(12)));
}

function chooseOperator(op) {
  if (current === "Error") return;
  if (operator && previous !== null && !justEvaluated) {
    evaluate();
    if (current === "Error") return;
  }
  previous = current;
  operator = op;
  justEvaluated = true;
}

function evaluate() {
  if (!operator || previous === null) return;
  const result = compute(parseFloat(previous), parseFloat(current), operator);
  current = result === null ? "Error" : format(result);
  previous = null;
  operator = null;
  justEvaluated = true;
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function deleteLast() {
  if (justEvaluated || current === "Error") return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-") current = "0";
}

function percent() {
  if (current === "Error") return;
  current = format(parseFloat(current) / 100);
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const key = e.target.closest("button");
  if (!key) return;

  const { digit, op, action } = key.dataset;
  if (digit !== undefined) inputDigit(digit);
  else if (op) chooseOperator(op);
  else if (action === "decimal") inputDecimal();
  else if (action === "equals") evaluate();
  else if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();
  else if (action === "percent") percent();

  updateDisplay();
});

document.addEventListener("keydown", (e) => {
  const opMap = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
  else if (opMap[e.key]) chooseOperator(opMap[e.key]);
  else if (e.key === ".") inputDecimal();
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); evaluate(); }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
  else return;

  updateDisplay();
});

updateDisplay();
