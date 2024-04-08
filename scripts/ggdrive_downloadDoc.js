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

        const [currentPage, totalPage] =
          document
            .querySelector(".jfk-tooltip-contentId")
            ?.textContent?.split(" / ") ?? [];

        const sleep = (ms = 0) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        // scroll to first page
        const contanier = document.querySelector(
          ".kix-rotatingtilemanager.docs-ui-hit-region-surface"
        );
        contanier?.scrollIntoView?.({ block: "start", behavior: "instant" });

        await sleep(500);

        // get first page
        let canvas = document.querySelector("canvas");
        if (!canvas) {
          alert("Docs page not found");
          return;
        }

        let pdf;
        while (canvas) {
          // scroll current page into view => to load next page
          canvas.scrollIntoView({ block: "start", behavior: "instant" });
          await sleep(500);

          // capture canvas page to pdf
          if (canvas.width && canvas.height) {
            let imgData = canvas.toDataURL("image/jpeg", 1.0);
            if (!pdf) {
              let ori = canvas.width > canvas.height ? "l" : "p";
              pdf = new jsPDF({
                orientation: ori,
                unit: "px",
                format: [canvas.width, canvas.height],
                hotfixes: ["px_scaling"],
              });
            }
            pdf.addImage(imgData, "JPEG", 0, 0);
          }

          // query next canvas
          let listCanvas = Array.from(document.querySelectorAll("canvas"));
          let nextCanvas = null;
          for (let c of listCanvas) {
            if (
              c != canvas &&
              c.getBoundingClientRect().top > canvas.getBoundingClientRect().top
            ) {
              nextCanvas = c;
              break;
            }
          }
          canvas = nextCanvas;

          // prepare next pdf page
          if (canvas) {
            pdf.addPage([canvas.width, canvas.height]);
          }
        }
        pdf.save((document.title || "download") + ".pdf");
      }
    );
  },
};
