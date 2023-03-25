import { showLoading } from "./helpers/utils.js";

export default {
  icon: "",
  name: {
    en: "Test",
    vi: "Test",
  },
  description: {
    en: "",
    vi: "",
  },

  onClickExtension: async () => {
    let { setLoadingText, closeLoading } = showLoading("Đang chuẩn bị...");
    try {
      let url =
        "https://app.baseten.co/applications/1Bbgjg0/draft/worklets/M0kMMkq/invoke";
      let resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          worklet_input: {
            prompt: "An astronaut riding a horse on mars",
          },
        }),
      });
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
