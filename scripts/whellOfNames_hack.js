export default {
  icon: "https://wheelofnames.com/icons/favicon-96x96.png",
  name: {
    en: "Hack Wheel of Names",
    vi: "Hack Wheel of Names",
  },
  description: {
    en: "Hack result of Wheel of Names, choose your target, then result will always be your target.",
    vi: "Hack kết quả trang web Wheel of Names, luôn ra kết quả bạn mong muốn thay vì ngẫu nhiên.",
  },
  whiteList: ["https://wheelofnames.com/*"],

  // https://gist.github.com/HoangTran0410/0b7763cb1f318c209d0cf18865579748
  onClick: () => {
    if (!window.ufs_originalRandom) {
      window.ufs_originalRandom = Math.random;
    }

    let key = "ufs-whellofnames-target";
    let old_target = localStorage.getItem(key) || "";
    let target = prompt(
      `HACK Wheel of Names\n\nNhập kết quả mong muốn:\nĐể rỗng nếu muốn kết quả ngẫu nhiên trở lại.`,
      old_target
    );

    localStorage.setItem(key, target);

    if (!target && old_target) {
      Math.random = window.ufs_originalRandom;
      alert("Đã reset chức năng. Kết quả quay sẽ ngẫu nhiên trở lại");
    } else {
      let values = document
        .querySelector(".basic-editor")
        .innerText.split("\n")
        .filter((_) => _);

      let targetIndex = values.indexOf(target);
      if (targetIndex === -1) {
        alert(
          "Không tìm thấy kết quả mong muốn. Kết quả sẽ ngẫu nhiên trở lại"
        );
        Math.random = window.ufs_originalRandom;
      } else {
        alert(`Xong. Kết quả sẽ luôn là '${target}'`);
        let realIndex = targetIndex - 3;
        if (realIndex < 0) realIndex = values.length + realIndex;

        Math.random = () => realIndex / values.length;
      }
    }
  },
};
