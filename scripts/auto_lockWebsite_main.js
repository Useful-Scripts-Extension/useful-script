import { t } from "../popup/helpers/lang.js";
import { Storage } from "./helpers/utils.js";
import {
  checkPass,
  initPassword,
  lockedWebsiteKey,
} from "./auto_lockWebsite.js";

async function addSite(site) {
  let sites = await Storage.get(lockedWebsiteKey, []);
  if (sites.includes(site)) return;
  sites.unshift(site);
  await Storage.set(lockedWebsiteKey, sites);
}

async function renderSites() {
  let sites = await Storage.get(lockedWebsiteKey, []);

  const containerClass = "sites-container";
  const exist = document.querySelector("." + containerClass);
  if (exist) exist.remove();

  let container = document.createElement("div");
  container.classList.add(containerClass);

  if (!sites.length) {
    container.innerHTML = t({
      vi: "Không có website nào bị khoá",
      en: "No website is locked",
    });
  }

  sites.forEach((site) => {
    let div = document.createElement("div");
    div.classList.add("site");
    div.innerHTML += `
      <p>${site}</p>
      <button class="button">${t({
        vi: "Mở khoá",
        en: "Unlock",
      })}</button>
    `;
    let removeBtn = div.querySelector(".button");
    removeBtn.addEventListener("click", () => {
      Swal.fire({
        title: t({
          vi: "Mở khoá trang web " + site + "?",
          en: "Unlock " + site + "?",
        }),
        showCancelButton: true,
        confirmButtonText: t({ vi: "Mở khoá", en: "Unlock" }),
        cancelButtonText: t({ vi: "Huỷ", en: "Cancel" }),
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          let index = sites.indexOf(site);
          sites.splice(index, 1);
          Storage.set(lockedWebsiteKey, sites);
          // listener will trigger and re-draw all
          // div.remove();
        }
      });
    });
    container.appendChild(div);
  });

  document.body.appendChild(container);
}

function initAddSite() {
  let addSiteBtn = document.querySelector("#add-site");
  addSiteBtn.innerHTML = t({
    vi: '<i class="fa-solid fa-plus fa-lg"></i> Thêm trang web',
    en: '<i class="fa-solid fa-plus fa-lg"></i> Add website',
  });
  addSiteBtn.addEventListener("click", () => {
    Swal.fire({
      title: t({ vi: "Khoá trang web", en: "Lock website" }),
      inputLabel: t({
        vi: "Nhập link/tên trang web muốn khoá\nVí dụ:\n+ facebook\n+ *.facebook.com\n+ https://www.facebook.com",
        en: "Enter website url/name want to lock\nE.g:\n+ facebook\n+ *.facebook.com\n+ https://www.facebook.com",
      }),
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: t({ vi: "Khoá", en: "Lock" }),
      cancelButtonText: t({ vi: "Huỷ", en: "Cancel" }),
      inputValidator: (value) => {
        if (!value) {
          return t({
            vi: "Vui lòng nhập trang web",
            en: "Please enter website url",
          });
        }
      },
    }).then(({ isConfirmed, value }) => {
      if (!isConfirmed) return;

      let hostname = value;
      // try {
      //   let url = new URL(value);
      //   hostname = url.hostname;
      // } catch (error) {
      //   console.log(error);
      // }
      addSite(hostname);
    });
  });
}

function initChangePass() {
  let changePassBtn = document.querySelector("#change-pass");
  changePassBtn.innerHTML = t({
    vi: '<i class="fa-solid fa-key fa-lg"></i> Đổi mật khẩu',
    en: '<i class="fa-solid fa-key fa-lg"></i> Change password',
  });
  changePassBtn.addEventListener("click", () => {
    initPassword(true).then((res) => {
      if (res) {
        Swal.fire({
          icon: "success",
          title: t({
            vi: "Đổi mật khẩu thành công",
            en: "Change password success",
          }),
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  });
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.close();
  }
}

checkPass({
  vi: " để truy cập trang quản lý",
  en: " to access manager",
}).then((res) => {
  if (res !== true) {
    goBack();
    return;
  }
  initAddSite();
  initChangePass();
  renderSites();
  document.querySelector("#back").addEventListener("click", goBack);
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (changes?.[lockedWebsiteKey]) renderSites();
  });
});
