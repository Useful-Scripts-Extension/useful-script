(async () => {
  try {
    const { MsgType, Events } = await import("../helpers/constants.js");
    const { sendEventToBackground } = await import("../helpers/utils.js");
    sendEventToBackground({
      type: MsgType.runScript,
      event: Events.onDocumentEnd,
    });
  } catch (e) {
    console.log("ERROR: ", e);
  }
})();
