export const passStorageKey = "auto_lock_website_manager_password";
export const lockedWebsiteKey = "auto_lock_website_lockedWebsites";

export async function initPassword(createNew = false) {
  const { t } = await import("../popup/helpers/lang.js");
  const { Storage } = await import("./helpers/utils.js");

  if (!createNew) {
    let pass = await getCurPass();
    if (pass) return true;
  }

  const { value: newPass } = await Swal.fire({
    title: t({ vi: "Tạo mật khẩu mới", en: "Create new password" }),
    icon: "info",
    input: "password",
    html: t({
      vi: `Mật khẩu này dùng để mở khoá trang quản lý<br/>
      và mở khoá các trang web<br/>
      <p style="color:red">Hãy nhớ kỹ mật khẩu này</p>`,
      en: `Used to open manager<br/>
      and unlock websites<br/>
      <p style="color:red">Please remember this password</p>`,
    }),
    showCancelButton: true,
  });
  if (newPass) {
    await Storage.set(passStorageKey, newPass);
    return true;
  }
  return false;
}

async function getCurPass() {
  const { Storage } = await import("./helpers/utils.js");
  let curPass = await Storage.get(passStorageKey);
  return curPass;
}

export async function checkPass(reason) {
  const { t } = await import("../popup/helpers/lang.js");

  let curPass = await getCurPass();
  if (curPass == null) return "not init";

  const { value: pass } = await Swal.fire({
    icon: "info",
    title: t({
      vi: "Nhập mật khẩu" + t(reason),
      en: "Enter password" + t(reason),
    }),
    input: "password",
    inputPlaceholder: t({
      vi: "Nhập mật khẩu",
      en: "Enter password",
    }),
    inputAttributes: {
      autocapitalize: "off",
      autocorrect: "off",
    },
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return t({
          vi: "Vui lòng nhập mât khẩu",
          en: "Please enter password!",
        });
      }
    },
  });

  if (pass === curPass) return true;
  if (pass != null) {
    await Swal.fire(
      t({ vi: "Sai mật khẩu", en: "Wrong password!" }),
      "",
      "error"
    );
  }
  return false;
}

export default {
  icon: '<i class="fa-solid fa-fingerprint fa-lg fa-beat-fade"></i>',
  name: {
    en: "Auto lock websites",
    vi: "Tự động khoá trang web",
  },
  description: {
    en: `Auto lock websites. Enter password to unlock.<br/>
    <ul>
      <li>Click to temporarly lock current website.</li>
      <li>Click ? to open settings.</li>
    </ul>`,
    vi: `Tự động khoá trang web. Nhập mật khẩu để mở khoá.<br/>
    <ul>
      <li>Click để khoá trang hiện tại.</li>
      <li>Bấm ? để mở giao diện quản lý.</li>
    </ul>`,
  },

  changeLogs: {
    "2024-05-20": "init",
  },

  infoLink: async function openManager() {
    let curPass = await getCurPass();
    if (curPass == null) {
      curPass = await initPassword();
    }
    if (curPass) {
      window.open("/scripts/auto_lockWebsite.html", "_self");
    }
  },

  popupScript: {
    onEnable: async () => {
      const initPassSuccess = await initPassword();
      return initPassSuccess;
    },
    onDisable: async () => {
      const { Storage } = await import("./helpers/utils.js");
      let res = await checkPass({
        vi: " để tắt chức năng",
        en: " to disable feature",
      });
      if (res === true) {
        await Storage.remove(passStorageKey);
        await Storage.remove(lockedWebsiteKey);
        return true;
      }
      return false;
    },

    onClick: () => {},
  },

  contentScript: {
    onDocumentStart: () => {
      const locker = {
        KEYS: {
          pass: "auto_lock_website_manager_password",
          sites: "auto_lock_website_lockedWebsites",
        },
        getLockedWebsites: async () => {
          let key = locker.KEYS.sites;
          let data = await chrome.storage.local.get([key]);
          let sites = data?.[key] || [];
          return sites;
        },
        addLockedWebsite: async (site) => {
          let key = locker.KEYS.sites;
          let currentSites = await locker.getLockedWebsites();
          if (currentSites.includes(site)) return false;
          currentSites.push(site);
          await chrome.storage.local.set({ [key]: currentSites });
          return true;
        },
        removeLockedWebsite: async (site) => {
          let key = locker.KEYS.sites;
          let currentSites = await locker.getLockedWebsites();
          if (!currentSites.includes(site)) return false;
          currentSites = currentSites.filter((s) => s !== site);
          await chrome.storage.local.set({ [key]: currentSites });
          return true;
        },
        getPass: async () => {
          let key = locker.KEYS.pass;
          let data = await chrome.storage.local.get([key]);
          let pass = data?.[key];
          return pass;
        },
        lock: (pass) => {
          const id = "ufs_auto_lock_website_overlay";
          const idStyle = id + "-style";

          function remove() {
            document.querySelector(`#${id}`)?.remove?.();
            document.querySelector(`#${idStyle}`)?.remove?.();
          }

          function lockAgain() {
            let overlay = document.querySelector(`#${id}`);
            let style = document.querySelector(`#${idStyle}`);
            if (!overlay || !style) return;
            overlay.style.top = "0";
            style.disabled = false;
          }

          const exist = document.getElementById(id);
          if (exist) {
            lockAgain();
            return;
          }

          const style = document.createElement("style");
          style.id = idStyle;
          style.textContent = /*css*/ `
            * :not(#${id}, #${id} *) {
              display: none !important;
            }
          `;
          document.head.appendChild(style);

          const overlay = document.createElement("div");
          overlay.id = id;
          overlay.innerHTML = /* html */ `
            <h1>This websites has been Locked</h1>
            <input id="password" type="password" placeholder="Enter password to unlock.." autocomplete="new-password" />
            <div id="unlock-temporarly-container" title="Enable to unlock temporarly => will lock again if website reload">
              <input id="unlock-temporarly" type="checkbox" />
              <label for="unlock-temporarly" >Unlock temporarly</label>
            </div>
            <style>
              #${id} {
                position: fixed;
                top: -100vh;
                left: 0;
                width: 100vw;
                height: 100vh;
                margin: 0;
                padding: 0;
                background-color: #112;
                z-index: 2147483647;
                opacity: 0;
                transition: all 0.3s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
              }
              #${id} > h1 {
                color: #ddd;
                font-size: 30px;
                text-align: center;
                font-family: monospace;
              }
              #${id} #unlock-temporarly-container {
                color: #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
              }
              #${id} #unlock-temporarly {
                width: 20px;
                height: 20px;
                padding: 0;
                margin: 0px;
                border: 1px solid #999;
                background-color: #e6e6e6;
                margin-right: 10px;
              }
              #${id} #unlock-temporarly:hover {
                background-color: #ccc;
              }
              #${id} #unlock-temporarly:active {
                background-color: #04aa6d;
              }
              #${id} > input {
                letter-spacing: normal;
                margin-top: 20px;
                font-size: 20px;
                padding: 10px;
                border-radius: 5px;
                border: none;
                outline: none;
                text-align: center;
                color: #ddd;
                background-color: #282828de;
                width: 400px;
              }
              #${id} > input:focus {
                background-color: #282828;
                box-shadow: 0px 5px 5px #555;
              }
              #${id} label {
                color: #ccc !important;
                background-color: transparent !important;
              }
            </style>
          `;
          setTimeout(() => {
            overlay.style.opacity = "1";
            overlay.style.top = "0px";
          }, 0);
          document.documentElement.appendChild(overlay);

          const unlockTemporarly = overlay.querySelector(
            "input#unlock-temporarly"
          );
          const inputPass = overlay.querySelector("input#password");
          inputPass.addEventListener("input", (e) => {
            if (e.target.value == pass) {
              // remove();
              overlay.style.top = "-100vh";
              style.disabled = true;
              inputPass.value = "";

              if (!unlockTemporarly.checked) {
                locker.removeLockedWebsite(location.hostname);
              }
            }
          });
        },
      };

      window.ufs_auto_lock_website = locker;

      locker.getPass().then((pass) => {
        if (pass != null) {
          locker.getLockedWebsites().then((websites) => {
            let hostname = location.hostname;
            if (websites.includes(hostname)) {
              locker.lock(pass);
            }
          });
        }
      });
    },
    onClick: async () => {
      if (!window.ufs_auto_lock_website) {
        alert(
          "Chưa bật chức năng\n\n" +
            "Vui lòng bật chức năng và tải lại trang web trước."
        );
        return;
      }

      let password = await window.ufs_auto_lock_website.getPass();
      if (password == null) {
        alert(
          "Bạn chưa tạo mật khẩu, Vui lòng bật chức năng và tạo mật khẩu trước"
        );
        return;
      }
      window.ufs_auto_lock_website.lock(password);
      window.ufs_auto_lock_website.addLockedWebsite(location.hostname);
    },
  },
};
