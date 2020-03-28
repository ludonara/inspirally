import React, { useState, useEffect } from "react";
import "./App.scss";
import Settings from "./components/Settings";
import Suggestion from "./components/Suggestion";
import data from "./data/fr";

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

const loadFromLocalStorage = (key, defaultValue) =>
  JSON.parse(localStorage.getItem(key)) || defaultValue;

const userLanguage = (
  navigator.language ||
  navigator.userLanguage ||
  "en-EN"
).split("-")[0];

const appLanguage = ACCEPTED_LANGUAGE.includes(userLanguage)
  ? userLanguage
  : "fr";

const reHydratedState = {
  selectedCategories: loadFromLocalStorage("selectedCategories", []),
  persistedData: loadFromLocalStorage("filteredData"),
  selected: loadFromLocalStorage("selected"),
  played: loadFromLocalStorage("played", []),
};

function App() {
  // store last 20 words played
  const [played, setPlayed] = useState(reHydratedState.played);
  const [filteredData, setFilteredData] = useState(
    reHydratedState.persistedData || data[appLanguage]
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

  const categories = data[appLanguage]
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
        ? data[appLanguage].filter((item) =>
            newSelectedCategories.includes(item.c)
          )
        : data[appLanguage];
    setFilteredData(filteredData);
  };

  return (
    <div className="App">
      <Suggestion
        selected={selected}
        next={next}
        nextLabel={TRANSLATION[appLanguage].next}
        startLabel={TRANSLATION[appLanguage].start}
        onboardingTitle={TRANSLATION[appLanguage].onboardingTitle}
        onboardingSubtitle={TRANSLATION[appLanguage].onboardingSubtitle}
      />
      <Settings
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        themesLabel={TRANSLATION[appLanguage].themes}
      />
    </div>
  );
}

export default App;
