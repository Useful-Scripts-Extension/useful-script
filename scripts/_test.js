export default {
  icon: "",
  name: {
    en: "Test",
    vi: "Test",
  },
  description: {
    en: "",
    vi: "",
  },

  onClick: async () => {
    console.log("web: ", window.ufs_rvdfm_all_msgs);
  },
  onClickExtension: () => {
    console.log("extension: " + JSON.stringify(localStorage));
  },
  onClickContentScript: () => {
    console.log("content script: ", window.top.ufs_rvdfm_all_msgs);
    console.log("content script: ", UsefulScriptGlobalPageContext);
  },
};
