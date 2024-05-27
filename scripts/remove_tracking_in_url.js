// NOTE: có thể sử dụng ublock origin, sẽ chặn được nhiều loại tracking hơn
// Sử dụng rules dưới đây:
// Adguard: https://github.com/AdguardTeam/AdguardFilters/tree/master/TrackParamFilter/sections
// https://github.com/DandelionSprout/adfilt/blob/master/LegitimateURLShortener.txt

import { BADGES } from "./helpers/badge.js";

let company = "Facebook, Google, Tiktok, Twitter";
let ul = `<ul>
<li>fbclid</li>
<li>ttclid</li>
<li>utm_*</li>
<li>...</li>
</ul>`;

export default {
  icon: "<i class='fa-solid fa-link-slash fa-lg'></i>",
  name: {
    en: "Prevent tracking url",
    vi: "Xoá theo dõi trong url",
  },
  description: {
    en: `Remove tracking parameters from url, prevent tracking from ${company} etc.<br/>${ul}`,
    vi: `Xoá các tham số theo dõi trong url, chặn theo dõi người dùng từ ${company} ...<br/>${ul}`,
  },
  badges: [BADGES.new],
  buttons: [
    {
      icon: '<i class="fa-solid fa-hashtag"></i>',
      name: {
        vi: "Xem danh sách tham số",
        en: "View list parameters",
      },
      onClick: () => {
        window.open(
          "/pages/viewScriptSource/index.html?file=remove_tracking_in_url_rules_simplified"
        );
      },
    },
    {
      icon: '<i class="fa-solid fa-list"></i>',
      name: {
        vi: "Dynamic rules editor",
        en: "Dynamic rules editor",
      },
      onClick: () =>
        window.open(
          chrome.runtime.getURL(
            "/scripts/net-request-rules/dynamicRulesEditor/index.html"
          )
        ),
    },
  ],

  changeLogs: {
    ["2024-05-14"]: "init",
  },

  popupScript: {
    onEnable: async () => {
      const { getNextDynamicRuleIds, Storage } = await import(
        "./helpers/utils.js"
      );
      const { simplifiedRules } = await import(
        "./remove_tracking_in_url_rules_simplified.js"
      );

      // check if str is regex like somthing_(a|b|c) => split to somthing_a something_b something_c
      function expandRegexString(str) {
        const regex = /\((.*?)\)/;
        const match = str.match(regex);
        if (match) {
          const options = match[1].split("|");
          const prefix = str.split("(")[0];
          return options.map((option) => prefix + option.trim());
        } else {
          return [str];
        }
      }

      const ids = await getNextDynamicRuleIds(
        Object.keys(simplifiedRules).length
      );
      let i = 0;
      let rules = [];
      for (let group in simplifiedRules) {
        let id = ids[i++];
        let { domains = [], params } = simplifiedRules[group];
        domains = domains?.filter(Boolean) || [];

        rules.push({
          id: id,
          priority: 1,
          action: {
            // type: "block",
            type: "redirect",
            redirect: {
              transform: {
                queryTransform: {
                  removeParams: params.map((_) => expandRegexString(_)).flat(),
                },
              },
            },
          },
          condition: {
            isUrlFilterCaseSensitive: true,
            regexFilter: `[?&](${params.join("|")})=`,
            resourceTypes: ["main_frame", "sub_frame"],
            ...(domains.length > 0 ? { requestDomains: domains } : {}),
          },
        });
      }

      console.log(rules);

      chrome.declarativeNetRequest.updateDynamicRules(
        {
          addRules: rules,
          removeRuleIds: ids,
        },
        () => {
          Storage.set("remove_tracking_in_url", ids);
        }
      );
    },
    onDisable: async () => {
      const { Storage } = await import("./helpers/utils.js");
      const ids = await Storage.get("remove_tracking_in_url", []);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ids,
      });
    },
  },
};

const backup = () => {
  // Convert orriginal rules to simplify rules
  /**
   ORIGINAL:
   {
      "id": 1,
      "group": "Urchin Tracking Modules",
      "priority": 1,
      "action": {
        "type": "redirect",
        "redirect": {
          "transform": {
            "queryTransform": {
              "removeParams": [
                "utm_source"
              ]
            }
          }
        }
      },
      "condition": {
        "isUrlFilterCaseSensitive": true,
        "regexFilter": "[?&]utm_source=",
        "resourceTypes": [
          "main_frame"
        ],
        "requestDomains": [
          "..."
        ]
      }
    }

    SIMPLIFY:
    {
      "Urchin Tracking Modules": {
        "domains": ["all"],
        "params": [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
          "utm_name",
          "utm_id"
        ]
      }
    }

   */
  (() => {
    let result = {};
    rules.forEach((_) => {
      let group = _.group;
      if (!result[group])
        result[group] = {
          domains: [],
          params: [],
        };

      result[group].params.push(
        _.action.redirect.transform.queryTransform.removeParams[0]
      );

      let domains = _.condition.requestDomains || [];
      for (let domain of domains) {
        if (result[group].domains.indexOf(domain) < 0)
          result[group].domain.push(domain);
      }
    });
    console.log(result);
  })();
};
