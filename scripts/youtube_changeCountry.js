import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: '<i class="fa-solid fa-map-location-dot fa-lg"></i>',
  name: {
    en: "Youtube change country",
    vi: "Đổi quốc gia Youtube",
  },
  description: {
    en: "Change youtube country to view content in other country",
    vi: "Đổi quốc gia youtube để xem nội dung youtube bên các nước khác",
  },
  changeLogs: {
    "2024-07-07": "init",
  },

  whiteList: ["https://*.youtube.com/*"],

  pageScript: {
    onClick: () => {
      const id = "ufs_youtube_changeCountry";
      const exist = document.getElementById(id);
      if (exist) exist.remove();

      const popup = document.createElement("div");
      popup.id = id;
      popup.innerHTML = UfsGlobal.DOM.createTrustedHtml(`
        <style>
          #${id} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999999;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #${id} > div {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
          }
          #${id} select {
            max-width: 250px;
          }
        </style>
        <div>
          <h1>Useful-Scripts</h1>
          <h2>Change youtube contry</h2>
          <br/>
          <select id="ufs_country"></select>
          <button id="ufs_btnApply">Apply</button>
          <br/>
          <input type="checkbox" id="ufs_checkbox" />
          <label for="ufs_checkbox">Remember</label>
        </div>
      `);

      document.body.appendChild(popup);

      const select = popup.querySelector("#ufs_country");
      const saveBtn = popup.querySelector("#ufs_btnApply");
      const rememberCheckbox = popup.querySelector("#ufs_checkbox");

      let str = "";
      for (const contry of countries) {
        const { name, name_en, code } = contry;
        str += `<option value="${code}">${code}: ${name} (${name_en})</option>`;
      }
      select.innerHTML = UfsGlobal.DOM.createTrustedHtml(str);

      let current = getCurrentCountry();
      select.value = countries.find((c) => c.code == current)
        ? current
        : "default";
      saveBtn.onclick = () => {
        changeCountry(select.value, rememberCheckbox.checked);
      };

      popup.onclick = (e) => {
        if (e.target === popup) popup.remove();
      };
    },
  },
};

function changeCountry(value, persist) {
  if (value) {
    let href = "https://www.youtube.com/feed/trending";
    if (persist) {
      if (value !== "default") {
        var date = new Date();
        date.setTime(date.getTime() + 3.154e10);

        document.cookie =
          "s_gl=" +
          value +
          "; path=/; domain=.youtube.com; expires=" +
          date.toGMTString();
      } else {
        document.cookie =
          "s_gl=0; path=/; domain=.youtube.com; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      }

      window.location.href = href;
    } else {
      href += `?persist_gl=0&gl=${value}`;
      window.location.href = href;
    }
  }
}

function getCurrentCountry() {
  const code =
    window?.ytInitialData?.topbar?.desktopTopbarRenderer?.countryCode ||
    window.yt?.config_?.GL ||
    // regex in cookie
    document.cookie.match(/s_gl=([^;]+)/)?.[1];
  return code || "default";
}

const countries = [
  { name: "Ả-Rập Xê-út", code: "SA", name_en: "Saudi Arabia" },
  { name: "Ai Cập", code: "EG", name_en: "Egypt" },
  { name: "Algeria", code: "DZ", name_en: "Algeria" },
  { name: "Áo", code: "AT", name_en: "Austria" },
  { name: "Argentina", code: "AR", name_en: "Argentina" },
  { name: "Azerbaijan", code: "AZ", name_en: "Azerbaijan" },
  { name: "Ấn Độ", code: "IN", name_en: "India" },
  { name: "Ba Lan", code: "PL", name_en: "Poland" },
  { name: "Bahrain", code: "BH", name_en: "Bahrain" },
  { name: "Bangladesh", code: "BD", name_en: "Bangladesh" },
  { name: "Bắc Macedonia", code: "MK", name_en: "North Macedonia" },
  { name: "Belarus", code: "BY", name_en: "Belarus" },
  { name: "Bỉ", code: "BE", name_en: "Belgium" },
  { name: "Bolivia", code: "BO", name_en: "Bolivia" },
  {
    name: "Bosnia và Herzegovina",
    code: "BA",
    name_en: "Bosnia and Herzegovina",
  },
  { name: "Bồ Đào Nha", code: "PT", name_en: "Portugal" },
  { name: "Brazil", code: "BR", name_en: "Brazil" },
  { name: "Bungary", code: "BG", name_en: "Bulgaria" },
  {
    name: "Các Tiểu Vương quốc Ả Rập Thống nhất",
    code: "AE",
    name_en: "United Arab Emirates",
  },
  { name: "Campuchia", code: "KH", name_en: "Cambodia" },
  { name: "Canada", code: "CA", name_en: "Canada" },
  { name: "Chile", code: "CL", name_en: "Chile" },
  { name: "Colombia", code: "CO", name_en: "Colombia" },
  { name: "Costa Rica", code: "CR", name_en: "Costa Rica" },
  { name: "Cộng hoà Dominica", code: "DO", name_en: "Dominican Republic" },
  { name: "Croatia", code: "HR", name_en: "Croatia" },
  { name: "Đài Loan", code: "TW", name_en: "Taiwan" },
  { name: "Đan Mạch", code: "DK", name_en: "Denmark" },
  { name: "Đảo Síp", code: "CY", name_en: "Cyprus" },
  { name: "Đức", code: "DE", name_en: "Germany" },
  { name: "Ecuador", code: "EC", name_en: "Ecuador" },
  { name: "El Salvador", code: "SV", name_en: "El Salvador" },
  { name: "Estonia", code: "EE", name_en: "Estonia" },
  { name: "Georgia", code: "GE", name_en: "Georgia" },
  { name: "Ghana", code: "GH", name_en: "Ghana" },
  { name: "Guatemala", code: "GT", name_en: "Guatemala" },
  { name: "Hà Lan", code: "NL", name_en: "Netherlands" },
  { name: "Hàn Quốc", code: "KR", name_en: "South Korea" },
  { name: "Hoa Kỳ", code: "US", name_en: "United States" },
  { name: "Honduras", code: "HN", name_en: "Honduras" },
  { name: "Hồng Kông", code: "HK", name_en: "Hong Kong" },
  { name: "Hungary", code: "HU", name_en: "Hungary" },
  { name: "Hy Lạp", code: "GR", name_en: "Greece" },
  { name: "Iceland", code: "IS", name_en: "Iceland" },
  { name: "Indonesia", code: "ID", name_en: "Indonesia" },
  { name: "Iraq", code: "IQ", name_en: "Iraq" },
  { name: "Ireland", code: "IE", name_en: "Ireland" },
  { name: "Israel", code: "IL", name_en: "Israel" },
  { name: "Jamaica", code: "JM", name_en: "Jamaica" },
  { name: "Jordan", code: "JO", name_en: "Jordan" },
  { name: "Kazakhstan", code: "KZ", name_en: "Kazakhstan" },
  { name: "Kenya", code: "KE", name_en: "Kenya" },
  { name: "Kuwait", code: "KW", name_en: "Kuwait" },
  { name: "Lào", code: "LA", name_en: "Laos" },
  { name: "Latvia", code: "LV", name_en: "Latvia" },
  { name: "Lebanon", code: "LB", name_en: "Lebanon" },
  { name: "Libya", code: "LY", name_en: "Libya" },
  { name: "Liechtenstein", code: "LI", name_en: "Liechtenstein" },
  { name: "Lithuania", code: "LT", name_en: "Lithuania" },
  { name: "Luxembourg", code: "LU", name_en: "Luxembourg" },
  { name: "Ma-rốc", code: "MA", name_en: "Morocco" },
  { name: "Malaysia", code: "MY", name_en: "Malaysia" },
  { name: "Malta", code: "MT", name_en: "Malta" },
  { name: "Mexico", code: "MX", name_en: "Mexico" },
  { name: "Moldova", code: "MD", name_en: "Moldova" },
  { name: "Montenegro", code: "ME", name_en: "Montenegro" },
  { name: "Na Uy", code: "NO", name_en: "Norway" },
  { name: "Nam Phi", code: "ZA", name_en: "South Africa" },
  { name: "Nepal", code: "NP", name_en: "Nepal" },
  { name: "New Zealand", code: "NZ", name_en: "New Zealand" },
  { name: "Nga", code: "RU", name_en: "Russia" },
  { name: "Nhật Bản", code: "JP", name_en: "Japan" },
  { name: "Nicaragua", code: "NI", name_en: "Nicaragua" },
  { name: "Nigeria", code: "NG", name_en: "Nigeria" },
  { name: "Oman", code: "OM", name_en: "Oman" },
  { name: "Pakistan", code: "PK", name_en: "Pakistan" },
  { name: "Panama", code: "PA", name_en: "Panama" },
  { name: "Papua New Guinea", code: "PG", name_en: "Papua New Guinea" },
  { name: "Paraguay", code: "PY", name_en: "Paraguay" },
  { name: "Peru", code: "PE", name_en: "Peru" },
  { name: "Pháp", code: "FR", name_en: "France" },
  { name: "Phần Lan", code: "FI", name_en: "Finland" },
  { name: "Philipin", code: "PH", name_en: "Philippines" },
  { name: "Puerto Rico", code: "PR", name_en: "Puerto Rico" },
  { name: "Qatar", code: "QA", name_en: "Qatar" },
  { name: "Rumani", code: "RO", name_en: "Romania" },
  { name: "Séc", code: "CZ", name_en: "Czech Republic" },
  { name: "Senegal", code: "SN", name_en: "Senegal" },
  { name: "Serbia", code: "RS", name_en: "Serbia" },
  { name: "Singapore", code: "SG", name_en: "Singapore" },
  { name: "Slovakia", code: "SK", name_en: "Slovakia" },
  { name: "Slovenia", code: "SI", name_en: "Slovenia" },
  { name: "Sri Lanka", code: "LK", name_en: "Sri Lanka" },
  { name: "Tanzania", code: "TZ", name_en: "Tanzania" },
  { name: "Tây Ban Nha", code: "ES", name_en: "Spain" },
  { name: "Thái Lan", code: "TH", name_en: "Thailand" },
  { name: "Thổ Nhĩ Kỳ", code: "TR", name_en: "Turkey" },
  { name: "Thuỵ Điển", code: "SE", name_en: "Sweden" },
  { name: "Thuỵ Sĩ", code: "CH", name_en: "Switzerland" },
  { name: "Tunisia", code: "TN", name_en: "Tunisia" },
  { name: "Úc", code: "AU", name_en: "Australia" },
  { name: "Uganda", code: "UG", name_en: "Uganda" },
  { name: "Ukraina", code: "UA", name_en: "Ukraine" },
  { name: "Uruguay", code: "UY", name_en: "Uruguay" },
  { name: "Venezuela", code: "VE", name_en: "Venezuela" },
  { name: "Việt Nam", code: "VN", name_en: "Vietnam" },
  { name: "Vương quốc Anh", code: "GB", name_en: "United Kingdom" },
  { name: "Ý", code: "IT", name_en: "Italy" },
  { name: "Yemen", code: "YE", name_en: "Yemen" },
  { name: "Zimbabwe", code: "ZW", name_en: "Zimbabwe" },
];
