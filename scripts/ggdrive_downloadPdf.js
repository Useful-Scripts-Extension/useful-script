export default {
  // https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.document
  // https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.spreadsheet
  // https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  // https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document
  // https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.openxmlformats-officedocument.presentationml.presentation
  // https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.jgraph.mxfile
  // https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.jam
  // https://drive-thirdparty.googleusercontent.com/32/type/application/octet-stream
  // https://drive-thirdparty.googleusercontent.com/32/type/application/pdf
  // https://drive-thirdparty.googleusercontent.com/32/type/application/epub+zip
  // https://drive-thirdparty.googleusercontent.com/32/type/video/mp4
  // https://drive-thirdparty.googleusercontent.com/32/type/image/png
  // https://drive-thirdparty.googleusercontent.com/32/type/audio/mpeg
  // https://drive-thirdparty.googleusercontent.com/32/type/text/markdown
  icon: "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_3_pdf_x32.png",
  name: {
    en: "GG Drive - Download PDF",
    vi: "GG Drive - Tải PDF",
  },
  description: {
    en: "Download google drive PDF file that dont have download button. Pages will be convert to image, cannot edit.",
    vi: "Tải file PDF không có nút download trên google drive. Tải về định dạng hình ảnh, không thể sửa nội dung.",
  },

  whiteList: ["https://drive.google.com/file/d/*"],

  onClick: () => {
    UfsGlobal.DOM.injectScriptSrc(
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

        let pageCount = pageContainers.length;
        if (pageCount === 0) {
          alert("Pdf page not found");
          return;
        }

        let delay = prompt(
          `Tìm được ${pageCount} trang pdf\n\n` +
            "Sẽ bắt đầu quá trình scoll để tải các trang\n" +
            "Scroll trang chậm sẽ hạn chế lỗi không tải được trang pdf\n\n" +
            "Vui lòng nhập độ trễ chuyển trang (ms) (>0):\n",
          50
        );

        if (!delay) return;

        let id = "ufs_ggdrive_downloadPdf";
        let info = document.querySelector("#" + id);

        if (!info) {
          info = document.createElement("div");
          info.id = id;
          info.style = [
            "position: fixed",
            "left: 50%",
            "top: 50%",
            "transform: translate(-50%, -50%)",
            "color: white",
            "background: #000d",
            "border-radius: 5px",
            "padding: 10px",
            "font-size: 20px",
            "z-index: 1000",
          ].join(";");
          info.innerText = "ABC";
          document.body.appendChild(info);
        }

        let startTime = Date.now();
        function formatTime(ms) {
          return new Date(ms).toISOString().slice(11, 19);
        }
        function getTime() {
          return formatTime(Date.now() - startTime);
        }

        for (let i = 0; i < pageCount; i++) {
          let page = pageContainers[i];
          page.scrollIntoView();
          info.innerText =
            `Đang scroll PDF:` +
            `trang ${i + 1}/${pageCount}... (${getTime()}s)`;
          await sleep(delay);
        }

        let canvasElement = document.createElement("canvas");
        let con = canvasElement.getContext("2d");

        if (window.ufs_checkImagesLoadedInterval) {
          clearInterval(window.ufs_checkImagesLoadedInterval);
        }

        window.ufs_checkImagesLoadedInterval = setInterval(() => {
          let imgs = Array.from(
            document.querySelectorAll("img[src^='blob:']")
          ).filter((_) => _.complete);

          info.innerText =
            `Đang đợi các trang load xong: ` +
            `${imgs.length}/${pageCount}` +
            `(${getTime()}s)`;

          let errorPage = Array.from(
            document.querySelectorAll(".ndfHFb-c4YZDc-bN97Pc-u0pjoe-haAclf")
          );

          if (errorPage.length) {
            info.innerText += `\nCó ${errorPage.length} trang không tải được.`;
          }

          if (imgs.length === pageContainers.length) {
            info.innerText = "Đang tạo PDF...";
            clearInterval(window.ufs_checkImagesLoadedInterval);

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
            info.remove();
            pdf.save((document.title || "download") + ".pdf");
          }
        }, 1000);
      }
    );
  },
};
