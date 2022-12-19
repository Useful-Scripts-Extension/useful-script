export default {
  icon: "😍",
  name: {
    en: "Facebook Story - send more emoji reactions",
    vi: "Facebook Story - thêm nhiều loại emoji",
  },
  description: {
    en: "React story Facebook with more emojis",
    vi: "React story Facebook với nhiều loại emoji khác nhau",
  },
  whiteList: ["https://www.facebook.com/*"],

  // Source https://github.com/whoant/react-story-facebook
  onDocumentStart: async () => {
    // const ID_USER = require('RelayAPIConfigDefaults').actorID;
    // const FB_DTSG = require('DTSGInitData').token;

    (async () => {
      try {
        let url = await UsefulScriptGlobalPageContext.Extension.getURL(
          "scripts/fb_moreReactionStory.json"
        );
        const emojiJson = await fetch(url);
        const EMOJI_LIST = await emojiJson.json();
        loadModal(EMOJI_LIST);
      } catch (e) {
        console.error(e);
      }
    })();

    function loadModal(EMOJI_LIST) {
      const fb_dtsg = getFbdtsg();
      const user_id = getUserId();

      const timeoutCheckStoriesFooter = setInterval(() => {
        if (!window.location.href.includes("facebook.com/stories/")) return;
        if (!!document.querySelector(".btn-react")) return;

        const btnReact = document.createElement("div");
        btnReact.textContent = "MORE";
        btnReact.setAttribute("class", "btn-react");

        const emojiGroup = document.createElement("ul");
        emojiGroup.setAttribute("class", "emoji-group");

        btnReact.onclick = function () {
          emojiGroup.classList.toggle("emoji-group--show");
        };

        EMOJI_LIST.forEach((emoji) => {
          const emojiLi = document.createElement("li");
          emojiLi.setAttribute("class", "emoji");
          emojiLi.setAttribute("value", emoji.value);
          emojiLi.textContent = emoji.value;
          emojiLi.onclick = async function () {
            const storyId = getStoryId();
            try {
              emojiLi.classList.add("loading");
              await reactStory(user_id, fb_dtsg, storyId, emoji.value);
              emojiLi.classList.remove("loading");
              addFloatingEmoji(emoji, emojiLi);
            } catch (e) {
              console.error(e);
            }
          };

          emojiGroup.appendChild(emojiLi);
        });

        const reactContainer = document.createElement("div");
        reactContainer.setAttribute("class", "react-container");
        reactContainer.appendChild(btnReact);
        reactContainer.appendChild(emojiGroup);

        const storiesFooter = document.getElementsByClassName(
          "x11lhmoz x78zum5 x1q0g3np xsdox4t x10l6tqk xtzzx4i xwa60dl xl56j7k xtuxyv6"
        );
        if (storiesFooter.length > 0) {
          //   clearInterval(timeoutCheckStoriesFooter);
          storiesFooter[storiesFooter.length - 1].appendChild(reactContainer);
        }
      }, 1e3);
    }
    function addFloatingEmoji(emoji, ele) {
      let floatingEmoji = document.createElement("div");
      floatingEmoji.setAttribute("class", "floating-emoji");
      floatingEmoji.textContent = emoji.value;

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
      const regex = /"DTSGInitialData",\[],{"token":"(.+?)"/gm;
      const resp = regex.exec(document.documentElement.innerHTML);
      return resp[1];
    }
    function getUserId() {
      const regex = /c_user=(\d+);/gm;
      const resp = regex.exec(document.cookie);
      return resp[1];
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
