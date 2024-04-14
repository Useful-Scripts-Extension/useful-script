export const shared = {
  scrollToVeryEnd: function () {
    return new Promise(async (resolve, reject) => {
      const notify = UfsGlobal.DOM.notify({
        msg: "Usefull-script: Scrolling to very end...",
        lifeTime: 99999,
      });

      function findMainScrollableElement() {
        let scrollableElements = [];

        // Check all elements for scrollable content
        let elements = document.querySelectorAll("*");
        for (let element of elements) {
          let style = window.getComputedStyle(element);
          if (
            (style.overflowY === "scroll" ||
              style.overflowY === "auto" ||
              style.overflowX === "scroll" ||
              style.overflowX === "auto") &&
            (element.scrollHeight > element.clientHeight ||
              element.scrollWidth > element.clientWidth)
          ) {
            scrollableElements.push(element);
          }
        }

        // If only one scrollable element is found, return it
        if (scrollableElements.length === 1) {
          return scrollableElements[0];
        }

        // Otherwise, try to find the main scrollable element based on its size and position
        let mainScrollableElement = null;
        let maxArea = 0;
        for (let element of scrollableElements) {
          let rect = element.getBoundingClientRect();
          let area = rect.width * rect.height;
          if (area > maxArea) {
            maxArea = area;
            mainScrollableElement = element;
          }
        }

        return mainScrollableElement;
      }

      let height = (ele) => (ele || document.body).scrollHeight;
      let down = (ele = document) =>
        ele.scrollTo({ left: 0, top: height(ele) });
      let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      let lastScroll = {
        time: Date.now(),
        top: 0,
      };

      let running = true;
      let clickToCancel = () => {
        running = false;
        document.removeEventListener("click", clickToCancel);
        notify.setText("Useful-script: DỪNG scroll do bạn click");
        notify.closeAfter(3000);
      };
      document.addEventListener("click", clickToCancel);

      let scrollEle = findMainScrollableElement();

      while (running) {
        down(scrollEle);
        let currentHeight = height(scrollEle);
        let time = Date.now() - lastScroll.time;
        let secondLeft = Math.round((5000 - time) / 1000);
        notify.setText(
          `Useful-script: đang scroll xuống cuối ... (${secondLeft}s)`
        );

        if (currentHeight != lastScroll.top) {
          lastScroll.top = currentHeight;
          lastScroll.time = Date.now();
        } else if (time > 5000) {
          running = false;
          notify.setText("Useful-script: scroll XONG");
          notify.closeAfter(2000);
        }
        await sleep(100);
      }

      resolve();
    });
  },
};

export default {
  icon: `<i class="fa-solid fa-angles-down fa-lg"></i>`,
  name: {
    en: "Scroll to very end",
    vi: "Cuộn trang xuống cuối cùng",
  },
  description: {
    en: "Scoll to end, then wait for load data, then scroll again... Mouse click to cancel",
    vi: "Cuộn tới khi nào không còn data load thêm nữa (trong 5s) thì thôi. Click chuột để huỷ.",
  },

  onClick: shared.scrollToVeryEnd,
};
