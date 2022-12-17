// Tất cả các hàm/biến toàn cục được nhúng vào trang web at document_start
// Có thể truy cập từ các script chạy trong webpage context (có hàm onClick)

const UsefulScriptGlobalWebpageContext = {
  deleteElements(selector, willReRun) {
    UsefulScriptGlobalWebpageContext.onElementsVisible(
      selector,
      (nodes) => {
        [].forEach.call(nodes, function (node) {
          node.remove();
          console.log("Useful-scripts: element removed ", node);
        });
      },
      willReRun
    );
  },

  waitForElements(selector) {
    return new Promise((resolve, reject) => {
      UsefulScriptGlobalWebpageContext.onElementsVisible(
        selector,
        resolve,
        false
      );
    });
  },

  // Idea from  https://github.com/gys-dev/Unlimited-Stdphim
  // https://stackoverflow.com/a/61511955/11898496
  onElementsVisible: async (selector, callback, willReRun) => {
    let nodes = document.querySelectorAll(selector);
    if (nodes?.length) {
      callback(nodes);
      if (!willReRun) return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;

        for (let node of mutation.addedNodes) {
          if (node.nodeType != 1) continue; // only process Node.ELEMENT_NODE

          let n = node.matches(selector)
            ? [node]
            : Array.from(node.querySelectorAll(selector));

          if (n?.length) {
            callback(n);
            if (!willReRun) observer.disconnect();
          }
        }
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    // return disconnect function
    return () => observer.disconnect();
  },
};
window.UsefulScriptGlobalWebpageContext = UsefulScriptGlobalWebpageContext;

// ================================= Polyfill =================================
// Chrome pre-34
if (!Element.prototype.matches)
  Element.prototype.matches = Element.prototype.webkitMatchesSelector;
