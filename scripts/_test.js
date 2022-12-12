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

  onDocumentStart: function (tab) {},
  onDocumentEnd: function (tab) {},
  onDocumentIdle: function (tab) {
    console.log("idle");
  },
  onClick: async function () {
    requireLazy(["MWChatTypingIndicator.bs"], (MWChatTypingIndicator) => {
      console.log(MWChatTypingIndicator);

      const MWChatTypingIndicatorOrig = MWChatTypingIndicator.make;
      MWChatTypingIndicator.make = function (...a) {
        console.log(a);
        return MWChatTypingIndicatorOrig.apply(this, arguments);
      };
    });
  },
};
