export default {
  icon: '<i class="fa-solid fa-headphones fa-lg"></i>',
  name: {
    en: "Audio output switcher",
    vi: "Thay đổi đầu ra âm thanh",
  },
  description: {
    en: "Pick a default audio output device, customizable for each browser tab.<br/><br/>eg. listen to youtube by headphone in tab 1, play music by external speaker in tab 2.",
    vi: "Thay đổi đầu ra âm thanh của trang web đang mở.<br/>Mỗi tab có thể chọn đầu ra khác nhau (tai nghe/loa).<br/><br/>Ví dụ: nghe youtube bằng tai nghe ở tab 1,<br/>nghe nhạc bằng loa ở tab 2.",
  },
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/1362716140727169/",

  contentScript: {
    // Source: https://gist.github.com/monokaijs/44ef4bd0770f83272b83c038a2769c90
    onClick: () => {
      (async function () {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          alert("Failed to initialize media devices.");
        }
        let popupParent = document.createElement("div");
        /* positioning for the dialog */
        popupParent.style.width = "320px";
        popupParent.style.height = "120px";
        popupParent.style.position = "fixed";
        popupParent.style.left = "50%";
        popupParent.style.top = "50%";
        popupParent.style.marginLeft = "-160px";
        popupParent.style.marginTop = "-60px";
        /* stylizing the dialog */
        popupParent.style.backgroundColor = "#fff";
        popupParent.style.border = "1px solid rgba(0, 0, 0, .08)";
        popupParent.style.zIndex = "999999";

        /* navigation bar */
        let navbar = document.createElement("div");
        navbar.style.width = "100%";
        navbar.style.height = "28px";
        navbar.style.backgroundColor = "rgba(0, 0, 0, .05)";

        let closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.padding = "6px 8px";
        closeButton.style.backgroundColor = "transparent";
        closeButton.style.color = "black";
        closeButton.style.position = "absolute";
        closeButton.style.right = "0";
        closeButton.style.top = "0";
        closeButton.style.border = "none";

        navbar.appendChild(closeButton);

        closeButton.onclick = function (e) {
          popupParent.parentNode.removeChild(popupParent);
        };
        closeButton.onmouseover = function (e) {
          e.target.style.backgroundColor = "#e74c3c";
          e.target.style.color = "white";
        };
        closeButton.onmouseleave = function (e) {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "black";
        };

        /* PLEASE DO NOT REMOVE CREDIT LINE */
        let popupTitle = document.createElement("div");
        popupTitle.innerHTML =
          "SoundSwitcher - by <a href='https://north.studio' target='_blank'>NorthStudio</a>";
        popupTitle.style.fontSize = "12px";
        popupTitle.style.position = "absolute";
        popupTitle.style.left = "6px";
        popupTitle.style.top = "8px";
        navbar.appendChild(popupTitle);

        let titleLink = popupTitle.querySelector("a");
        titleLink.style.fontWeight = "500";
        titleLink.style.textDecoration = "none";

        let popupContent = document.createElement("div");
        popupContent.style.height = "92px";
        popupContent.style.display = "relative";
        popupContent.style.width = "100%";

        let bottomArea = document.createElement("div");
        bottomArea.style.position = "absolute";
        bottomArea.style.left = "10px";
        bottomArea.style.right = "10px";
        bottomArea.style.bottom = "10px";

        let submitButton = document.createElement("button");
        submitButton.style.backgroundColor = "#3498db";
        submitButton.style.color = "#FFF";
        submitButton.style.width = "100%";
        submitButton.style.padding = "6px";
        submitButton.style.border = "none";
        submitButton.style.borderRadius = "3px";
        submitButton.innerText = "Set Device";

        submitButton.onclick = function (e) {
          document.querySelectorAll("audio,video").forEach((el) => {
            el.setSinkId(deviceSelector.value);
          });
        };

        bottomArea.appendChild(submitButton);

        let deviceSelector = document.createElement("select");
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

        deviceSelector.style.margin = "10px";
        deviceSelector.style.padding = "5px";
        deviceSelector.style.width = "calc(100% - 20px)";

        popupContent.appendChild(bottomArea);

        popupParent.appendChild(navbar);
        popupParent.appendChild(popupContent);
        document.body.appendChild(popupParent);
      })();
    },
  },
};
