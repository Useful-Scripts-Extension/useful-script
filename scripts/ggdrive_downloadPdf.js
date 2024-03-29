export default {
  icon: "https://drive.google.com/favicon.ico",
  name: {
    en: "GG Drive - Download PDF",
    vi: "GG Drive - Tải PDF",
  },
  description: {
    en: "Download google drive PDF file that dont have download button",
    vi: "Tải file PDF không có nút download trên google drive",
  },

  whiteList: ["https://drive.google.com/file/d/*"],

  onClick: () => {
    UsefulScriptGlobalPageContext.DOM.injectScriptSrc(
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      async (success, error) => {
        if (!success) {
          alert("Inject FAILED: " + error);
          return;
        }

        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) {
          alert("jspdf not found");
          return;
        }

        const sleep = (ms = 0) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        let pageContainers = Array.from(
          document.querySelectorAll(".ndfHFb-c4YZDc-cYSp0e-DARUcf")
        );

        if (pageContainers.length === 0) {
          alert("Pdf page not found");
          return;
        }

        // let infiContainer = document.createElement("div");
        // infiContainer.innerHTML = UsefulScriptGlobalPageContext.DOM
        //   .createTrustedHtml(`
        // <div style="${[
        //   "position: fixed",
        //   "left: 10px",
        //   "top: 10px",
        //   "color: white",
        //   "background: #0007",
        //   "padding: 10px",
        //   "font-size: 20px",
        // ].join(";")}">
        //   PDF: ${pageContainers.length} trang
        // </div>`);
        // let infoDiv = infiContainer.querySelector("div");
        // document.body.append(infiContainer);

        for (let i = 0; i < pageContainers.length; i++) {
          let page = pageContainers[i];
          page.scrollIntoView();
          console.log("Đang scroll PDF: trang " + i + "...");
          await sleep(100);
        }

        let canvasElement = document.createElement("canvas");
        let con = canvasElement.getContext("2d");

        let checkImagesLoadedInterval = setInterval(() => {
          let imgs = Array.from(
            document.querySelectorAll("img[src^='blob:']")
          ).filter((_) => _.complete);

          console.log(
            `Đang đợi các trang load xong: ${imgs.length}/${pageContainers.length}`
          );

          if (imgs.length === pageContainers.length) {
            console.log("Đang tạo PDF...");
            clearInterval(checkImagesLoadedInterval);

            let pdf;
            for (let i = 0; i < imgs.length; i++) {
              let img = imgs[i];
              canvasElement.width = img.width;
              canvasElement.height = img.height;

              con.drawImage(img, 0, 0, img.width, img.height);
              let imgData = canvasElement.toDataURL("image/jpeg", 1.0);
              canvasElement.remove();

              if (!pdf) {
                let ori = img.width > img.height ? "l" : "p";
                pdf = new jsPDF({
                  orientation: ori,
                  unit: "px",
                  format: [img.width, img.height],
                  hotfixes: ["px_scaling"],
                });
              }
              pdf.addImage(imgData, "JPEG", 0, 0);
              if (i < imgs.length - 1) pdf.addPage([img.width, img.height]);
            }
            // infiContainer.remove();
            pdf.save("download.pdf");
          }
        }, 500);
      }
    );
  },
};
