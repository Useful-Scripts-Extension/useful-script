export default {
  icon: `<i class="fa-solid fa-hand"></i>`,
  name: {
    en: "Scroll by dragging",
    vi: "Cuộn web bằng cách kéo thả",
  },
  description: {
    en: "Use this will turn the cursor into a scroller and use it again will return it back to normal.",
    vi: "Bấm vào sẽ biến con trỏ thành con lăn và bấm lại nó sẽ đưa con trỏ trở lại bình thường",
  },
    onClick: async function () {
    let X, Y;

    if (document.onmousedown && document.onmouseup && document.onmousemove) {
      body.style.cursor = "auto";
      document.onmousedown = document.onmouseup = document.onmousemove = null;
      alert("Scroll by dragging DISABLED");
    } else {
      body.style.cursor = "all-scroll";
      document.onmousedown = function (e) {
        if ((e && !e.button) || (window.event && event.button & 1)) {
          X = e.clientX;
          Y = e.clientY;
          return false;
        }
      };
      document.onmouseup = function (e) {
        if ((e && !e.button) || (window.event && event.button & 1)) {
          X = Y = null;
          return false;
        }
      };
      document.onmousemove = function (e) {
        if (X || Y) {
          window.scrollBy(X - e.clientX, Y - e.clientY);
          X = e.clientX;
          Y = e.clientY;
          return false;
        }
      };
      alert("Scroll by dragging ENABLED");
    }
  },
};
