import React from "react";

import "./DarkMode.css";
import { ReactComponent as Sun } from "../assets/Sun.svg";
import { ReactComponent as Moon } from "../assets/Moon.svg";

const DarkMode = () => {
  const setDarkTheme = () => {
    return document.querySelector("body").setAttribute("data-theme", "dark");
  };
  const setLightTheme = () => {
    return document.querySelector("body").setAttribute("data-theme", "light");
  };
  const toggleTheme = (event) => {
    event.target.checked ? setDarkTheme() : setLightTheme();
  };
  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
