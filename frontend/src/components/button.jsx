import React from "react";
import styles from "./button.module.css";

const Button = ({
  children,
  type = "primary",
  color,
  onClick,
  className = "",
  ...rest
}) => {
  const baseClass = `btn ${type} ${className}`;

  const style = color
    ? {
        backgroundColor: color,
        borderColor: color,
        color: type === "tertiary" ? color : "#fff"
      }
    : {};

  return (
    <button className={styles.baseClass} style={style} onClick={onClick} {...rest}>
      <span className="truncate-text">{children}</span>
    </button>
  );
};

export default Button;
