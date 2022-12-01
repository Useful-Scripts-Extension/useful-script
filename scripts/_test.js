import { runScriptInCurrentTab } from "./helpers/utils.js";

export default {
  icon: "",
  name: {
    en: "Test script",
    vi: "Test script",
  },
  description: {
    en: "",
    vi: "",
  },
  runInExtensionContext: true,

  func: async function () {
    let dtsg = await runScriptInCurrentTab(() => {
      return require("DTSGInitialData").token;
    });
    alert(dtsg);
  },
};
