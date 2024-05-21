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
    let curPass = await locker.password.get();
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
      let res = await checkPass({
        vi: " để tắt chức năng",
        en: " to disable feature",
      });
      if (res !== true) return false;
      await locker.password.remove();
      await locker.sites.clear();
      return true;
    },
  },

  contentScript: {
    onDocumentStart: async () => {
      const pass = await locker.password.get();
      if (pass != null) {
        const sites = await locker.sites.get();
        if (sites.length > 0) {
          let hostname = location.hostname;
          let matchedPattern = matchOneOfPatterns(hostname, sites);
          if (matchedPattern) lockCurrentWebsite(pass, matchedPattern);
        }
      }
    },
    onClick: async () => {
      try {
        let password = await locker.password.get();
        if (password == null) {
          alert(
            "Bạn chưa tạo mật khẩu, Vui lòng bật chức năng và tạo mật khẩu trước"
          );
          return;
        }
        lockCurrentWebsite(password);
        locker.sites.add(location.hostname);
      } catch (e) {
        console.error(e);
      }
    },
  },
};

export const _storage = {
  async get(key) {
    let data = await chrome.storage.local.get([key]);
    let pass = data?.[key];
    return pass;
  },
  async set(key, value) {
    await chrome.storage.local.set({ [key]: value });
    return true;
  },
  async remove(key) {
    await chrome.storage.local.remove(key);
    return true;
  },
};

export const locker = {
  password: {
    storageKey: "auto_lock_website_manager_password",
    get() {
      return _storage.get(this.storageKey);
    },
    set(pass) {
      return _storage.set(this.storageKey, pass);
    },
    remove() {
      return _storage.remove(this.storageKey);
    },
  },
  sites: {
    storageKey: "auto_lock_website_lockedWebsites",
    get() {
      return _storage.get(this.storageKey) || [];
    },
    async add(site) {
      let currentSites = await this.get();
      if (currentSites.includes(site)) return false;
      currentSites.unshift(site);
      await _storage.set(this.storageKey, currentSites);
      return true;
    },
    async remove(site) {
      let key = this.storageKey;
      let currentSites = await this.get();
      if (!currentSites.includes(site)) return false;
      currentSites = currentSites.filter((s) => s !== site);
      await _storage.set(key, currentSites);
      return true;
    },
    async clear() {
      await _storage.remove(this.storageKey);
    },
  },
};

export async function initPassword(createNew = false) {
  const { t } = await import("../popup/helpers/lang.js");

  if (!createNew) {
    let pass = await locker.password.get();
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
    await locker.password.set(newPass);
    return true;
  }
  return false;
}

export async function checkPass(reason) {
  const { t } = await import("../popup/helpers/lang.js");

  let curPass = await locker.password.get();
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

function matchOneOfPatterns(url, patterns) {
  for (let pattern of patterns) {
    const regex = new RegExp(
      pattern
        .split("*")
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join(".*")
    );
    if (regex.test(url)) return pattern;
  }
  return false;
}

function lockCurrentWebsite(pass, matchedPattern) {
  const id = "ufs_auto_lock_website_overlay";
  const idStyle = id + "-style";

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

  const unlockTemporarly = overlay.querySelector("input#unlock-temporarly");
  const inputPass = overlay.querySelector("input#password");
  inputPass.addEventListener("input", (e) => {
    if (e.target.value == pass) {
      overlay.style.top = "-100vh";
      style.disabled = true;
      inputPass.value = "";

      if (!unlockTemporarly.checked) {
        locker.sites.remove(matchedPattern);
      }
    }
  });
}
