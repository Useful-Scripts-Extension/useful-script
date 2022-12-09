import { escapeRegExp, getCurrentTab } from "./helpers/utils.js";

export default {
  icon: "https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico",
  name: {
    en: "Soundcloud - Download music",
    vi: "Soundcloud - Tải nhạc",
  },
  description: {
    en: "Download music from soundcloud",
    vi: "Tải nhạc trên soundcloud",
  },
  runInExtensionContext: true,

  onClick: async function () {
    let tab = await getCurrentTab();
    let url = prompt("Nhập link soundcloud: ", tab.url);
    if (url == null) return;
  },
};

export const shared = {
  downloadSoundCloud: async function (url) {
    let client_id = await shared.getApiKey();
    let info = await shared.getResourceInfo(url, client_id);
  },
  getApiKey: async function () {
    let res = await fetch("https://soundcloud.com");

    let text = await res.text();

    // prettier-ignore
    let jsUrl =
      new RegExp('<script crossorigin="" src="(.+?)"></script>').exec(text)?.[-1] ||
      new RegExp('<script crossorigin src="(.+?)"></script>').exec(text)?.[-1];

    res = await fetch(jsUrl);
    let jsCode = await res.text();
    let client_id = new RegExp('client_id:"(.+?)"').exec(jsCode)?.[1];

    return client_id;
  },
  getResourceInfo: async function (resource_url, client_id) {
    let res = await fetch(resource_url);
    let text = await res.text();

    let x = escapeRegExp("forEach(function(e){n(e)})}catch(e){}})},");
    x = new RegExp(x + "(.*)\\);</script>").exec(text);

    // info = json.loads(x.group(1))[-1]['data'][0]

    // info = info['tracks'] if info.get('track_count') else [info]

    // ids = [i['id'] for i in info if i.get('comment_count') is None]
    // ids = list(map(str, ids))
    // ids_split = ['%2C'.join(ids[i:i+10]) for i in range(0, len(ids), 10)]
    // api_url = 'https://api-v2.soundcloud.com/tracks?ids={ids}&client_id={client_id}&%5Bobject%20Object%5D=&app_version=1584348206&app_locale=en'

    // res = []
    // for ids in ids_split:
    //     uri = api_url.format(ids=ids, client_id=client_id)
    //     cont = get_content(uri, decoded=True)
    //     res += json.loads(cont)

    // res = iter(res)
    // info = [next(res) if i.get('comment_count') is None else i for i in info]

    // return info
  },
};
