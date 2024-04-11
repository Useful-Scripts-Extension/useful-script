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

    function extractBackgroundImageURLs(element) {
      var computedStyle = window.getComputedStyle(element);
      var backgroundImage = computedStyle.backgroundImage;
      var urls = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/gi);
      urls = urls.map(function (url) {
        return url.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
      });
      return urls;
    }

    function getAllElementsWithBackgroundImage() {
      const elements = [];
      const allElements = document.querySelectorAll("*");

      for (const element of allElements) {
        const backgroundImage =
          getComputedStyle(element).getPropertyValue("background-image");
        if (backgroundImage !== "none" && backgroundImage.match(/url\(/)) {
          elements.push(element);
        }
      }

      return elements;
    }

    function getImgSrcAtMouse() {
      try {
        let data = Array.from(document.querySelectorAll("img"))
          .map((i) => ({
            src: i.src,
            rect: i.getBoundingClientRect(),
          }))
          .concat(
            getAllElementsWithBackgroundImage().map((i) => {
              let urls = extractBackgroundImageURLs(i);
              let rect = i.getBoundingClientRect();
              return urls.map((url) => ({
                src: url,
                rect,
              }));
            })
          )
          .flat()
          .filter(({ src, rect }) => {
            return (
              src &&
              mouse.x > rect.x &&
              mouse.x < rect.x + rect.width &&
              mouse.y > rect.y &&
              mouse.y < rect.y + rect.height
            );
          });
        console.log(data);

        // small one first
        data = data.sort((a, b) => {
          return b.rect.width * b.rect.height - a.rect.width * a.rect.height;
        });

        return data?.[0]?.src;
      } catch (e) {
        console.log("ERROR", e);
      }
      return null;
    }

    let unsub = UsefulScriptGlobalPageContext.DOM.onDoublePress(
      "Control",
      () => {
        const src = getImgSrcAtMouse();

        if (!src) {
          UsefulScriptGlobalPageContext.DOM.notify(
            "Useful-script: No image found",
            mouse.x,
            mouse.y
          );
          return;
        }

        UsefulScriptGlobalPageContext.Extension.getURL(
          "/scripts/magnify_image.html"
        ).then((url) => {
          let w = 600,
            h = 600,
            left = screen.width / 2 - w / 2,
            top = screen.height / 2 - h / 2;

          window.open(
            url + "?src=" + encodeURIComponent(src),
            "Magnify image",
            `width=${w},height=${h},top=${top},left=${left},location=no`
          );
        });
      }
    );
  },
};
