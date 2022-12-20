export default {
  icon: "https://lh3.googleusercontent.com/6i_qAB7dGRV44NxLp_JzemPr0ZoHp1e2JT0QxHbAteVJwsLQ-1HLaxmcUJ19F-wKITawVukn8ZbLri2FZamcxgBB=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Detect Zero-Width Characters",
    vi: "Phát hiện ký tự ẩn (Zero-Width)",
  },
  description: {
    en: "Detects zero-width characters, highlights the characters and containing DOM element.\n\nClick for more detail.",
    vi: "Phát hiện ký tự ẩn (zero-width) trong văn bản cho trình duyệt, e-mail client, trình soạn thảo văn bản,...\n\nBấm để xem thêm chi tiết.",
  },

  onDocumentIdle: detectZeroWidthCharacters,
  onClick: detectZeroWidthCharacters,

  // onClickExtension: () =>
  //   window.open(
  //     "https://viblo.asia/p/ky-tu-zero-width-sat-thu-vo-hinh-nam-giua-doan-van-ban-thuan-vo-hai-L4x5xM7qKBM"
  //   ),
};

// Code extracted from https://chrome.google.com/webstore/detail/detect-zero-width-charact/icibkhaehdofmcbfjfpppogioidkilib
function detectZeroWidthCharacters() {
  let containerClass = "ufs-zero-width-characters-container";
  let spanClass = "ufs-zero-width-character";

  let intervalKey = "ufs_detect_zero_width_interval";
  let existSpans = Array.from(document.querySelectorAll(`.${spanClass}`));
  if (existSpans.length > 0) {
    if (intervalKey in window) {
      clearInterval(window[intervalKey]);
    }
    existSpans.forEach((el) => {
      el.remove();
    });
    Array.from(document.querySelectorAll(`.${containerClass}`)).forEach(
      (el) => {
        el.classList.remove(containerClass);
      }
    );
    return;
  }

  var unicodeCode;
  const zeroWidthCharacterCodes = [8203, 8204, 8205, 8288];

  let elementsWithZWCC = [];
  const highlightCharacters = function (element) {
    const zeroWidthCharacters = String.fromCodePoint(
      ...zeroWidthCharacterCodes
    );
    const regExp = new RegExp(`([${zeroWidthCharacters}])`, "g");
    let textToAdd = '<span class="' + spanClass + '"></span>';
    element.classList.add(containerClass);
    element.innerHTML = element.innerHTML
      .replace(textToAdd, "")
      .replace(regExp, "$1" + textToAdd);
  };
  // From: https://jsfiddle.net/tim333/np874wae/13/
  const checkElement = function (element) {
    const text = textWithoutChildren(element);
    [...text].forEach(function (character) {
      unicodeCode = character.codePointAt(0);
      if (
        zeroWidthCharacterCodes.includes(unicodeCode) &&
        !elementsWithZWCC.includes(element)
      ) {
        elementsWithZWCC.push(element);
      }
    });
  };
  // From: https://stackoverflow.com/a/9340862/535363
  const textWithoutChildren = function (element) {
    let child = element.firstChild,
      texts = [];
    while (child) {
      if (child.nodeType == 3) {
        texts.push(child.data);
      }
      child = child.nextSibling;
    }
    return texts.join("");
  };
  const checkPage = function () {
    const allElements = document.getElementsByTagName("*");
    [...allElements].forEach(checkElement);
    elementsWithZWCC.forEach(function (element) {
      highlightCharacters(element);
    });
  };

  (async () => {
    // inject css
    UsefulScriptGlobalPageContext.DOM.injectCssFile(
      await UsefulScriptGlobalPageContext.Extension.getURL(
        "scripts/detect_zeroWidthCharacters.css"
      )
    );

    // Check Page
    checkPage();
    window[intervalKey] = setInterval(checkPage, 5000);

    // Check page again when any input field is changed
    const inputs = document.querySelectorAll("input");
    [...inputs].forEach(function (input) {
      input.addEventListener("change", checkPage);
    });
  })();
}
