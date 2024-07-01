// https://greasyfork.org/en/scripts/24204-picviewer-ce

/*
{
  name: unique name for this rule
  url: regex for url that this rule support
  src: regex for img src that this rule support
  exclude: regex for img src that this rule should not support
  r: regex(s) for string that will be replaced
  s: regex(s) / function(s) to calculate string that will be added
}
*/

export default [
  {
    // https://i1.sndcdn.com/avatars-IMMW4scIEiCxzOrR-hbX1hw-t240x240.jpg
    name: "soundcloud",
    src: /sndcdn\.com/,
    r: /-t\d+x\d+\./,
    s: ["-t500x500.", "-t240x240."],
  },
  {
    // https://styles.redditmedia.com/t5_c5295/styles/profileIcon_snooe729749b-a6a5-4ef0-bacf-f4a5c8331627-headshot.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=cb449c2601606d921ba6d2cc6074e5c0d20ddb67
    name: "reddit",
    src: /redditmedia/,
    r: /\?.*/,
    s: "",
  },
  {
    // https://cdn.britannica.com/52/241752-050-39026C33/display-resolution-television-tv-screen.jpg?w=400&h=300&c=crop
    name: "britannica",
    src: /britannica\.com/,
    r: /\?.*/,
    s: "",
  },
  {
    // https://cdn.akamai.steamstatic.com/steam/apps/2357570/ss_d5acf4945c1f8db3b0bf048c08ba13fd04685ba0.600x338.jpg
    name: "steam static",
    src: /steamstatic\.com\/steam\/apps/,
    r: /(_|\.)\d{2,}x\d{2,}\./,
    s: ".",
  },
  {
    // https://images.pexels.com/users/avatars/822138648/th-vinh-flute-776.jpg?auto=compress&fit=crop&h=40&w=40&dpr=2
    name: "pexels",
    src: [/pexels\.com\/users\/avatars/, /images\.pexels\.com\/photos/],
    r: /\?.*/,
    s: "",
  },
  {
    // https://cdn.maze.guru/image/1F2B7646370A63B28C1F99B1E447C1C5.png?x-image-process=image/resize,w_400/quality,q_75/format,webp
    name: "maze.guru",
    src: /maze(\.|-)guru(.*?)\/image\//,
    r: /\?x-image-process.*/,
    s: "",
  },
  {
    // https://images-ng.pixai.art/images/orig/9ec30200-baaa-4cd0-8cc8-04002496adda
    name: "pixai",
    src: /pixai\.art\/images\//,
    r: /\/stillThumb\//,
    s: "/orig/",
  },
  {
    // https://yt3.googleusercontent.com/Qiekx-HxQTiX332zq-LyypoWshtuDptDQYab3zqqPVwkZ2AA1FgXveeb9Vi-7-b822g_e5hxmw=s160-c-k-c0x00ffffff-no-rj
    name: "googleusercontent",
    src: /\.googleusercontent\./i,
    r: /\=s\d+.*/i,
    s: "=s0",
  },
  {
    name: "gitlab",
    src: /gitlab\.(.*?)\/uploads\//i,
    r: /\?width=\d+/i,
    s: "",
  },
  {
    name: "font gstatic",
    src: /^https?:\/\/fonts\.gstatic\.com\/(.*)\/notoemoji/i,
    r: /(https?:\/\/.*)\/\d+.(png|jpg)(.*?)(=s\d+)?/,
    s: "$1/512.$2",
  },
  {
    name: "artstation",
    url: /artstation\.com/,
    r: [
      /\/(avatars\/+\/)?medium\//i,
      /\/(\d{14}\/)?smaller_square\//i,
      /\/(\d{14}\/)?thumbnail\//i,
    ],
    s: "/large/",
  },
  {
    name: "123rf",
    url: /123rf\.com/,
    r: /us\.123rf\.com\/\d+wm\//i,
    s: "previews.123rf.com/images/",
  },
  {
    name: "wikipedia",
    url: /^https?:\/\/.+\.(wikipedia|wikimedia)\.org\//i,
    src: /^https?:\/\/.+\.wikimedia\.org\//i,
    r: /(https?:\/\/.*)\/thumb(\/.*)\/\d+px-.*/i,
    s: "$1$2",
  },
  {
    name: "trakt.tv",
    url: /^http:\/\/trakt\.tv\//i,
    example: "http://trakt.tv/shows",
    r: /(.*\/images\/posters\/\d+)-(?:300|138)\.jpg\?(\d+)$/i,
    s: "$1.jpg?$2",
  },
  {
    name: "Steampowered",
    url: /\.steampowered\.com/,
    r: /\.\d+x\d+\.jpg/i,
    s: ".jpg",
  },
  {
    name: "Steamcommunity",
    url: /steamcommunity\.com/,
    r: /output\-quality=\d+&fit=inside\|\d+\:\d+/i,
    s: "output-quality=100&fit=inside|0:0",
  },
  {
    name: "500px",
    url: /500px\./,
    r: [
      /\/w%3D\d+_h%3D\d+\/v2.*/i,
      /^((?:(?:pp?cdn|s\\d\\.amazonaws\\.com\/photos|gp\\d+\\.wac\\.edgecastcdn\\.net\/806614\/photos\/photos)\\.500px|djlhggipcyllo\\.cloudfront)\\.(?:net|org)\/\\d+\/[\\da-f]{40}\/)\\d+\\./,
    ],
    s: ["/m%3D2048_k%3D1_of%3D1/v2", "$12048.jpg"],
  },
  {
    name: "Nyaa",
    url: /nyaa\.se/,
    r: /upload\/small\//i,
    s: "upload/big/",
  },
  {
    name: "itunes",
    url: /itunes\.apple\.com/,
    r: /\d+x\d+bb\./i,
    s: "1400x1400bb.",
  },
  {
    name: "dribbble",
    url: /dribbble\.com/,
    r: [/_teaser(.[^\.]+)$/i, /_1x\./i, /\?compress=.*/],
    s: ["$1", ".", ""],
  },
  {
    name: "Tumblr",
    url: /tumblr\.com/,
    exclude: /\/avatar_/i,
    r: [
      /[^\/]*(media\.tumblr\.com.*_)\d+(\.[^\.]+)$/i,
      /(media\.tumblr\.com.*_)[^_]+(\.[^\.]+)$/i,
    ],
    s: ["$1raw$2", "$1512$2"],
  },
  // {
  //   name: "Tumblr",
  //   url: /tumblr\.com/,
  //   src: /\/avatar_/i,
  //   r: /(media\.tumblr\.com.*_)[^_]+(\.[^\.]+)$/i,
  //   s: "$1512$2",
  // },
  {
    name: "Pixiv",
    url: /pixiv\.net|pximg\.net/,
    src: /pximg\.net\/c\/\d+x\d+/i,
    r: /pximg\.net\/c\/\d+x\d+.*\/img\/(.*)_.*$/i,
    s: [
      "pximg.net/img-original/img/$1.jpg",
      "pximg.net/img-original/img/$1.png",
    ],
  },
  {
    name: "moegirl",
    url: /(moegirl|mengniang)\.org/,
    r: /(common)\/thumb(.*)\/[^\/]+/i,
    s: "$1$2",
  },
  {
    name: "fanfou",
    url: /fanfou\.com/,
    r: /@.+/i,
    s: "",
  },
  {
    name: "meitudata",
    url: /meipai\.com/,
    r: /!thumb.+/i,
    s: "",
  },
  {
    name: "mafengwo",
    url: /mafengwo\.cn/,
    r: /\?imageMogr.*/i,
    s: "",
  },
  {
    name: "discordapp",
    url: /(discordapp\.|discord\.)(com|net)/,
    r: /\?width=\d+&height=\d+$/i,
    s: "",
  },
  {
    name: "Fandom",
    url: /fandom\.com/,
    r: [/scale\-to\-width\-down\/\d+/i, /smart\/width\/\d+\/height\/\d+/i],
    s: ["", ""],
  },
  {
    name: "Zhisheji",
    url: /zhisheji\.com/,
    r: /thumbnail\/.*/i,
    s: "",
  },
  {
    name: "imgbox",
    src: /imgbox\.com/,
    r: /thumbs(\d\.imgbox.*)_t\./i,
    s: "images$1_o.",
  },
  {
    name: "Reddit",
    url: /reddit\.com|redd\.it/,
    r: /https?:\/\/preview\.redd.it\/([^\?]+)?.*/i,
    s: "https://i.redd.it/$1",
  },
  {
    name: "Rule34hentai",
    url: /rule34hentai\.net/,
    r: "/_thumbs/",
    s: "/_images/",
  },
  {
    name: "Rule34",
    url: /rule34\.xxx/,
    src: /\/(thumbnails|samples)\/(.*)\/(thumbnail|sample)_/i,
    r: /\/(thumbnails|samples)\/(.*)\/(thumbnail|sample)_(.*)\..*/i,
    s: ["/images/$2/$4.jpeg", "/images/$2/$4.png", "/images/$2/$4.jpg"],
  },
  {
    name: "Photosight",
    url: /photosight\.ru/,
    r: /(cdny\.de.*\/)t\//i,
    s: "$1x/",
  },
  {
    name: "588ku",
    url: /588ku\.com/,
    r: /!\/fw.*/,
    s: "",
  },
  {
    name: "gelbooru",
    url: /gelbooru\.com/,
    src: /(thumbnails|samples)\/(.*)\/(thumbnail|sample)_/i,
    r: /.*\/(thumbnails|samples)\/(.*)\/(thumbnail|sample)_(.*)\..*/i,
    s: [
      "https://img3.gelbooru.com/images/$2/$4.png",
      "https://img3.gelbooru.com/images/$2/$4.jpg",
      "https://img3.gelbooru.com/images/$2/$4.gif",
    ],
  },
  {
    name: "donmai",
    url: /donmai\.us/,
    src: /(thumbnails|sample)\/(.*)\/(thumbnail|sample)_|\/\d+x\d+\//i,
    r: [
      /\/(thumbnails|sample)\/(.*)\/(thumbnail|sample)_(.*)/i,
      /\/\d+x\d+\//i,
      /\/\d+x\d+\/(.*)\.(.*)/i,
    ], // TODO: array of r??
    s: [
      "/original/$2/$4",
      "/original/",
      ["/original/$1.jpg", "/original/$1.png", "/original/$1.gif"],
    ],
  },
  {
    name: "erosberry",
    url: /erosberry\.com/,
    r: /(\/\d+\/)tn_(\d+\.[^\/]+)$/i,
    s: "$1$2",
  },
  {
    name: "javdb",
    url: /javdb/,
    r: "/thumbs/",
    s: "/covers/",
  },
  {
    name: "javbus",
    url: /javbus\.|busjav\./,
    r: /\/thumbs?(\/\w+)\.jpg$/i,
    s: "/cover$1_b.jpg",
  },
  {
    name: "avmoo",
    url: /avmoo\./,
    r: "ps.jpg",
    s: "pl.jpg",
  },
  {
    name: "asiansister",
    url: /asiansister\.com/,
    r: "_t.",
    s: ".",
  },
  {
    name: "jianshu",
    url: /jianshu\.com/,
    r: /(upload-images\.jianshu\.io\/.*)\?.*/i,
    s: "$1",
  },
  {
    name: "wikiart",
    url: /wikiart\.org/,
    r: /!.*/i,
    s: "",
  },
  // {
  //   name: "discuz",
  //   r: [
  //     /(.+\/attachments?\/.+)\.thumb\.\w{2,5}$/i,
  //     /((wp-content|moecdn\.org)\/uploads\/.*)\-\d+x\d+(-c)?/i,
  //     /.*(?:url|src)=(https?:\/\/.*\.(?:jpg|jpeg|png|gif|bmp)).*/i,
  //     /.*thumb\.php\?src=([^&]*).*/i,
  //   ],
  //   s: "$1",
  // },
  {
    name: "weibo",
    url: /sinaimg/,
    r: [
      /(\.sinaimg\.(cn|com)\/)(?:bmiddle|orj360|mw\d+)/i,
      /(\.sinaimg\.(cn|com)\/)(?:square|thumbnail)/i,
      /(\.sinaimg\.(cn|com)\/\d+)\/50\//i,
      /k\.sinaimg\.cn\/n\/(.*)\/(w\d+)?h\d+[^\/]+$/,
      /thumb\d+/,
    ],
    s: ["$1large", "$1mw1024", "$1/180/", "n.sinaimg.cn/$1", "mw690"],
  },
  {
    name: "gravatar",
    src: /gravatar\.com\/avatar\/|\/gravatar\//i,
    r: /(avatar\/.*[\?&]s=)\d+(.*)/,
    s: "$19999$2",
  },
  {
    name: "ucServerAvatar",
    src: /uc_server\/avatar\.php/i,
    r: /(uc_server\/avatar\.php\?uid=\d+&size=).*/,
    s: "$1big",
  },
  {
    name: "md",
    src: /\.md\./i,
    r: /\.md(\.[^\.]+)$/i,
    s: "$1",
  },
  {
    name: "ytimg",
    src: /i\.ytimg\.com/i,
    exclude: /mqdefault_6s/i,
    r: /(.*?)(\w+)(\.\w+)(\?.+)?$/i,
    s: ["$1maxresdefault$3", "$1hqdefault$3"],
  },
  {
    name: "meituan",
    url: /\.meituan\.net/i,
    r: /\/avatar\/\w{2}/i,
    s: "/avatar/o0",
  },
  {
    name: "hdslb",
    src: /hdslb\.com\//i,
    r: /@.*/i,
    s: "",
  },
  {
    name: "coolapk",
    url: /\.coolapk\.com\//i,
    r: /\.s\.\w+$/i,
    s: "",
  },
  {
    name: "aicdn",
    src: /\.aicdn\.com\//i,
    r: /_fw\d+$/i,
    s: "",
  },
  {
    name: "duitang",
    url: /duitang\.com\//i,
    r: /.thumb.(\d+_)?\d*(_c)?\./i,
    s: ".",
  },
  {
    name: "imgur",
    src: /imgur\.com\//i,
    r: [/h(\.[^\/]+)$/i, /maxwidth=\d+/i, /s=\d+/],
    s: ["$1", "maxwidth=99999", ""],
  },
  {
    name: "dmm",
    src: /pics\.dmm\.co\.jp/i,
    r: "ps.jpg",
    s: "pl.jpg",
  },
  {
    name: "whd",
    src: /\/w\/\d+\/h\/\d+($|\/|\?)/i,
    r: /\/w\/\d+\/h\/\d+/i,
    s: "",
  },
  {
    name: "百度图片、贴吧等",
    src: /(hiphotos|imgsrc)\.baidu\.com/i,
    r: /(hiphotos|imgsrc)\.baidu\.com\/(.+?)\/.+?([0-9a-f]{40})/i,
    s: "$1.baidu.com/$2/pic/item/$3",
  },
  {
    name: "pixiv",
    src: /pixiv\.net/i,
    r: /(pixiv.net\/img\d+\/img\/.+\/\d+)_[ms]\.(\w{2,5})$/i,
    s: "$1.$2",
  },
  {
    name: "taobaocdn",
    src: /(taobaocdn|alicdn)\.com/i,
    r: [
      /.*((?:img\d\d\.taobaocdn|img(?:[^.]*\.?){1,2}?\.alicdn)\.com\/)(?:img\/|tps\/http:\/\/img\d\d+\.taobaocdn\.com\/)?((?:imgextra|bao\/uploaded)\/.+\.(?:jpe?g|png|gif|bmp))_.+\.jpg$/i,
      /(.*\.alicdn\.com\/.*?)((.jpg|.png)(\.|_)\d+x\d+.*)\.jpg(_\.webp)?$/i,
      /(.*\.alicdn\.com\/.*?)((\.|_)\d+x\d+.*|\.search|\.summ)\.jpg(_\.webp)?$/i,
    ],
    s: ["http://$1$2", "$1$3", "$1.jpg"],
  },
  {
    name: "yihaodianimg",
    url: /yhd\.com/i,
    src: /yihaodianimg\.com/i,
    r: /(.*\.yihaodianimg\.com\/.*)_\d+x\d+\.jpg$/i,
    s: "$1.jpg",
  },
  {
    name: "jd",
    url: /jd\.com/i,
    src: /360buyimg\.com/i,
    r: [
      /(.*360buyimg\.com\/)n\d\/.+?\_(.*)/i,
      /(.*360buyimg\.com\/)n\d\/(.*)/i,
      /(.*360buyimg\.com\/.*)s\d+x\d+_(.*)/i,
    ],
    s: ["$1imgzone/$2", "$1n0/$2", "$1$2"],
  },
  {
    name: "dangdang",
    url: /dangdang\.com/i,
    src: /ddimg\.cn/i,
    r: /(.*ddimg.cn\/.*?)_[bw]_(\d+\.jpg$)/i,
    s: "$1_e_$2",
  },
  {
    name: "duokan",
    url: /duokan\.com/i,
    r: /(cover.read.duokan.com.*?\.jpg)!\w+$/i,
    s: "$1",
  },
  {
    name: "yyets",
    url: /yyets\.com/i,
    r: /^(res\.yyets\.com.*?\/ftp\/(?:attachment\/)?\d+\/\d+)\/[ms]_(.*)/i,
    s: "http://$1/$2",
  },
  {
    name: "mozilla",
    url: /addons\.mozilla\.org/i,
    r: "addons.cdn.mozilla.net/user-media/previews/thumbs/",
    s: "/thumbs/full/",
  },
  {
    name: "firefox",
    url: /firefox\.net\.cn/i,
    r: "www.firefox.net.cn/attachment/thumb/",
    s: "www.firefox.net.cn/attachment/",
  },
  {
    name: "crsky",
    url: /\.crsky\.com/i,
    r: /pic\.crsky\.com.*_s\.gif$/i,
    s: "/_s././",
    example: "http://www.crsky.com/soft/5357.html",
  },
  {
    name: "zol",
    url: /\.zol\.com/i,
    r: /(\w+\.zol-img\.com\.cn\/product\/\d+)_\d+x\d+\/(.*\.jpg)/i,
    s: "$1/$2",
    example: "http://detail.zol.com.cn/240/239857/pic.shtml",
  },
  {
    name: "yesky",
    url: /\.yesky\.com/i,
    r: /_\d+x\d+\.([a-z]+)$/i,
    s: ".$1",
    example: "http://game.yesky.com/tupian/165/37968665.shtml",
  },
  {
    name: "巴哈姆特",
    url: /^https:\/\/\w+\.gamer\.com\.tw/,
    src: /bahamut\.com\.tw/,
    r: "/S/",
    s: "/B/",
  },
  {
    name: "sgamer",
    url: /\.sgamer\.com/i,
    r: /\/s([^\.\/]+\.[a-z]+$)/i,
    s: "/$1",
    example: "http://dota2.sgamer.com/albums/201407/8263_330866.html",
  },
  {
    name: "nhentai",
    url: /nhentai\.net/i,
    r: /\/\/\w+(\..*\/)(\d+)t(\.[a-z]+)$/i,
    s: "//i$1$2$3",
    example: "http://nhentai.net/g/113475/",
  },
  {
    name: "GithubAvatars",
    url: /github\.com/i,
    r: /(avatars\d*\.githubusercontent\.com.*)\?.*$/i,
    s: "$1",
    example: "https://avatars2.githubusercontent.com/u/3233275/",
  },
  {
    name: "ggpht",
    src: /ggpht\.com/i,
    r: /=s\d+.*/i,
    s: "=s0",
  },
  {
    name: "kodansha",
    url: /kodansha\.co\.jp/i,
    src: /kodansha\.co\.jp/i,
    r: "t_og_image_center",
    s: "c_limit",
  },
  {
    name: "fanseven",
    url: /fanseven\.com/i,
    src: /fanseven\.com/i,
    r: /w=\d+&h=\d+/i,
    s: "w=9999&h=9999",
  },
  {
    name: "hentai-cosplays",
    url: /^https:\/\/(.*\.)?(hentai\-cosplays|porn\-images\-xxx)\.com/,
    r: /\/p=[\dx]+(\/\d+\.\w+)$/i,
    s: "$1",
  },
  {
    name: "imdb",
    url: /^https?:\/\/www\.imdb\.com/,
    src: /media\-amazon/,
    r: /@.*(\.\w)/i,
    s: "@$1",
  },
  {
    name: "雪球",
    url: /^https?:\/\/xueqiu\.com\//,
    src: /^https?:\/\/xqimg\.imedao\.com\//i,
    r: /!\d+(x\d+[a-z]?)?\.\w+$/,
    s: "",
  },
  {
    name: "小众论坛",
    url: /^https?:\/\/meta\.appinn\.net/,
    src: /meta\-cdn/,
    r: /\/optimized\/(.*)_\d+_\d+x\d+(\.\w+)$/,
    s: "/original/$1$2",
  },
  {
    name: "诱惑福利图",
    url: /www\.yhflt\.com/,
    src: /imgs\.yhflt\.com/,
    r: /imgs(\..*\/)q/,
    s: "pic$1",
  },
  {
    name: "blogger",
    src: /blogger\.googleusercontent\.com\/img/,
    r: /\/[sw]\d+\/.*/,
    s: "/s0",
  },
  {
    name: "煎蛋",
    url: /^https:\/\/jandan\.net\//,
    r: [/\/(thumb\d+|mw\d+)\//, /!square/],
    s: ["/large/", ""],
  },
  {
    name: "辉夜白兔",
    url: /47\.101\.137\.235/,
    r: "thumb",
    s: "regular",
  },
  {
    name: "Civitai",
    url: /^https:\/\/civitai\.com\//,
    r: /\/width=\d+\//,
    s: "/",
  },
];
