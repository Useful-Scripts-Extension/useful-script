export default {
  icon: "https://www.studyphim.vn/assets/ico/favicon.ico",
  name: {
    en: "Studyphim - Watch free movies",
    vi: "Studyphim - Xem miễn phí",
  },
  description: {
    en: "Watch movies on Studyphim for free without login",
    vi: "Xem phim miễn phí trên Studyphim không cần đăng nhập",
  },
  blackList: [],
  whiteList: ["https://www.studyphim.vn/*"],

  onDocumentStart: () => {
    // Source: https://github.com/gys-dev/Unlimited-Stdphim

    deleteElements(
      ".overlay.playable.hide, .overlay.playable, #topchapter, #wrapper_header"
    );

    function deleteElements(selector) {
      // in case the content script was injected after the page is partially loaded
      doDelete(document.querySelectorAll(selector));

      var mo = new MutationObserver(process);
      mo.observe(document, { subtree: true, childList: true });
      document.addEventListener("DOMContentLoaded", function () {
        mo.disconnect();
      });

      function process(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var nodes = mutations[i].addedNodes;
          for (var j = 0; j < nodes.length; j++) {
            var n = nodes[j];
            if (n.nodeType != 1)
              // only process Node.ELEMENT_NODE
              continue;
            doDelete(n.matches(selector) ? [n] : n.querySelectorAll(selector));
          }
        }
      }
      function doDelete(nodes) {
        [].forEach.call(nodes, function (node) {
          node.remove();
          console.log("Useful-scripts: studyphim - removed ", node);
        });
      }
    }

    // Chrome pre-34
    if (!Element.prototype.matches)
      Element.prototype.matches = Element.prototype.webkitMatchesSelector;
  },
};

