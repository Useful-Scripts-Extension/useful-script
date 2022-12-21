export default {
  icon: "😍",
  name: {
    en: "Facebook Story - Add more emoji reactions",
    vi: "Facebook Story - Thêm nhiều loại emoji",
  },
  description: {
    en: "React story Facebook with more emojis",
    vi: "React story Facebook với nhiều loại emoji khác nhau",
  },
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/1769666783365434",

  whiteList: ["https://www.facebook.com/*"],

  // FB POST: https://www.facebook.com/groups/j2team.community/posts/1769666783365434
  // Source https://github.com/whoant/react-story-facebook
  onDocumentStart: async () => {
    (async () => {
      try {
        // crawl emoji from https://emojipedia.org https://getemoji.com/
        // Array.from(document.querySelectorAll('.emoji-list .emoji')).map(_ => _.textContent).join(',')
        let url = await UsefulScriptGlobalPageContext.Extension.getURL(
          "scripts/fb_moreReactionStory.json"
        );
        const emojiJson = await fetch(url);
        const EMOJI_LIST = await emojiJson.json();

        loadModal(EMOJI_LIST);
      } catch (e) {
        alert("ERROR: " + e);
      }
    })();

    function loadModal(EMOJI_LIST) {
      const timeoutCheckStoriesFooter = setInterval(() => {
        if (!window.location.href.includes("facebook.com/stories")) return;
        if (!!document.querySelector(".ufs-more-react-story")) return;

        const fb_dtsg = getFbdtsg();
        const user_id = getUserId();

        /* HTML template
        <div class="ufs-more-react-story">
            <button class="btn-react">More</button>
            <div class="emoji-container">
                <div class="emoji-tab-container">
                    <div class="emoji-tab">😀</div>
                    ...
                </div>
                <ul class="emoji-list-container">
                    <li class="emoji">😀</li>
                    ...
                </ul>
            </div>
        </div>
        */

        const container = document.createElement("div");
        container.className = "ufs-more-react-story";

        const btnReact = document.createElement("div");
        btnReact.textContent = "MORE";
        btnReact.className = "btn-react";
        const emojiContainer = document.createElement("div");
        emojiContainer.className = "emoji-container";
        const emojiTabContener = document.createElement("div");
        emojiTabContener.className = "emoji-tab-container";
        const emojiListContainer = document.createElement("div");
        emojiListContainer.className = "emoji-list-container";

        let allTabs = [];
        Object.keys(EMOJI_LIST).map((key) => {
          const emojiTab = document.createElement("div");
          emojiTab.className = "emoji-tab";
          emojiTab.textContent = key;
          allTabs.push(emojiTab);

          emojiTab.onclick = () => {
            allTabs.forEach((tab) => tab.classList.remove("active"));
            emojiTab.classList.add("active");
            emojiListContainer.innerHTML = "";

            const emojiList = EMOJI_LIST[key].split(" ");
            emojiList.forEach((emoji) => {
              const emojiLi = document.createElement("li");
              emojiLi.className = "emoji always-enable-animations";
              emojiLi.textContent = emoji;
              emojiLi.setAttribute("value", emoji);

              let loading = 0;
              emojiLi.onclick = async function () {
                const storyId = getStoryId();
                try {
                  if (!loading) emojiLi.classList.add("loading");
                  loading++;
                  await reactStory(user_id, fb_dtsg, storyId, emoji);
                  loading--;
                  addFloatingEmoji(emoji, emojiLi);
                } catch (e) {
                  console.error(e);
                } finally {
                  if (!loading) emojiLi.classList.remove("loading");
                }
              };

              emojiListContainer.appendChild(emojiLi);
            });
          };

          emojiTabContener.appendChild(emojiTab);
        });

        btnReact.onclick = function () {
          emojiContainer.classList.toggle("show");
        };

        emojiContainer.appendChild(emojiTabContener);
        emojiContainer.appendChild(emojiListContainer);
        container.appendChild(btnReact);
        container.appendChild(emojiContainer);

        const storiesFooter = document.getElementsByClassName(
          "x11lhmoz x78zum5 x1q0g3np xsdox4t x10l6tqk xtzzx4i xwa60dl xl56j7k xtuxyv6"
        );
        if (storiesFooter.length > 0) {
          //   clearInterval(timeoutCheckStoriesFooter);
          storiesFooter[storiesFooter.length - 1].appendChild(container);
        }
      }, 1e3);
    }
    function addFloatingEmoji(emoji, ele) {
      let floatingEmoji = document.createElement("div");
      floatingEmoji.className = "floating-emoji always-enable-animations";
      floatingEmoji.textContent = emoji;

      let { top, left } = ele.getBoundingClientRect();
      floatingEmoji.style.position = "fixed";
      floatingEmoji.style.top = top + "px";
      floatingEmoji.style.left = left + "px";
      floatingEmoji.style.zIndex = 10000;
      document.body.appendChild(floatingEmoji);

      setTimeout(() => {
        floatingEmoji.remove();
      }, 2e3);
    }
    function getStoryId() {
      const htmlStory = document.getElementsByClassName(
        "xh8yej3 x1n2onr6 xl56j7k x5yr21d x78zum5 x6s0dn4"
      );
      return htmlStory[htmlStory.length - 1].getAttribute("data-id");
    }
    function getFbdtsg() {
      try {
        const regex = /"DTSGInitialData",\[],{"token":"(.+?)"/gm;
        const resp = regex.exec(document.documentElement.innerHTML);
        return resp[1];
      } catch (e) {
        return require("DTSGInitData").token;
      }
    }
    function getUserId() {
      try {
        const regex = /c_user=(\d+);/gm;
        const resp = regex.exec(document.cookie);
        return resp[1];
      } catch (e) {
        return require("RelayAPIConfigDefaults").actorID;
      }
    }
    function reactStory(user_id, fb_dtsg, story_id, message) {
      return new Promise(async (resolve, reject) => {
        const variables = {
          input: {
            lightweight_reaction_actions: {
              offsets: [0],
              reaction: message,
            },
            story_id,
            story_reply_type: "LIGHT_WEIGHT",
            actor_id: user_id,
            client_mutation_id: 7,
          },
        };

        const body = new URLSearchParams();
        body.append("av", user_id);
        body.append("__user", user_id);
        body.append("__a", 1);
        body.append("fb_dtsg", fb_dtsg);
        body.append("fb_api_caller_class", "RelayModern");
        body.append("fb_api_req_friendly_name", "useStoriesSendReplyMutation");
        body.append("variables", JSON.stringify(variables));
        body.append("server_timestamps", true);
        body.append("doc_id", "3769885849805751");

        try {
          const response = await fetch(
            "https://www.facebook.com/api/graphql/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body,
            }
          );
          const res = await response.json();
          if (res.errors) return reject(res);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    }
  },

  onDocumentIdle: async () => {
    let cssFile = await UsefulScriptGlobalPageContext.Extension.getURL(
      "scripts/fb_moreReactionStory.css"
    );
    UsefulScriptGlobalPageContext.DOM.injectCssFile(cssFile);
  },
};
