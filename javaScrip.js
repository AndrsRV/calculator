function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) return 'ERR: ÷ by 0 🙃';
  return a / b;
}

function operate(operator, a, b) {
  switch (operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '×': return multiply(a, b);
    case '÷': return divide(a, b);
  }
}

function round(n) {
  return parseFloat(n.toFixed(10));
}

let firstNum = null;
let operator = null;
let currentInput = '0';
let justEvaluated = false;

const display = document.getElementById('current');
const expression = document.getElementById('expression');

function updateDisplay() {
  display.textContent = currentInput;
}

function handleDigit(digit) {
  if (justEvaluated) {
    currentInput = digit;
    justEvaluated = false;
  } else {
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }
  updateDisplay();
}

function handleDecimal() {
  if (justEvaluated) {
    currentInput = '0.';
    justEvaluated = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
  updateDecimalButton();
}

function updateDecimalButton() {
  document.getElementById('decimal').disabled = currentInput.includes('.');
}

function handleOperator(op) {
  const num = parseFloat(currentInput);

  if (firstNum !== null && !justEvaluated) {
    const result = operate(operator, firstNum, num);
    if (typeof result === 'string') {
      expression.textContent = '';
      currentInput = result;
      firstNum = null;
      operator = null;
      updateDisplay();
      return;
    }
    firstNum = round(result);
    currentInput = String(firstNum);
    updateDisplay();
  } else {
    firstNum = num;
  }

  justEvaluated = false;
  operator = op;
  expression.textContent = `${firstNum} ${op}`;
  currentInput = '0';
  updateDecimalButton();
}

function handleEquals() {
  if (firstNum === null || operator === null) return;

  const num = parseFloat(currentInput);
  const result = operate(operator, firstNum, num);

  if (typeof result === 'string') {
    expression.textContent = '';
    currentInput = result;
    firstNum = null;
    operator = null;
    updateDisplay();
    return;
  }

  expression.textContent = `${firstNum} ${operator} ${num} =`;
  firstNum = null;
  operator = null;
  currentInput = String(round(result));
  justEvaluated = true;
  updateDisplay();
  updateDecimalButton();
}

function handleClear() {
  firstNum = null;
  operator = null;
  currentInput = '0';
  justEvaluated = false;
  expression.textContent = '';
  updateDisplay();
  updateDecimalButton();
}

function handleBackspace() {
  if (justEvaluated) return;
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
  updateDecimalButton();
}

document.querySelectorAll('.digit').forEach(btn => {
  btn.addEventListener('click', () => handleDigit(btn.dataset.digit));
});

document.querySelectorAll('.operator').forEach(btn => {
  btn.addEventListener('click', () => handleOperator(btn.dataset.op));
});

document.getElementById('equals').addEventListener('click', handleEquals);
document.getElementById('clear').addEventListener('click', handleClear);
document.getElementById('decimal').addEventListener('click', handleDecimal);
document.getElementById('backspace').addEventListener('click', handleBackspace);

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
  else if (e.key === '.') handleDecimal();
  else if (e.key === '+') handleOperator('+');
  else if (e.key === '-') handleOperator('-');
  else if (e.key === '*') handleOperator('×');
  else if (e.key === '/') { e.preventDefault(); handleOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') handleEquals();
  else if (e.key === 'Backspace') handleBackspace();
  else if (e.key === 'Escape') handleClear();
});
