import {
  attachDebugger,
  detachDebugger,
  getCurrentTab,
  sendDevtoolCommand,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: `https://lh3.googleusercontent.com/qz7_-nogEpLsoxevV_IQbz0UesDFWsbmKyv_vOGUhMRSu6pEYAJCUM50QkTBvw8saVNSmwB0DBpLSBZgfpmAYL3bgh4=w128-h128-e365-rj-sc0x00ffffff`,
  name: {
    en: "Web to PDF",
    vi: "In web ra PDF",
  },
  description: {
    en: "Convert current website to PDF",
    vi: "Chuyển trang web hiện tại thành PDF",
  },

  onClickExtension: async function () {
    const { downloadURL } = UsefulScriptGlobalPageContext.Utils;

    const { setLoadingText, closeLoading } = showLoading("Đang tạo PDF...");
    let tab = await getCurrentTab();
    try {
      // https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-printToPDF
      await attachDebugger(tab);
      let res = await sendDevtoolCommand(tab, "Page.printToPDF", {
        // displayHeaderFooter: true,
        printBackground: true,
      });
      await detachDebugger(tab);

      // https://stackoverflow.com/a/59352848/11898496
      downloadURL("data:application/pdf;base64," + res.data, "web.pdf");
    } catch (e) {
      if (
        confirm(
          "Lỗi: " +
            e +
            "\n\nBạn có muốn dùng phương án 2? Dùng trang web web2pdfconvert?"
        )
      ) {
        window.open("https://www.web2pdfconvert.com#" + tab.url);
      }
    }
    closeLoading();
  },
};
