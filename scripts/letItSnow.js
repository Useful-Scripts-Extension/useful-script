import { BADGES } from "./helpers/badge.js";

export default {
  icon: `<i class="fa-solid fa-snowflake fa-lg"></i>`,
  name: {
    en: "Let it snow",
    vi: "Hiệu ứng tuyết rơi",
  },
  description: {
    en: "Make website like it snowing",
    vi: "Thêm hiệu ứng tuyết rơi vào trang web",
  },
  badges: [BADGES.hot, BADGES.new],
  changeLogs: {
    "2024-05-23": "better UI",
  },

  contentScript: {
    // original from https://github.com/HoanghoDev/32eqwedaw
    onClick: function () {
      let id = "ufs-letItSnow";
      let exist = document.getElementById(id);
      if (exist) {
        exist.remove();
        return;
      }

      let style = document.createElement("style");
      style.textContent = `
        #${id} {
          --rotateEnd: 180deg;
          --xStart: 0;
          --xEnd: 0;
          --yStart: 0;
          --yEnd: 100vh;

          position: fixed;
          top: 0;
          left: 0;
          width:100vw;
          height:100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          z-index: 2147483647;
        }
        #${id} .snow {
          position: absolute;
          top:0;
          left:0;
          width:50px;
          height:50px;
          animation: animationSnow 4s ease-in-out infinite;
          opacity: 0;
        }
        @keyframes animationSnow {
            0%{
                transform: translate(var(--xStart),var(--yStart)) rotate(0);
                opacity: 0;
            }
            50%{
                opacity: 1;
            }
            100%{
                opacity: 0;
                transform: translate(var(--xEnd),var(--yEnd)) rotate(var(--rotateEnd));
            }
        }`;

      function randInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }

      function resetSnow(snow) {
        let size = randInt(5, 50);
        let blur = randInt(0, 7);
        let xStart = randInt(0, container.clientWidth);
        let yStart = randInt(-50, 50);
        let xEnd = xStart + randInt(50, 200);
        let yEnd = randInt(container.clientHeight / 2, container.clientHeight);
        let rotateEnd = randInt(-360, 360);

        snow.style.setProperty("--xStart", xStart + "px");
        snow.style.setProperty("--xEnd", xEnd + "px");
        snow.style.setProperty("--yStart", yStart + "px");
        snow.style.setProperty("--yEnd", yEnd + "px");
        snow.style.setProperty("--rotateEnd", rotateEnd + "deg");
        snow.style.width = size + "px";
        snow.style.height = size + "px";
        snow.style.filter = "blur(" + blur + "px)";
      }

      let count = 50;
      let container = document.createElement("div");
      container.id = id;
      container.appendChild(style);
      document.documentElement.appendChild(container);

      for (var i = 0; i < count; i++) {
        let snow = document.createElement("img");
        snow.src = chrome.runtime.getURL("/scripts/letItSnow.png");
        snow.classList.add("snow");
        snow.style.animationDuration = randInt(8000, 15000) + "ms";

        resetSnow(snow);
        snow.addEventListener("animationiteration", function () {
          resetSnow(snow);
        });

        container.appendChild(snow);
      }
    },
  },
};
