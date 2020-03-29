import React, { useState } from "react";
import {
  FaGithub,
  FaTwitter,
  FaHeart,
  FaAngleUp,
  FaAngleDown,
} from "react-icons/fa";
import "./Settings.scss";

export default function Settings(props) {
  const [closed, setClosed] = useState(false);

  return (
    <div
      className={`settings__panel ${closed ? "settings__panel--closed" : ""}`}
    >
      <div className="settings__toggle" onClick={() => setClosed(!closed)}>
        {closed ? <FaAngleUp /> : <FaAngleDown />}
        <div>{props.themesLabel}</div>
      </div>
      <div className="categories">
        {props.categories.map((c) => (
          <div
            key={c}
            onClick={() => props.toggleCategory(c)}
            className={`category ${
              props.selectedCategories.indexOf(c) > -1
                ? "category--selected"
                : ""
            }`}
          >
            {c}
          </div>
        ))}
      </div>
      <div className="bottom">
        <div className="languages">
          <button onClick={() => props.setLanguage("fr")}>FR</button> |{" "}
          <button onClick={() => props.setLanguage("en")}>EN</button>
        </div>
        <div className="credits">
          <div>
            Made with <FaHeart /> by{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://twitter.com/ludonara"
            >
              ludonara <FaTwitter />
            </a>
            {" | "}
            <a
              href="https://github.com/ludonara/inspirally"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaGithub />
            </a>
            - version {props.version}
          </div>
        </div>
      </div>
    </div>
  );
}
