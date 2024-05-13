let count = document.createElement("h1");
document.body.appendChild(count);

chrome.declarativeNetRequest.getDynamicRules((rules) => {
  console.log(rules);
  count.innerText = "Rules Count: " + rules.length;
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
          count.innerText = "Rules Count: " + 0;
        }
      );
    }
  });
};
document.body.appendChild(deleteAllBtn);
