export default {
  icon: "https://fireship.io/img/favicon.png",
  name: {
    en: "Fireship - PRO unlocked",
    vi: "Fireship - Mở khoá PRO",
  },
  description: {
    en: "Unlock all Fireship PRO courses/lessons (saved $399 USD)",
    vi: "Mở khoá tất cả khoá học/bài giảng PRO trên Fireship (tiết kiệm $399 USD)",
  },

  whiteList: ["https://fireship.io/*"],

  contentScript: {
    onDocumentIdle: () => {
      // ==UserScript==
      // @name         Freeship
      // @namespace    lemons
      // @version      1.7
      // @description  Unlock all Fireship PRO courses/lessons.
      // @author       lemons
      // @match        https://fireship.io/*
      // @icon         https://em-content.zobj.net/source/apple/391/fire_1f525.png
      // @grant        none
      // @downloadURL https://update.greasyfork.org/scripts/455330/Freeship.user.js
      // @updateURL https://update.greasyfork.org/scripts/455330/Freeship.meta.js
      // ==/UserScript==

      // prettier-ignore
      setInterval(async () => {
        document.querySelectorAll("[free=\"\"]").forEach(el => el.setAttribute("free", true)) // set all elements with the attribute free set to "" to true

        if (document.querySelector("if-access [slot=\"granted\"]")) { // replace HOW TO ENROLL to YOU HAVE ACCESS
            document.querySelector("if-access [slot=\"denied\"]").remove()
            document.querySelector("if-access [slot=\"granted\"]").setAttribute("slot", "denied")
        }

        if (document.querySelector("video-player")?.shadowRoot?.querySelector(".vid")?.innerHTML) return; // return if no video player
        const vimeoId = Number(atob(document.querySelector("global-data").vimeo)); // get id for vimeo video
        const youtubeId = atob(document.querySelector("global-data").youtube); // get id for vimeo video

        if (youtubeId) { // if there is an id,
            document.querySelector("video-player").setAttribute("free", true) // set free to true
            document.querySelector("video-player").shadowRoot.querySelector(".vid").innerHTML = `<iframe src="https://youtube.com/embed/${youtubeId}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="" title="${location.pathname.split("/")[3]}" width="426" height="240" frameborder="0"></iframe>` // set video
            return;
        }
        if (vimeoId) { // if there is an id,
            document.querySelector("video-player").setAttribute("free", true) // set free to true
            const html = (await fetch(`https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F${vimeoId}&id=${vimeoId}`).then(r=>r.json())).html
            document.querySelector("video-player").shadowRoot.querySelector(".vid").innerHTML = html // set video
            return;
        }
      }, 500)
    },
  },
};
