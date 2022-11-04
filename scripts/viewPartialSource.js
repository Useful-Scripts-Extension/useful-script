export default {
  icon: `<i class="fa-solid fa-laptop-code"></i>`,
  name: {
    en: "View source code of selected area",
    vi: "Xem mã nguồn của phần bôi đen",
  },
  description: {
    en: "Just select the area and use this bookmarklet",
    vi: "Mở mã nguồn của phần được bôi đen trong tab mới",
  },
  func: function () {
    function getSelSource() {
      x = document.createElement("div");
      x.appendChild(window.getSelection().getRangeAt(0).cloneContents());
      return x.innerHTML;
    }

    function makeHR() {
      return nd.createElement("hr");
    }

    function makeParagraph(text) {
      p = nd.createElement("p");
      p.appendChild(nd.createTextNode(text));
      return p;
    }

    function makePre(text) {
      p = nd.createElement("pre");
      p.appendChild(nd.createTextNode(text));
      return p;
    }
    nd = window.open().document;
    ndb = nd.body;
    if (
      !window.getSelection ||
      !window.getSelection().rangeCount ||
      window.getSelection().getRangeAt(0).collapsed
    ) {
      nd.title = "Generated Source of: " + location.href;
      ndb.appendChild(
        makeParagraph(
          "No selection, showing generated source of entire document."
        )
      );
      ndb.appendChild(makeHR());
      ndb.appendChild(
        makePre("<html>\n" + document.documentElement.innerHTML + "\n</html>")
      );
    } else {
      nd.title = "Partial Source of: " + location.href;
      ndb.appendChild(makePre(getSelSource()));
    }
  },
};
