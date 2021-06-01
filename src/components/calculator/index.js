import React, { useState, useEffect } from "react";
import Button from "./button";
import "./calculator.css";
const buttons = [
  { value: "CE", type: "button" },
  { value: "C", type: "button" },
  { value: "(", type: "button" },
  { value: ")", type: "button" },
  { value: "/", type: "operator" },
  { value: "sin", type: "button" },
  { value: "7", type: "number" },
  { value: "8", type: "number" },
  { value: "9", type: "number" },
  { value: "X", type: "operator" },
  { value: "cos", type: "button" },
  { value: "4", type: "number" },
  { value: "5", type: "number" },
  { value: "6", type: "number" },
  { value: "-", type: "operator" },
  { value: "tan", type: "button" },
  { value: "1", type: "number" },
  { value: "2", type: "number" },
  { value: "3", type: "number" },
  { value: "+", type: "operator" },
  { value: "<-", type: "button" },
  { value: "0", type: "number", isLarge: true },
  { value: "=", type: "operator" },
];
function Calculator() {
  const [result, setResult] = useState("0");
  const [expressionArr, setExpressionArr] = useState([]);
  const [showExpression, setShowExpression] = useState("");
  console.log(expressionArr);
  useEffect(() => {
    let str = getAllInputValues().join(" ");
    setShowExpression(str);
  }, [expressionArr]);
  const resultHandler = (event) => {
    setResult(event.target.value);
  };
  const buttonHandler = (event, type) => {
    if (event.target.value === "C") {
      clearCurrentValue();
      return;
    }
    if (event.target.value === "CE") {
      clearAllHistory();
      return;
    }
    if (event.target.value === "<-") {
      backSpace();
      return;
    }
    if (type === "number") {
      insertNumber(event.target.value);
      return;
    }
    if (type === "operator") {
      if(event.target.value === '='){
        generateResult();
        return;
      }
      insertOperation(event.target.value);
      return;
    }
  };

  const clearAllHistory = () => {
    
  };
  const backSpace = () => {
    if (getLastInputType() === "number") {
      if (getLastInputValue().length > 1) {
        editLastInput(getLastInputValue().slice(0, -1), "number");
        return;
      } else {
        deleteLastInput();
        return;
      }
    }
    if (getLastInputType() === "operator") {
      deleteLastInput();
    }
  };
  const insertNumber = (value) => {
    if (getLastInputType() === "number") {
      appendToLastInput(value);
    } else if (
      getLastInputType() === "operator" ||
      getLastInputType() === null
    ) {
      addNewInput(value, "number");
    }
  };
  const insertOperation = (value) => {
    switch (getLastInputType()) {
      case "number":
        addNewInput(value,"operator")
        break;
      case "operator":
        editLastInput(value,"operator");
        break;
      case "equals":
        let output = getOutputValue();
        clearAllHistory();
        addNewInput(output,"number");
        addNewInput(value,"operator");
        break;
      default:
        return;
    }
  };
  const generateResult = () => {
    if(getLastInputType() === 'number'){
      const simplifyExpression = (currentExpression,operator) => { 
        if(currentExpression.indexOf(operator) < 0){
          return currentExpression;
        } else {
          let operatorIndex = currentExpression.indexOf(operator);
          let leftOperatorIndex = operatorIndex - 1;
          let rightOperatorIndex = operatorIndex + 1;
          let partialSol = performOperation(...currentExpression.slice(leftOperatorIndex,rightOperatorIndex+1));
          currentExpression.splice(leftOperatorIndex,3,partialSol.toString());
          return simplifyExpression(currentExpression,operator)
        }
      }
      let result = ["X","+","-","/"].reduce(simplifyExpression,getAllInputValues());
      addNewInput("=","equals");
      updateOutputDisplay(result);
    }
  };
  const clearCurrentValue = () => {
    setExpressionArr([]);
    setResult("0");
  };

  const getAllInputValues = () => {
    return expressionArr.map((item) => item.value);
  };
  const getLastInputType = () => {
    return expressionArr.length === 0 ? null : expressionArr[expressionArr.length - 1].type;
  };
  const getLastInputValue = () => {
    return expressionArr.length === 0 ? null : expressionArr[expressionArr.length - 1].value;
  };
  const getOutputValue = () => {
    return result;
  };
  const appendToLastInput = (value) => {
    let newArr = [...expressionArr];
    newArr[newArr.length - 1].value += value;
    setExpressionArr(newArr);
  };

  const addNewInput = (value, type) => {
    setExpressionArr((prev) => [...prev, { value: value, type: type }]);
  };

  const editLastInput = (value, type) => {
    let newArr = [...expressionArr];
    newArr.pop();
    setExpressionArr(newArr);
    addNewInput(value,type);
  };

  const deleteLastInput = () => {
    let newArr = [...expressionArr];
    newArr.pop();
    setExpressionArr(newArr);
  };

  const updateOutputDisplay = (value) => {
    setResult(value);
  }

  const performOperation = (leftValue,operation,rightValue) => {
    leftValue = parseFloat(leftValue);
    rightValue = parseFloat(rightValue);
    if(Number.isNaN(leftValue) || Number.isNaN(rightValue)){
      return;
    }
    switch (operation) {
      case "X":
        return leftValue*rightValue;
      case "+":
        return leftValue+rightValue;
      case "/":
        return leftValue/rightValue;
      case "-":
        return leftValue-rightValue;
      default:
        return;
    }
  }

  return (
    <div className="calc_container">
      <div className="calc_screen">
        <span>{showExpression}</span>
        <input
          value={result}
          type="text"
          name="result"
          onChange={resultHandler}
          disabled
        />
      </div>
      <div className="calc_buttons">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            value={btn?.value}
            type={btn?.type}
            onChange={buttonHandler}
          />
        ))}
      </div>
    </div>
  );
}

export default Calculator;
