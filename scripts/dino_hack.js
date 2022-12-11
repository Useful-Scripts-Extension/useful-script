export default {
  icon: "https://chromedino.com/favicon.ico",
  name: {
    en: "Enable/Disable Hack T-Rex Dino Game",
    vi: "Bật/Tắt Hack game T-Rex Dino",
  },
  description: {
    en: "A bot that plays the Google Chrome T-Rex game for you",
    vi: "Tự động chơi game Google Chrome T-Rex",
  },
  runInExtensionContext: false,

  onClick: function () {
    // https://github.com/danpush/t-rex-game-bot

    function hack() {
      //prettier-ignore
      function keyDown(e){Podium={};var n=document.createEvent("KeyboardEvent");Object.defineProperty(n,"keyCode",{get:function(){return this.keyCodeVal}}),n.initKeyboardEvent?n.initKeyboardEvent("keydown",!0,!0,document.defaultView,e,e,"","",!1,""):n.initKeyEvent("keydown",!0,!0,document.defaultView,!1,!1,!1,!1,e,0),n.keyCodeVal=e,document.body.dispatchEvent(n)}
      //prettier-ignore
      function keyUp(e){Podium={};var n=document.createEvent("KeyboardEvent");Object.defineProperty(n,"keyCode",{get:function(){return this.keyCodeVal}}),n.initKeyboardEvent?n.initKeyboardEvent("keyup",!0,!0,document.defaultView,e,e,"","",!1,""):n.initKeyEvent("keyup",!0,!0,document.defaultView,!1,!1,!1,!1,e,0),n.keyCodeVal=e,document.body.dispatchEvent(n)}

      let timeoutId = setInterval(function () {
        Runner.instance_.horizon.obstacles.length > 0 &&
          (Runner.instance_.horizon.obstacles[0].xPos <
            20 * Runner.instance_.currentSpeed -
              Runner.instance_.horizon.obstacles[0].width / 2 &&
            Runner.instance_.horizon.obstacles[0].yPos > 75 &&
            (keyUp(40), keyDown(38)),
          Runner.instance_.horizon.obstacles[0].xPos <
            20 * Runner.instance_.currentSpeed -
              Runner.instance_.horizon.obstacles[0].width / 2 &&
            Runner.instance_.horizon.obstacles[0].yPos <= 75 &&
            keyDown(40));
      }, 5);

      return () => {
        clearInterval(timeoutId);
      };
    }

    if (window.Runner) {
      if (window.ufsDisableHackDino) {
        window.ufsDisableHackDino?.();
        alert("Đã TẮT hack game dino.");
      } else {
        window.ufsDisableHackDino = hack();
        alert("Đã bật HACK game dino.");
      }
    } else {
      let urls = [
        "https://chromedino.com/",
        "https://elgoog.im/t-rex/?bot",
        "https://offline-dino-game.firebaseapp.com/",
        "https://fivesjs.skipser.com/trex-game/",
      ];
      let selected = prompt(
        "Không tìm thấy game. Hãy chạy game rồi bật lại hack." +
          "\n\nHoặc chọn 1 trong các trang web sau để chơi:\n" +
          urls.map((_, i) => `  ${i}: ${_}`).join("\n")
      );

      if (selected == null) return;
      window.open(urls[selected]);
    }
  },
};

export const shared = {};
