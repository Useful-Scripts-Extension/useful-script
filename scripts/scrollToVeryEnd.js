export default {
  icon: `<i class="fa-solid fa-angles-down"></i>`,
  name: {
    en: "Scroll to very end",
    vi: "Cuộn trang xuống cuối cùng",
  },
  description: {
    en: "Scoll to end, then wait for load data, then scroll again... Mouse click to cancel",
    vi: "Cuộn tới khi nào không còn data load thêm nữa (trong 5s) thì thôi. Click chuột để huỷ.",
  },
  func: function () {
    let height = () =>
      (document.scrollingElement || document.body).scrollHeight;
    let down = () => window.scrollTo({ left: 0, top: height() });
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      let lastScroll = {
        time: Date.now(),
        top: 0,
      };

      let running = true;
      let clickToCancel = () => {
        running = false;
        document.removeEventListener("click", clickToCancel);
        alert("scroll to very end STOPPED by user click");
      };
      document.addEventListener("click", clickToCancel);

      while (running) {
        down();
        let currentHeight = height();
        if (currentHeight != lastScroll.top) {
          lastScroll.top = currentHeight;
          lastScroll.time = Date.now();
        } else if (Date.now() - lastScroll.time > 5000) {
          running = false;
          alert("scroll to very end DONE");
        }

        if (!running) break;
        else await sleep(100);
      }
    })();
  },
};
