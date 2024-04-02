/**
 * Some web pages use attachShadow closed mode and need to be open to obtain the video tag, such as Baidu Cloud Disk
 * Solution reference:
 * https://developers.google.com/web/fundamentals/web-components/shadowdom?hl=zh-cn#closed
 * https://stackoverflow.com/questions/54954383/override-element-prototype-attachshadow-using-chrome-extension
 */
export function hackAttachShadow() {
  if (window._hasHackAttachShadow_) return;
  try {
    window._shadowDomList_ = [];
    window.Element.prototype._attachShadow =
      window.Element.prototype.attachShadow;
    window.Element.prototype.attachShadow = function () {
      const arg = arguments;
      if (arg[0] && arg[0].mode) {
        // Force open mode
        arg[0].mode = "open";
      }
      const shadowRoot = this._attachShadow.apply(this, arg);
      // Save a copy of shadowDomList
      window._shadowDomList_.push(shadowRoot);

      /* Allow elements inside shadowRoot to have access to shadowHost */
      shadowRoot._shadowHost = this;

      // Add the addShadowRoot custom event below the document
      const shadowEvent = new window.CustomEvent("addShadowRoot", {
        shadowRoot,
        detail: {
          shadowRoot,
          message: "addShadowRoot",
          time: new Date(),
        },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(shadowEvent);

      return shadowRoot;
    };
    window._hasHackAttachShadow_ = true;
  } catch (e) {
    console.error("hackAttachShadow error by h5player plug-in", e);
  }
}
