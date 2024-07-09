import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-heart fa-lg"></i>',
  name: {
    en: "Auto like post on Facebook",
    vi: "Tự động thích bài đăng Facebook",
  },
  description: {
    en: `Auto like post on Facebook.
    <ul>
      <li>Support all post types (page, group, user, feed, ...)</li>
      <li>Support bulk remove/add reactions</li>
      <li>Support all reaction types</li>
    </ul>`,
    vi: `Tự động thả cảm xúc cho bài đăng trên Facebook.
    <ul>
      <li>Hỗ trợ mọi loại bài đăng (trang, nhóm, người dùng, new feed, ...)</li>
      <li>Hỗ trợ gỡ/thêm cảm xúc hàng loạt</li>
      <li>Hỗ trợ mọi loại cảm xúc</li>
    </ul>`,
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-07-08": "init",
  },

  whiteList: ["https://*.facebook.com/*"],

  pageScript: {
    onClick: () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
        window.scrollTo(0, document.body.scrollHeight, { behavior: "smooth" });
      }

      function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      function isRunning(value) {
        if (!(typeof value === "boolean"))
          return window.ufs_fb_autoLike_running;
        else window.ufs_fb_autoLike_running = value;
      }

      const Reactions = {
        like: { vi: "Thích", en: "Like", emoji: "👍" },
        love: { vi: "Yêu thích", en: "Love", emoji: "❤️" },
        care: { vi: "Thương thương", en: "Care", emoji: "🤗" },
        haha: { vi: "Haha", en: "Haha", emoji: "😂" },
        wow: { vi: "Wow", en: "Wow", emoji: "😮" },
        sad: { vi: "Buồn", en: "Sad", emoji: "😢" },
        angry: { vi: "Phẫn nộ", en: "Angry", emoji: "😠" },
      };

      const Types = {
        addReact: {
          vi: "Bày tỏ cảm xúc",
          en: "React",
          name: "Thả cảm xúc - Add reaction",
        },
        removeReact: {
          vi: "Gỡ ",
          en: "Remove ",
          name: "Gỡ cảm xúc - Remove reaction",
        },
      };

      async function startAutoLike(
        type = Types.addReact,
        reaction = Reactions.love,
        maxPosts = Infinity
      ) {
        isRunning(true);

        const notify = UfsGlobal.DOM.notify({
          msg: "Đang chuẩn bị ...",
          duration: 999999,
        });

        let count = 0;

        const btns = [];
        UfsGlobal.DOM.onElementsAdded(
          ["en", "vi"]
            .map((l) =>
              type === Types.removeReact
                ? Object.values(Reactions).map(
                    (r) => `[aria-label='${type[l]}${r[l]}']:not(li *)`
                  )
                : `[aria-label='${type[l]}']:not(li *)`
            )
            .flat()
            .join(", "),
          (nodes) => {
            btns.push(...nodes);
          }
        );

        let scrollTried = 0;
        while (true) {
          if (!isRunning()) {
            alert("Stopped Auto react !\n\nĐã dừng tự động thích!");
            break;
          }
          if (!btns.length) {
            scrollTried++;
            if (scrollTried > 50) break;
            notify.setText("Scrolling to bottom... " + scrollTried, 99999);
            scrollToBottom();
            await sleep(2000);
            continue;
          }
          scrollTried = 0;

          const btn = btns.shift();
          btn.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
          await sleep(500);
          btn.click();

          if (type === Types.addReact) {
            await sleep(500);

            let reactBtn = document.querySelector(
              [reaction.en, reaction.vi]
                .map((_) => `[aria-label='${_}']`)
                .join(", ")
            );
            if (reactBtn) {
              focusTo(reactBtn);
              await sleep(100);
              reactBtn.click();
              await sleep(100);
            }
          }

          let waitFor = rand(1000, 4000);
          count++;
          if (count >= maxPosts) break;
          notify.setText(
            type.name +
              ": " +
              count +
              "/" +
              (count + btns.length) +
              " - waiting: " +
              (waitFor / 1000).toFixed(1) +
              "s",
            99999
          );

          await sleep(waitFor);
        }

        let text = type.name + ": " + count + " posts";
        notify.setText(text, 5000);
        isRunning(false);
        alert(text);
      }

      if (isRunning()) {
        return isRunning(false);
      }

      const typeIndex = prompt(
        "Bạn muốn?\n" +
          Object.entries(Types)
            .map(([key, value], i) => i + ": " + value.name)
            .join("\n"),
        0
      );
      let selectedType = Types[Object.keys(Types)[typeIndex]];
      let selectedReact;
      if (typeIndex === null || !selectedType) return;

      if (typeIndex == 0) {
        let reactIndex = prompt(
          "Chọn reaction:\n" +
            Object.entries(Reactions)
              .map(
                ([key, value], i) =>
                  i + ": " + value.emoji + " " + value.en + " - " + value.vi
              )
              .join("\n"),
          1
        );
        selectedReact = Reactions[Object.keys(Reactions)[reactIndex]];
        if (reactIndex == null || !selectedReact) return;
      }

      let max = prompt(
        "Thả bao nhiêu bài post? - Max post?: (0 = tất cả/all) ",
        0
      );
      if (max == null) return;
      if (max == 0) max = Infinity;
      else max = parseInt(max);

      startAutoLike(selectedType, selectedReact, max);
    },
  },
};
