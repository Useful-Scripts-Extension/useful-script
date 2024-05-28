export default {
  icon: "https://wheelofnames.com/icons/favicon-96x96.png",
  name: {
    en: "Hack Wheel of Names",
    vi: "Hack Wheel of Names",
  },
  description: {
    en: "Hack result of <ul><li>wheelofnames.com</li><li>wheelrandom.com</li><li>spinthewheel.io</li></ul>always get the result you want.",
    vi: "Hack kết quả trang web <ul><li>wheelofnames.com</li><li>wheelrandom.com</li><li>spinthewheel.io</li></ul>luôn ra kết quả bạn mong muốn.",
  },
  whiteList: [
    "https://wheelofnames.com/*",
    "https://wheelrandom.com/*",
    "https://spinthewheel.io/*",
  ],

  pageScript: {
    // https://gist.github.com/HoangTran0410/0b7763cb1f318c209d0cf18865579748
    onClick: () => {
      if (!window.ufs_originalRandom) {
        window.ufs_originalRandom = Math.random;
      }

      let key = "ufs-whellofnames-target";
      let old_targets = localStorage.getItem(key) || "";
      let targets = prompt(
        `HACK Wheel of Names\n\n
Nhập kết quả mong muốn:\n
Cách nhau bởi dấu phẩy (,)\n
Để rỗng nếu muốn kết quả ngẫu nhiên trở lại.`,
        old_targets
      );

      localStorage.setItem(key, targets);

      function contrain(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
      }

      function getCurrentValues() {
        switch (location.hostname) {
          case "wheelofnames.com":
            return {
              values: document
                .querySelector(".basic-editor")
                ?.innerText?.split("\n")
                ?.filter((_) => _),
              offset: 1,
            };
          case "wheelrandom.com":
            return {
              values: document
                .querySelector("#names")
                ?.innerText?.split("\n")
                ?.filter((_) => _),
              offset: 0,
            };
          case "spinthewheel.io":
            return {
              values: document
                .querySelector("#name0")
                ?.innerText?.split("\n")
                ?.filter((_) => _),
              offset: -1,
            };
          default:
            return {};
        }
      }

      function reset() {
        Math.random = window.ufs_originalRandom;
        if (window.ufs_wheelOfNames_interval)
          clearInterval(window.ufs_wheelOfNames_interval);
        console.log(
          "Không còn tên nào để hack. Kết quả sẽ ngẫu nhiên trở lại."
        );
      }

      function setTarget() {
        let { values = [], offset } = getCurrentValues();

        targets = targets.filter((_) => values.includes(_));
        if (targets.length === 0) {
          reset();
          return;
        }

        let target = targets[0];
        let index = values.indexOf(target);

        if (index >= 0) {
          let realIndex = index + offset;
          if (offset && realIndex >= values.length)
            realIndex = realIndex % values.length;
          if (offset && realIndex < 0) realIndex = realIndex + values.length;

          Math.random = () => contrain(realIndex / values.length, 0, 1);
          console.log(
            `Xong. Kết quả sẽ luôn là '${target}', index: ${realIndex}, Math.random = ${Math.random()}`
          );
        } else {
          reset();
        }
      }

      if (!targets && old_targets) {
        reset();
      } else {
        targets = targets
          .split(",")
          .map((_) => _.trim())
          .filter((_) => _);

        if (window.ufs_wheelOfNames_interval)
          clearInterval(window.ufs_wheelOfNames_interval);

        window.ufs_wheelOfNames_interval = setInterval(() => {
          setTarget();
        }, 500);
      }
    },
  },
};
