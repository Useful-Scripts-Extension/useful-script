export const simplifiedRules = {
  Tiktok: {
    params: ["ttclid"],
  },
  Facebook: {
    params: ["fbclid", "mc_eid"],
  },
  Instagram: {
    params: ["igshid"],
  },
  Twitter: {
    domains: ["twitter.com"],
    params: ["s", "t"],
  },
  Google: {
    domains: ["google.com"],
    params: [
      "gclid",
      "glsrc",
      "_ga",
      "sxsrf",
      "source",
      "ei",
      "iflsig",
      "gs_lp",
      "gs_lcrp",
      "sclient",
      "ved",
      "uact",
      "stick",
      "sca_esv",

      // uncomment this cause bug when open link from google chat
      // "sa",
      // "usg",
    ],
  },
  Spotify: {
    domains: ["spotify.com", "youtube.com", "reddit.com"],
    params: ["si", "context"],
  },
  Youtube: {
    domains: ["youtube.com"],
    params: [
      "feature",
      "ab_channel",
      "pp",
      "bp",
      "redir_token",
      "event",
      "embeds_referring_euri",
      "source_ve_path",
    ],
  },
  Amazon: {
    domains: ["amazon.*"],
    params: [
      "ref",
      "tag",
      "linkCode",
      "hv(adid|netw|qmt|bmt|dev|locint|locphy|targid)",
      "psc",
      "content-id",
      "pd_rd_(w|p|r|i|wg)",
    ],
  },
  Bing: {
    domains: ["bing.com"],
    params: [
      "toWww",
      "redig",
      "form",
      "qs",
      "sp",
      "ghc",
      "lq",
      "pq",
      "sc",
      "sk",
      "cvid",
      "ghsh",
      "ghacc",
      "ghpl",
      "ccid",
      "id",
      "thid",
      "simid",
      "FORM",
      "ck",
      "ajaxhist",
      "ajaxserp",
      "osid",
    ],
  },
  LinkedIn: {
    domains: ["linkedin.com"],
    params: [
      "trackingId",
      "lipi",
      "midSig",
      "trkEmail",
      "otpToken",
      "refId",
      "midToken",
      "trk",
      "eid",
      "mcid",
      "ePP",
      "ccuid",
      "cid",
    ],
  },
  Reddit: {
    params: ["share_id"],
  },
  Adobe: {
    params: ["ef_id", "s_kwcid"],
  },
  Microsoft: {
    params: ["msclkid"],
  },
  Pinterest: {
    params: ["epik"],
  },
  BBC: {
    domains: ["bbc.com", "bbc.co.uk"],
    params: [
      "ns_(mchannel|msection|msubsection|msectionid|msectiontype|msectionurl)",
      "pinned_post_(locator|asset_id|type)",
    ],
  },
  eBay: {
    params: ["mk(evt|cid|rid)", "campid", "toolid", "customid"],
  },
  "Urchin Tracking Modules": {
    params: ["utm_(source|medium|campaign|term|content|name|id)"],
  },
  Olytics: {
    params: ["oly_enc_id", "oly_anon_id"],
  },
  "Drip Marketing": {
    params: ["__s"],
  },
  "Vero Marketing": {
    params: ["vero_id"],
  },
  "HubSpot CRM": {
    params: ["_hsenc", "hsa_(cam|grp|mt|src|ad|acc|net|kw|tgt|ver)"],
  },
  Branch: {
    params: ["_branch_match_id"],
  },
  Wunderkind: {
    params: ["sms_(source|click|uph)"],
  },
  "Marketo Marketing": {
    params: ["mkt_tok"],
  },
  Mailchimp: {
    params: ["mc_cid", "mc_eid"],
  },
  Bronto: {
    params: ["_bta_tid", "_bta_c"],
  },
  Listrak: {
    params: ["trk_(contact|msg|module|sid)"],
  },
  GoDataFeed: {
    params: ["gd(fms|ftrk|ffi)"],
  },
  Klaviyo: {
    params: ["_ke"],
  },
  Springbot: {
    params: ["redirect_(log_mongo_id|mongo_id)", "sb_referer_host"],
  },
  Marin: {
    params: ["mkwid", "pcrid"],
  },
  dotdigital: {
    params: ["dm_i"],
  },
  Piwik: {
    params: ["(pk|piwik)_(campaign|kwd|keyword|medium|content)"],
  },
  Matomo: {
    params: [
      "(mtm|matomo)_(campaign|keyword|source|medium|content|cid|group|placement)",
    ],
  },
};
