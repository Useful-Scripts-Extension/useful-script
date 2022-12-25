export default {
  icon: `<i class="fa-solid fa-magnifying-glass fa-lg"></i>`,
  name: {
    en: "Google site search",
    vi: "Tìm kiếm trên trang web này",
  },
  description: {
    en: "Search in google while limiting the search result to currently opened webpage.",
    vi: "Sử dụng google site search",
  },

  onClick: function () {
    let q =
      "" +
      (window.getSelection?.() ||
        document.getSelection?.() ||
        document.selection.createRange?.()?.text);

    if (!q)
      q = prompt("You didn't select any text. Enter a search phrase:", "");

    if (q != null)
      window.open(
        (
          "http://www.google.com/search?num=100&q=site:" +
          escape(window.location.hostname) +
          ' "' +
          escape(q.replace(/\"/g, "")) +
          '"'
        ).replace(/ /g, "+")
      );
  },
};
