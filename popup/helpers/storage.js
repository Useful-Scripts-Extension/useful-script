const createVariableSaver = (key, defaultValue = null) => ({
  set: (data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  get: (_defaultValue) => {
    return (
      JSON.parse(localStorage.getItem(key) || "null") ??
      _defaultValue ??
      defaultValue
    );
  },
});

export const themeSaver = createVariableSaver("useful-scripts-theme");
export const langSaver = createVariableSaver("useful-scripts-lang");
export const activeTabIdSaver = createVariableSaver(
  "useful-scripts-activeTabId"
);

// default is false => enabled; true => disabled
export const disableSmoothScrollSaver = createVariableSaver(
  "useful-scripts-disable-smoothScroll"
);
