// Chỉ dùng được trong extension context (các scripts có thuộc tính runInExtensionContext = true)
export function showLoading(text = "") {
  let html = `
    <div class="loading-container">
        <div>
            <div class="loader"></div>
            ${text && `<br/><p class="text">${text}</p>`}
        </div>
    </div>

    <style>
        .loading-container {
            position: fixed;
            top:0;left:0;right:0;bottom:0;
            background:#333e;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }
        .loading-container .text {
            color: white;
        }
        .loading-container .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            animation: spin 1s linear infinite;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin: 0 auto 5px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
  `;
  let div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);

  let textP = document.querySelector(".loading-container .text");

  return {
    closeLoading: () => div.remove(),
    setLoadingText: (textOrFunction) => {
      if (!textP) return;
      if (typeof textOrFunction === "function") {
        textP.innerHTML = textOrFunction(textP.innerHTML);
      } else {
        textP.innerHTML = textOrFunction;
      }
    },
  };
}

export async function getCookie(domain, raw = false) {
  let cookies = await chrome.cookies.getAll({ domain });
  return raw
    ? cookies
    : cookies.map((_) => _.name + "=" + decodeURI(_.value)).join(";");
}

export function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs[0]);
      resolve(tabs?.[0] || {});
    });
  });
}

// https://stackoverflow.com/a/15292178/11898496
// https://stackoverflow.com/a/40815514/11898496
// https://stackoverflow.com/a/69507918/11898496
export async function setLocalStorage(
  domain,
  key,
  value,
  willOpenActive = false
) {
  let tab = await chrome.tabs.create({ active: willOpenActive, url: domain });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function (_key, _value) {
      alert(_key + " " + _value);
      localStorage.setItem(_key, _value);
    },
    args: [key, value],
  });

  !willOpenActive && chrome.tabs.remove(tab.id);
}
