const fs = require("fs");

const ACCEPTED_LANGUAGE = ["fr", "en"];

const root = "src/data/raw";

const data = {};
ACCEPTED_LANGUAGE.forEach(lg => {
  data[lg] = [];
  fs.readdirSync(`${root}/${lg}`).forEach(file => {
    data[lg] = [
      ...data[lg],
      ...JSON.parse(fs.readFileSync(`${root}/${lg}/${file}`, "utf-8"))
    ];
  });
});

fs.writeFileSync("src/data/suggests.json", JSON.stringify(data));
