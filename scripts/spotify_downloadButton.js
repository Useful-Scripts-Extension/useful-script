export default {
  icon: "https://open.spotify.com/favicon.ico",
  name: {
    en: "Spotify - Add download button",
    vi: "Spotify - Thêm nút tải nhạc",
  },
  description: {
    en: "Add song/playlist download button on Spotify. Use spotify-downloader.com",
    vi: "Thêm nút tải nhạc/playlist trên Spotify. Sử dụng spotify-downloader.com",
    img: "/scripts/spotify_downloadButton.png",
  },
  infoLink: "https://greasyfork.org/scripts/446143",

  whiteList: ["*://open.spotify.com/*"],

  pageScript: {
    onDocumentIdle: () => {
      // ==UserScript==
      // @name         Spotify Downloader - Download Spotify songs, playlists, and albums
      // @namespace    http://tampermonkey.net/
      // @version      0.5
      // @description  Downloads Spotify songs, playlists, and albums as 320kbps MP3. Can also download full playlist or album as ZIP.
      // @author       Zertalious (Zert)
      // @match        *://open.spotify.com/*
      // @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
      // @grant        none
      // ==/UserScript==

      const style = document.createElement("style");
      style.innerText = `
[role='grid'] {
	margin-left: 50px;
}

[data-testid='tracklist-row'] {
	position: relative;
}

[role="presentation"] > * {
	contain: unset;
}

.btn {
	width: 35px;
	height: 35px;
	border-radius: 50%;
	border: 0;
	background-color: #1fdf64;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"/><path d="M10 15l5-6h-4V1H9v8H5l5 6z"/></svg>');
	background-position: center;
	background-repeat: no-repeat;
	cursor: pointer;
  transition: transform 0.2s;
}

.btn:hover {
	transform: scale(1.1);
}

[data-testid='tracklist-row'] .btn {
	position: absolute;
	top: 50%;
	right: 100%;
	margin-top: -20px;
	margin-right: 10px;
}

`;

      document.body.appendChild(style);

      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      function animate() {
        const tracks = document.querySelectorAll(
          '[data-testid="tracklist-row"]'
        );
        for (const track of tracks) {
          if (!track.hasButton) {
            addButton(track).onclick = async function () {
              const btn = track.querySelector('[data-testid="more-button"]');
              btn.click();
              await sleep(10);

              const highlight = document
                .querySelector('#context-menu a[href*="highlight"]')
                .href.match(/highlight=(.+)/)[1];
              document.dispatchEvent(new MouseEvent("mousedown"));

              const url =
                "https://open." +
                highlight.replace(":", ".com/").replace(":", "/");
              download(url);
            };
          }
        }

        const actionBarRow = document.querySelector(
          '[data-testid="action-bar-row"]:last-of-type'
        );

        if (actionBarRow && !actionBarRow.hasButton) {
          addButton(actionBarRow).onclick = function () {
            download(window.location.href);
          };
        }
      }

      function download(link) {
        window.open("https://spotify-downloader.com/?link=" + link, "_blank");
      }

      function addButton(el) {
        const button = document.createElement("button");
        button.className = "btn";
        el.appendChild(button);
        el.hasButton = true;
        return button;
      }

      setInterval(animate, 1000);
    },
  },
};
