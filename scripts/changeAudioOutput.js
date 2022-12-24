export default {
  icon: '<i class="fa-solid fa-headphones fa-lg"></i>',
  name: {
    en: "Audio output switcher",
    vi: "Thay đổi đầu ra âm thanh",
  },
  description: {
    en: "Pick a default audio output device, customizable for each browser tab.",
    vi: "Thay đổi đầu ra âm thanh của trang web đang mở.\nMỗi tab có thể chọn đầu ra khác nhau (tai nghe/loa).",
  },

  // Fb Post: https://www.facebook.com/groups/j2team.community/posts/1362716140727169
  // Source: https://gist.github.com/monokaijs/44ef4bd0770f83272b83c038a2769c90
  onClick: async () => {
    let key = "ufs-audio-output-switcher";
    let exist = document.querySelector("#" + key);
    if (exist) {
      exist.style.display = "";
      return;
    }

    if (
      !confirm(
        "Vui lòng cho phép truy cập audio/video để chức năng có thể chạy."
      )
    )
      return;

    function disableBtn(btn, disable = true) {
      if (disable) {
        btn.classList.add("disabled");
        btn.disabled = true;
      } else {
        btn.classList.remove("disabled");
        btn.disabled = false;
      }
    }

    let popupParent = document.createElement("div");
    popupParent.id = key;
    popupParent.className = "ufs-change-audio-output";

    /* navigation bar */
    let navbar = document.createElement("div");
    navbar.className = "navbar";

    let closeButton = document.createElement("button");
    closeButton.className = "close-btn";
    closeButton.innerText = "Close";
    closeButton.onclick = function (e) {
      popupParent.style.display = "none";
    };
    navbar.appendChild(closeButton);

    /* PLEASE DO NOT REMOVE CREDIT LINE */
    let popupTitle = document.createElement("div");
    popupTitle.className = "title";
    popupTitle.innerHTML =
      "SoundSwitcher - by <a href='https://north.studio' target='_blank'>NorthStudio</a>";
    navbar.appendChild(popupTitle);

    let titleLink = popupTitle.querySelector("a");
    titleLink.className = "title-link";

    let popupContent = document.createElement("div");
    popupContent.className = "popup-content";

    let bottomArea = document.createElement("div");
    bottomArea.className = "bottom-area";

    let submitButton = document.createElement("button");
    submitButton.className = "submit-btn";
    submitButton.innerText = "Waiting for permission...";
    disableBtn(submitButton);

    submitButton.onclick = async function (e) {
      if (submitButton.disabled) return;
      let audio_video = Array.from(document.querySelectorAll("audio,video"));

      if (!audio_video.length)
        return alert("Không tìm thấy âm thanh/video nào trong trang web");

      submitButton.innerText = "Setting...";
      disableBtn(submitButton);
      for (let el of audio_video) {
        await el.setSinkId(deviceSelector.value);
      }
      submitButton.innerText = "Set Device";
      disableBtn(submitButton, false);
    };

    bottomArea.appendChild(submitButton);

    let deviceSelector = document.createElement("select");
    deviceSelector.className = "device-selector";

    popupContent.appendChild(bottomArea);
    popupParent.appendChild(navbar);
    popupParent.appendChild(popupContent);
    document.body.appendChild(popupParent);
    UsefulScriptGlobalPageContext.DOM.injectCssFile(
      await UsefulScriptGlobalPageContext.Extension.getURL(
        "scripts/changeAudioOutput.css"
      )
    );

    // ====================== Main ======================
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    submitButton.innerText = "Set Device";
    disableBtn(submitButton, false);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices = devices.filter((x) => x.kind === "audiooutput");
      devices.forEach((device) => {
        let choice = document.createElement("option");
        choice.innerText = device.label;
        choice.value = device.deviceId;
        deviceSelector.appendChild(choice);
      });
      popupContent.appendChild(deviceSelector);
    });
  },
};
