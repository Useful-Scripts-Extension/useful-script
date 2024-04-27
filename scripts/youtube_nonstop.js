export default {
  icon: "https://lh3.googleusercontent.com/OS9P4SJOFAg8lhCyaRTJ7y4ADF0TGpqFF904BcpCtdBjJIDBbNb_J8PpgoJ9QvariiG_RzgH8fCSSY_kQu-chQQ0Aw=s0",
  name: {
    en: "Youtube nonstop",
    vi: "Youtube nonstop",
  },
  description: {
    en: 'Kiss the annoying "Video paused. Continue watching?" confirmation goodbye!',
    vi: "Phát youtube không còn bị làm phiền bởi popup 'Video đã tạm dừng. Bạn có muốn xem tiếp?' của youtube.",
    img: "/scripts/youtube_nonstop.png",
  },
  whiteList: ["*://*.youtube.com/*"],

  onDocumentStart: function () {
    // ==UserScript==
    // @name         YouTube - Stay Active and Play Forever
    // @namespace    q1k
    // @version      3.1.1
    // @description  Tired of Youtube pausing playback asking you to click 'yes' to continue playing? This script will make the popup never appear, music will never stop. Never pause, never inactive, never worry. The script will keep you active and keep playing music FOREVER. Enables playing in background on mobile.
    // @author       q1k
    // @match        *://*.youtube.com/*
    // @run-at       document-start
    // ==/UserScript==

    Object.defineProperties(document, {
      /*'hidden': {value: false},*/ webkitHidden: { value: false },
      visibilityState: { value: "visible" },
      webkitVisibilityState: { value: "visible" },
    });

    setInterval(function () {
      document.dispatchEvent(
        new KeyboardEvent("keyup", {
          bubbles: true,
          cancelable: true,
          keyCode: 143,
          which: 143,
        })
      );
    }, 60000);
  },
};
