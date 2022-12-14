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

  onClickExtension: async function () {
    chrome.runtime.getPackageDirectoryEntry(function (root) {
      console.log(root);
    });
    // requireLazy(["MWChatTypingIndicator.bs"], (MWChatTypingIndicator) => {
    //   console.log(MWChatTypingIndicator);

    //   const MWChatTypingIndicatorOrig = MWChatTypingIndicator.make;
    //   MWChatTypingIndicator.make = function (...a) {
    //     console.log(a);
    //     return MWChatTypingIndicatorOrig.apply(this, arguments);
    //   };
    // });
  },
};
