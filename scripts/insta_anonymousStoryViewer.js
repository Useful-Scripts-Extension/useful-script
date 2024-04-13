export default {
  icon: '<i class="fa-solid fa-eye-slash fa-lg"></i>',
  name: {
    en: "Insta - Anonymous story viewer",
    vi: "Insta - Xem story ẩn danh",
  },
  description: {
    en: "Watch instagram stories anonymously",
    vi: "Xem story instagram không bị đối phương phát hiện",
  },
  infoLink:
    "https://greasyfork.org/en/scripts/468385-instagram-anonymous-story-viewer",

  whiteList: ["*://www.instagram.com/*"],

  onDocumentStart: () => {
    (function () {
      // Store a reference to the original send method of XMLHttpRequest
      var originalXMLSend = XMLHttpRequest.prototype.send;
      // Override the send method
      XMLHttpRequest.prototype.send = function () {
        // Check if the request URL contains the "viewSeenAt" string
        if (
          typeof arguments[0] === "string" &&
          arguments[0].includes("viewSeenAt")
        ) {
          UsefulScriptGlobalPageContext.DOM.notify({
            msg: "Usefull-script: Blocked story view tracking",
          });
          console.log("blocked");
          // Block the request by doing nothing
          // This prevents the "viewSeenAt" field from being sent
        } else {
          // If the request URL does not contain "viewSeenAt",
          // call the original send method to proceed with the request
          originalXMLSend.apply(this, arguments);
        }
      };
    })();
  },
};
