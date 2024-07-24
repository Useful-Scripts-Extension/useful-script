import * as allScripts from "./@index.js";

// inject id to all scripts
Object.entries(allScripts).forEach(([variableName, script]) => {
  script.id = variableName;
});

export default allScripts;
