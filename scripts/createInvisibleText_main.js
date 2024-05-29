import createInvisibleText from "./createInvisibleText.js";

(async () => {
  while (true) {
    await createInvisibleText.popupScript.onClick();
  }
})();
