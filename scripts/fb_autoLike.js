export default {
  icon: "",
  name: {
    en: "",
    vi: "",
  },
  description: {
    en: "",
    vi: "",
    img: "",
  },

  changeLogs: {
    "2024-07-08": "init",
  },

  whiteList: [],

  contentScript: {
    onClick: async () => {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      function focusTo(element) {
        element.dispatchEvent(
          new MouseEvent("pointerover", {
            view: window,
            bubbles: true,
            cancelable: true,
          })
        );
      }

      function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight, {
          // behavior: "smooth",
        });
      }

      const Reactions = {
        Like: {
          en: "Like",
          vi: "Thích",
          emoji: "👍",
        },
        Love: {
          en: "Love",
          vi: "Yêu thích",
          emoji: "❤️",
        },
        Care: {
          en: "Care",
          vi: "Nghiện",
          emoji: "😊",
        },
        Haha: {
          en: "Haha",
          vi: "Há",
          emoji: "😂",
        },
        Wow: {
          en: "Wow",
          vi: "Wow",
          emoji: "😮",
        },
        Sad: {
          en: "Sad",
          vi: "Buồn",
          emoji: "😢",
        },
        Angry: {
          en: "Angry",
          vi: "Khóc",
          emoji: "😡",
        },
      };

      const doneKey = "auto-like-done";
      const btns = [];
      while (true) {
        if (!btns.length) {
          let curBtns = Array.from(
            document.querySelectorAll(
              "[aria-label='Bày tỏ cảm xúc']:not(li *), [aria-label='React']:not(li *)"
            )
          );
          let added = 0;
          for (let btn of curBtns) {
            if (btn.getAttribute(doneKey) === null) {
              btns.push(btn);
              btn.setAttribute(doneKey, true);
              added++;
            }
          }
          if (added === 0) break;
        }

        for (let btn of btns) {
          btn.scrollIntoView({
            block: "center",
            // behavior: "smooth",
          });
          btn.click();
          await sleep(500);
          let loveBtn = document.querySelector("[aria-label='Yêu thích']");
          if (loveBtn) {
            focusTo(loveBtn);
            await sleep(500);
            loveBtn.click();
            await sleep(500);
          }
          btns.splice(btns.indexOf(btn), 1);
        }
        scrollToBottom();
        await sleep(3000);
      }
      alert("xong");
    },
  },
};
