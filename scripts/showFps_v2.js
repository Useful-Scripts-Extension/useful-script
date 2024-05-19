export default {
  icon: '<i class="fa-solid fa-gauge-high fa-lg"></i>',
  name: {
    en: "Show FPS - ver 2",
    vi: "Hiện thị FPS - ver 2",
  },
  description: {
    en: "Show frames per second of current website (use debugger)",
    vi: "Hiện thị tốc độ khung hình của trang web hiện tại (sử dụng debugger)",
  },

  changeLogs: {
    "2024-05-19": "init",
  },

  popupScript: {
    onClick: async () => {
      const {
        attachDebugger,
        detachDebugger,
        sendDevtoolCommand,
        getCurrentTab,
      } = await import("./helpers/utils.js");

      try {
        const tab = await getCurrentTab();
        await attachDebugger(tab);
        let res = await sendDevtoolCommand(tab, "Overlay.setShowFPSCounter", {
          show: true,
        });
        console.log(res);
        // await detachDebugger(tab);
      } catch (e) {
        alert(e);
      }
    },
  },
};
