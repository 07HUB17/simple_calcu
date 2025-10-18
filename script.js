// script.js
// 計算機の状態（ステート）を管理する変数
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const display = document.getElementById('display');

function updateDisplay() {
    // 画面の表示を更新
    display.textContent = displayValue;
}

/**
 * F-01: 数字ボタンが押された時の処理
 */
function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

/**
 * F-05: 小数点ボタンが押された時の処理
 */
function inputDecimal() {
    if (waitingForSecondOperand === true) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
    updateDisplay();
}

/**
 * F-02, F-03: 演算子またはイコールボタンが押された時の処理
 */
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        // 連続して演算子を切り替えた場合
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        // 計算を実行
        const result = calculate(firstOperand, inputValue, operator);
        
        // 桁数が多くなりすぎないよう、小数点以下10桁に丸める
        displayValue = String(Math.round(result * 10000000000) / 10000000000);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    // イコールが押された場合は演算子をリセット (連続計算のロジックのため)
    operator = nextOperator === 'calculate' ? null : nextOperator;
    updateDisplay();
}

/**
 * 実際に計算を行うロジック
 */
function calculate(first, second, operator) {
    switch (operator) {
        case 'add': return first + second;
        case 'subtract': return first - second;
        case 'multiply': return first * second;
        case 'divide': 
            if (second === 0) {
                alert("ゼロで割ることはできません");
                resetCalculator();
                return 0;
            }
            return first / second;
        default: return second;
    }
}

/**
 * F-04: クリアボタン (C) の処理
 */
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// ====================================================================
// イベントリスナーの設定
// ====================================================================

const buttons = document.querySelector('.buttons');
buttons.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) {
        return;
    }

    const action = target.dataset.action;

    if (target.classList.contains('number')) {
        if (action === 'decimal') {
            inputDecimal();
        } else {
            inputDigit(target.textContent);
        }
        return;
    }

    if (target.classList.contains('operator') || action === 'calculate') {
        // calculate (イコール) の場合は、現在のoperatorを使って計算する
        handleOperator(action || target.dataset.action);
        return;
    }

    if (action === 'clear') {
        resetCalculator();
        return;
    }
});

// 初期表示の更新
updateDisplay();