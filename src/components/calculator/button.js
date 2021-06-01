import React from "react";
import "./button.css";
function Button(props) {
  return (
    <button
      className={
        props?.type === "operator"
          ? "operator_color"
          : props?.type === "button" || props?.type === "number"
          ? `button_color ${props?.isLarge ? 'larger_width' : ''}`
          : ""
      }
      id="calc_btn"
      value={props.value}
      onClick={(event) => props.onChange(event,props.type)}
    >
      {props.value}
    </button>
  );
}

export default Button;
