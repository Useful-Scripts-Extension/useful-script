export default {
  icon: "https://www.online-stopwatch.com/favicon.ico",
  name: {
    en: "Hack Duck race",
    vi: "Hack Duck race",
  },
  description: {
    en: "Hack result of Duck race, always get the result you want",
    vi: "Hack kết quả Duck race, sẽ luôn ra kết quả bạn mong muốn",
    img: "/scripts/duckRage_cheat.png",
  },

  whiteList: ["https://www.online-stopwatch.com/*"],

  onClick: () => {
    let targets = prompt(
      "Nhập các kết quả mong muốn (tên hoặc số):\nCách nhau bởi dấu phẩy ,\n Ví dụ: 1,abc,5,20,test",
      ""
    );
    if (targets === null) return;

    targets = targets
      .split(",")
      .map((_) => _.trim())
      .filter((_) => _);

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
            for (let target of targets) {
              let targetIndex = result.findIndex(
                (i) => i?.name === target || i?.number == target
              );
              if (targetIndex >= 0) {
                let temp = result[0];
                result[0] = result[targetIndex];
                result[targetIndex] = temp;
                break;
              }
            }
          }
          console.log("shuffle", this, result, result[0]);
          return result;
        };
      });
  },
};
