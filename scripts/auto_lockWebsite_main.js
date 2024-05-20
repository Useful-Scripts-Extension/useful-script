import { t } from "../popup/helpers/lang.js";
import { Storage } from "./helpers/utils.js";
import { checkPass } from "./auto_lockWebsite.js";

const passStorageKey = "auto_lock_website_manager_password";
const lockedWebsiteKey = "auto_lock_website_lockedWebsites";

async function renderSites() {
  let sites = await Storage.get(lockedWebsiteKey, []);

  sites.forEach((site) => {
    let div = document.createElement("div");
    div.classList.add("sites-container");
    div.innerHTML = `
        <div class="site">
            <p>${site}</p>
            <button class="removeBtn">Remove</button>
        </div>
    `;
    let removeBtn = div.querySelector(".removeBtn");
    removeBtn.addEventListener("click", async () => {
      let { isConfirmed } = await Swal.fire({
        title: t({
          vi: "Mở khoá trang web " + site + "?",
          en: "Unlock " + site + "?",
        }),
        showCancelButton: true,
        confirmButtonText: t({ vi: "Mở khoá", en: "Unlock" }),
        cancelButtonText: t({ vi: "Huỷ", en: "Cancel" }),
      });
      if (isConfirmed) {
        let index = sites.indexOf(site);
        sites.splice(index, 1);
        await Storage.set(lockedWebsiteKey, sites);
        div.remove();
      }
    });
    document.body.appendChild(div);
  });
}

checkPass().then((res) => {
  if (res === true) {
    renderSites();
  } else {
    if (window.history.length) {
      window.history.back();
    } else {
      window.close();
    }
  }
});
