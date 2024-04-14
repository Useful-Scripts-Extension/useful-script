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

  onDocumentStart: async () => {
    function blobToDataURL(blob, cb) {
      var a = new FileReader();
      a.readAsDataURL(blob);
      a.onload = function (e) {
        cb(e.target.result);
      };
      a.onerror = function (e) {
        cb(null);
      };
    }

    window.blobUrlMap = new Map();
    const createObjectURLProxy = new Proxy(window.URL.createObjectURL, {
      apply: function (target, thisArg, argumentsList) {
        const blob = argumentsList[0];
        const blobUrl = target.apply(thisArg, argumentsList);
        window.blobUrlMap.set(blobUrl, blob);
        console.log(blobUrl, blob);
        blobToDataURL(blob, (dataUrl) => {
          console.log(dataUrl);
        });
        return blobUrl;
      },
    });
    window.URL.createObjectURL = createObjectURLProxy;
  },
};
