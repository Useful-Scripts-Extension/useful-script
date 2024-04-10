export default {
  icon: '<i class="fa-solid fa-magnifying-glass-plus"></i>',
  name: {
    en: "Magnify Image with Ctrl",
    vi: "Phóng to hình ảnh bằng Ctrl",
  },
  description: {
    en: "Press Ctrl twice to any image to open it in magnified window",
    vi: "Nhấn Ctrl 2 lần lên bất kỳ hình ảnh nào để xem nó trong cửa sổ phóng đại",
    img: "",
  },

  onDocumentStart: () => {
    let mouse = { x: 0, y: 0 };

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function getAllElementsWithBackgroundImage() {
      const elements = [];
      const allElements = document.querySelectorAll("*"); // Select all elements

      for (const element of allElements) {
        const backgroundImage =
          getComputedStyle(element).getPropertyValue("background-image");
        if (backgroundImage !== "none" && backgroundImage.match(/url\(/)) {
          // Check for "none" and existence of url(...) pattern
          elements.push(element);
        }
      }

      return elements;
    }

    let unsub = UsefulScriptGlobalPageContext.DOM.onDoublePress(
      "Control",
      () => {
        try {
          let src = Array.from(document.querySelectorAll("img"))
            .map((i) => ({
              src: i.src,
              rect: i.getBoundingClientRect(),
            }))
            .concat(
              getAllElementsWithBackgroundImage().map((i) => ({
                src: i.style.backgroundImage
                  ?.replace("url(", "")
                  ?.replace(")", "")
                  ?.replace('"', "")
                  ?.replace('"', ""),
                rect: i.getBoundingClientRect(),
              }))
            )
            .filter(({ src, rect }) => {
              return (
                src &&
                mouse.x > rect.x &&
                mouse.x < rect.x + rect.width &&
                mouse.y > rect.y &&
                mouse.y < rect.y + rect.height
              );
            });
          console.log(src);

          src = src.sort((a, b) => {
            // small one first
            return a.rect.width * a.rect.height - b.rect.width * b.rect.height;
          })?.[0]?.src;

          console.log(src);

          if (src) {
            let w = 600,
              h = 600,
              left = screen.width / 2 - w / 2,
              top = screen.height / 2 - h / 2;

            let win = window.open(
              "",
              "",
              `scrollbars=yes,width=${w},height=${h},top=${top},left=${left}`
            );
            win.document.write(`
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background-color: #221c1c;
            }
            .magnify {
              box-sizing: border-box;
              padding: 5px 5px 0;
              position: absolute;
              text-align: center;
              top: 0;
              left: 0;
              overflow: hidden;
              width: 100%;
              height: 100%;
              transform-origin: 0px 0px;
              transform: scale(1) translate(0px, 0px);
            }
          </style>
          <div class="magnify">
            <img src="${src}" style="width: 500px" />
          </div>`);
          }
        } catch (e) {
          console.log("ERROR", e);
        }
      }
    );
  },
};
