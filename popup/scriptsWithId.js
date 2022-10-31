import * as scripts from "./scripts/index.js";

// inject id to all scripts
Object.entries(scripts).forEach(([variableName, script]) => {
  script.id = variableName;
});

export const scriptsWithId = scripts;
