export default {
  icon: "https://www.online-stopwatch.com/favicon.ico",
  name: {
    en: "Duck race - hack",
    vi: "Duck race - hack",
  },
  description: {
    en: "Hack result of Duck race, always get the result you want",
    vi: "Hack kết quả Duck race, sẽ luôn ra kết quả bạn mong muốn",
    img: "/scripts/duckRage_cheat.png",
  },

  whiteList: ["https://www.online-stopwatch.com/*"],

  onClick: () => {
    const target = prompt("Nhập kết quả mong muốn:", "");
    if (target === null) return;

    let iframe = document.querySelector('iframe[src*="duck-race"]');

    [window, iframe?.contentWindow]
      .filter((_) => _)
      .forEach((win) => {
        if (!win.ufs_duckRace_originalShuffle)
          win.ufs_duckRace_originalShuffle = win.Array.prototype.shuffle;

        win.Array.prototype.shuffle = function () {
          const result = win.ufs_duckRace_originalShuffle.apply(
            this,
            arguments
          );
          if (result?.[0]?.instance) {
            let targetIndex = result.findIndex(
              (i) => i?.name === target || i?.number == target
            );
            if (targetIndex >= 0) {
              let temp = result[0];
              result[0] = result[targetIndex];
              result[targetIndex] = temp;
            }
          }
          console.log("shuffle", this, result, result[0]);
          return result;
        };
      });
  },
};
