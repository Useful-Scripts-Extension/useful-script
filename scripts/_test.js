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
    try {
      let abc = getEventListeners(
        document.querySelector("#wheelCanvas")
      ).click[0].listener.toString();
      console.log(abc);
    } catch (e) {
      console.error(e);
    }
  },
};
