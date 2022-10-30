export default {
  name: {
    en: "Scroll to very end",
    vi: "Cuộn trang xuống cuối cùng",
  },
  description: {
    en: "Scoll to end, then wait for load data, then scroll again...",
    vi: "Cuộn tới khi nào không còn data load thêm nữa (trong 5s) thì thôi.",
  },
  func() {
    let height = () => document.body.scrollHeight;
    let down = () => window.scrollTo({ left: 0, top: height() });
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      let lastScroll = {
        time: Date.now(),
        top: 0,
      };

      while (true) {
        down();

        let currentHeight = height();
        if (currentHeight != lastScroll.top) {
          lastScroll.top = currentHeight;
          lastScroll.time = Date.now();
        } else if (Date.now() - lastScroll.time > 5000) {
          break;
        }
        await sleep(100);
      }
      alert("scroll to very end DONE");
    })();
  },
};
