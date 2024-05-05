export default {
  icon: "",
  name: {
    en: "",
    vi: "",
  },
  description: {
    en: "",
    vi: "",
    img: "",
  },

  changeLogs: {
    ["2024-05-04"]: "init",
  },

  pageScript: {
    onDocumentStart: () => {
      let url = new URL(window.top.location.href);
      if (url.searchParams.has("fbclid")) {
        url.searchParams["delete"]("fbclid");
        window.top.location.replace(url);
      }
    },
  },
};
