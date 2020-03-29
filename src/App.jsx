import React, { useState, useEffect } from "react";
import "./App.scss";
import Settings from "./components/Settings";
import Suggestion from "./components/Suggestion";
import data from "./data/suggests.json";

const ACCEPTED_LANGUAGE = ["fr", "en"];

const TRANSLATION = {
  fr: {
    next: "suivant",
    themes: "thèmes",
    start: "démarrer",
    onboardingTitle: "Dessins, mimes, devinettes ?",
    onboardingSubtitle: "À vous d'inventer les règles!",
  },
  en: {
    next: "next",
    themes: "topics",
    start: "let's go",
    onboardingTitle: "Drawings, mimes, riddles",
    onboardingSubtitle: "Invent your own rules",
  },
};

const saveInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  return item === "undefined" ? defaultValue : JSON.parse(item) || defaultValue;
};

const userLanguage = (
  navigator.language ||
  navigator.userLanguage ||
  "en-EN"
).split("-")[0];

const appLanguage = ACCEPTED_LANGUAGE.includes(userLanguage)
  ? userLanguage
  : "fr";

const reHydratedState = {
  language: loadFromLocalStorage("language", appLanguage),
  selectedCategories: loadFromLocalStorage("selectedCategories", []),
  persistedData: loadFromLocalStorage("filteredData"),
  selected: loadFromLocalStorage("selected"),
  played: loadFromLocalStorage("played", []),
};

function App() {
  // store last 20 words played
  const [language, setLanguage] = useState(reHydratedState.language);
  const [played, setPlayed] = useState(reHydratedState.played);
  const [filteredData, setFilteredData] = useState(
    reHydratedState.persistedData || data[language]
  );
  const [selected, setSelected] = useState(reHydratedState.selected);
  const [selectedCategories, setSelectedCategories] = useState(
    reHydratedState.selectedCategories
  );

  // persist state in localstorage to rehydate application
  useEffect(() => {
    return function persist() {
      saveInLocalStorage("selectedCategories", selectedCategories);
      saveInLocalStorage("filteredData", filteredData);
      saveInLocalStorage("played", played);
      saveInLocalStorage("selected", selected);
    };
  });

  const categories = data[language]
    .reduce(
      (categories, item) =>
        categories.includes(item.c) ? categories : [...categories, item.c],
      []
    )
    .sort();

  const next = () => {
    const nextData = filteredData.filter((fd) => !played.includes(fd.t));
    const randomData = nextData[Math.floor(Math.random() * nextData.length)];
    setSelected(randomData);
    setPlayed([randomData.t, ...played.slice(0, 20)]);
  };

  const toggleCategory = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((sc) => sc !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);

    const filteredData =
      newSelectedCategories.length > 0
        ? data[language].filter((item) =>
            newSelectedCategories.includes(item.c)
          )
        : data[language];
    setFilteredData(filteredData);
  };

  return (
    <div className="App">
      <Suggestion
        selected={selected}
        next={next}
        nextLabel={TRANSLATION[language].next}
        startLabel={TRANSLATION[language].start}
        onboardingTitle={TRANSLATION[language].onboardingTitle}
        onboardingSubtitle={TRANSLATION[language].onboardingSubtitle}
      />
      <Settings
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        themesLabel={TRANSLATION[language].themes}
        setLanguage={setLanguage}
      />
    </div>
  );
}

export default App;
