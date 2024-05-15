export default {
  icon: '<i class="fa-solid fa-fingerprint fa-lg"></i>',
  name: {
    en: "Auto lock websites",
    vi: "Tự động khoá trang web",
  },
  description: {
    en: `Auto lock websites after no activity for 5 minutes. Enter password to unlock.<br/>
    <ul>
      <li>Can custom time / password / websites to lock.</li>
      <li>Single click to lock current website.</li>
      <li>Click ? to open settings.</li>
    </ul>`,
    vi: `Tự động khoá trang web nếu không hoạt động trong 5 phút. Nhập mật khẩu để mở khoá.<br/>
    <ul>
      <li>Có thể tuỳ chỉnh thời gian / mật khẩu / trang web muốn khoá.</li>
      <li>Click để khoá trang hiện tại.</li>
      <li>Bấm ? để mở giao diện quản lý.</li>
    </ul>`,
  },

  infoLink: () => {},

  changeLogs: {
    "2024-05-15": "init",
  },

  popupScript: {
    onEnable: () => {},
    onDisable: () => {},
  },

  contentScript: {
    onClick: () => {
      const id = "ufs_auto_lock_website_overlay";
      const idStyle = id + "-style";

      function remove() {
        document.querySelector(`#${id}`)?.remove?.();
        document.querySelector(`#${idStyle}`)?.remove?.();
      }

      const exist = document.getElementById(id);
      if (exist) {
        // TODO need enter password
        remove();
        return;
      }

      const style = document.createElement("style");
      style.id = idStyle;
      // * :not(#${id}, #${id} *) {
      //   display: none !important;
      // }
      style.textContent = /*css*/ `
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
        #${id} > input {
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
      `;
      document.head.appendChild(style);

      const overlay = document.createElement("div");
      overlay.id = id;
      overlay.innerHTML = /* html */ `
        <h1>Useful Script - Auto lock websites</h1>
        <input id="password" type="password" placeholder="Enter password to unlock.." />
      `;
      setTimeout(() => {
        overlay.style.opacity = "1";
        overlay.style.top = "0px";
      }, 0);
      document.documentElement.appendChild(overlay);

      const input = overlay.querySelector("input");
      input.addEventListener("input", (e) => {
        if (e.target.value == "123456") {
          // remove();
          overlay.style.top = "-100vh";
          overlay.style.opacity = "0";
        }
      });
    },
  },
};
