export default {
  icon: "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.document",
  name: {
    en: "GG Drive - Download Document (to PDF)",
    vi: "GG Drive - Tải Document (sang PDF)",
  },
  description: {
    en: "Download google drive Document file that dont have download button. Pages will be convert to PDF, cannot edit.",
    vi: "Tải file Doc không có nút download trên google drive. Tải về định dạng PDF, không thể sửa nội dung.",
  },

  whiteList: ["https://docs.google.com/document/*"],

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

        if (
          !confirm(
            "Để tool có thể tải tất cả các trang\nBạn hãy chắc chắn đã scroll lên trang docs đầu tiên\n\nOK để tiếp tục\nCancel để huỳ"
          )
        )
          return;

        const totalPage = Number(
          document
            .querySelector(".jfk-tooltip-contentId")
            ?.textContent?.split(" / ")?.[1]
        );

        const sleep = (ms = 0) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        let canvasQueue = Array.from(document.querySelectorAll("canvas"));
        let currentY = 0;

        let pageCount = canvasQueue.length;
        if (pageCount === 0) {
          alert("Docs page not found");
          return;
        }

        let pdf;
        while (canvasQueue.length) {
          let can = canvasQueue.shift();
          can.scrollIntoView({ block: "center" });

          if (can.width && can.height) {
            await sleep(500);
            currentY = Math.max(can.getBoundingClientRect().bottom, currentY);

            let imgData = can.toDataURL("image/jpeg", 1.0);
            if (!pdf) {
              let ori = can.width > can.height ? "l" : "p";
              pdf = new jsPDF({
                orientation: ori,
                unit: "px",
                format: [can.width, can.height],
                hotfixes: ["px_scaling"],
              });
            }
            pdf.addImage(imgData, "JPEG", 0, 0);
            pdf.addPage([can.width, can.height]);
          }

          // query new canvas
          let newCanvas = Array.from(document.querySelectorAll("canvas"));
          newCanvas.forEach((c) => {
            let y = c.getBoundingClientRect().bottom;
            if (y >= currentY && c != can && !canvasQueue.includes(c))
              canvasQueue.push(c);
          });
        }
        pdf.save((document.title || "download") + ".pdf");
      }
    );
  },
};
