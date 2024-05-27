import { t } from "../../../popup/helpers/lang.js";

let h1 = document.createElement("h1");
h1.style.textAlign = "center";
document.body.appendChild(h1);

chrome.declarativeNetRequest.getDynamicRules((rules) => {
  console.log(rules);
  h1.innerHTML = t({
    en: "..Feature in development.. <br/><br/>Rules Count: " + rules.length,
    vi:
      "..Chức năng đang được phát triển.. <br/><br/>Rules Count: " +
      rules.length,
  });
});

let deleteAllBtn = document.createElement("button");
deleteAllBtn.innerText = "Delete all";
deleteAllBtn.onclick = () => {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    if (confirm("Delete " + rules.length + " rules?")) {
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: rules.map((rule) => rule.id),
        },
        () => {
          alert("DONE");
          h1.innerText = "Rules Count: " + 0;
        }
      );
    }
  });
};
document.body.appendChild(deleteAllBtn);
