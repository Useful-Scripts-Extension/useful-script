export default {
  icon: '<i class="fa-solid fa-arrow-pointer fa-lg"></i>',
  name: {
    en: "Show image on hover link",
    vi: "Hiện ảnh khi di chuột qua link",
  },
  description: {
    en: "Show preview image when you hover mouse over an image link",
    vi: "Xem trước hình ảnh khi bạn đưa chuột qua link hình ảnh",
  },
  changeLogs: {
    "2024-06-19": "init",
  },

  contentScript: {
    onDocumentStart_: (details) => {
      function isImgUrl(url) {
        return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
      }

      const id = "show-image-on-hover-link";
      let div = document.createElement("div");
      div.id = id;

      let appended = false;

      let img = document.createElement("img");
      div.appendChild(img);

      let style = document.createElement("style");
      style.textContent = `
        #${id} {
          hidden: true;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999999999999;
          transform: translate(10px, 10px);
          transition: all 0.1s ease;
        }
        #${id} img {
          max-width: 400px;
          max-height: 400px;
        }
        #${id} .loader {
          width: 50px;
          aspect-ratio: 1;
          display: grid;
          border-radius: 50%;
          background:
            linear-gradient(0deg ,rgb(200 200 200 /50%) 30%,#0000 0 70%,rgb(200 200 200 /100%) 0) 50%/8% 100%,
            linear-gradient(90deg,rgb(200 200 200 /25%) 30%,#0000 0 70%,rgb(200 200 200 /75% ) 0) 50%/100% 8%;
          background-repeat: no-repeat;
          animation: l23 1s infinite steps(12);
        }
        #${id} .loader::before,
        #${id} .loader::after {
          content: "";
          grid-area: 1/1;
          border-radius: 50%;
          background: inherit;
          opacity: 0.915;
          transform: rotate(30deg);
        }
        #${id} .loader::after {
          opacity: 0.83;
          transform: rotate(60deg);
        }
        @keyframes l23 {
          100% {transform: rotate(1turn)}
        }
      `;
      div.appendChild(style);

      let loader = document.createElement("div");
      loader.classList.add("loader");
      div.appendChild(loader);

      let timeout;

      window.addEventListener("mouseover", (e) => {
        if (e.target.tagName === "A") {
          let href = e.target.href;
          if (href && isImgUrl(href)) {
            if (!appended) {
              document.body.appendChild(div);
              appended = true;
            }

            clearTimeout(timeout);
            div.hidden = false;
            loader.hidden = false;
            img.hidden = true;

            let image = new Image();
            image.src = href;
            image.onload = function () {
              img.src = href;
              loader.hidden = true;
              img.hidden = false;
            };

            div.style.top = e.clientY + "px";
            div.style.left = e.clientX + "px";

            e.target.addEventListener(
              "mouseleave",
              (e) => {
                timeout = setTimeout(() => {
                  div.hidden = true;
                }, 500);
              },
              { once: true }
            );
          }
        }
      });
    },
  },
};
