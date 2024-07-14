javascript: (async function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function focusTo(element) {
    element.dispatchEvent(
      new MouseEvent("pointerover", {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
  }

  function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight, {
      // behavior: "smooth",
    });
  }

  const doneKey = "auto-like-done";
  const btns = [];
  while (true) {
    if (!btns.length) {
      let curBtns = Array.from(
        document.querySelectorAll("[aria-label='Bày tỏ cảm xúc']:not(li *)")
      );
      let added = 0;
      for (let btn of curBtns) {
        if (btn.getAttribute(doneKey) === null) {
          btns.push(btn);
          btn.setAttribute(doneKey, true);
          added++;
        }
      }
      if (added === 0) break;
    }

    for (let btn of btns) {
      btn.scrollIntoView({
        block: "center",
        // behavior: "smooth",
      });
      btn.click();
      await sleep(500);
      let loveBtn = document.querySelector("[aria-label='Yêu thích']");
      if (loveBtn) {
        focusTo(loveBtn);
        await sleep(500);
        loveBtn.click();
        await sleep(500);
      }
      btns.splice(btns.indexOf(btn), 1);
    }
    scrollToBottom();
    await sleep(3000);
  }
  alert("xong");
})();
