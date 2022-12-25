// https://greasyfork.org/en/scripts/431691-bypass-all-shortlinks/code
function userScriptConfigToObject(config) {
  let a = config.split("\n");
  let b = {
    includes: [],
    exclude: [],
    match: [],
  };
  a.forEach((_) => {
    let value = _.split(" ").at(-1);
    if (_.includes("@include")) {
      b.includes.push(value);
    } else if (_.includes("@exclude")) {
      b.exclude.push(value);
    } else if (_.includes("@match")) {
      b.match.push(value);
    }
  });
}

let config = {
  includes: [
    "/^(https?://)(tmearn|additionalgamer|makemoneywithurl|shrinkearn|techcyan|aghtas|soltoshindo|link4m|kingsleynyc|healthy4pepole|kiktu|1bitspace|skip-url|pennbookcenter|publicananker|mikl4forex|michaelemad|miklpro|zirof|forex-golds|nawahi1|mosqam|semawur|forex-trnd|hoshilink|taiwancnan|bit-url|megurus|cuts-url|popimed|rayusmedya|enburl|pickhopes|toryxlink|aduzz|lycoslink|cdrab|ibrabucks|zenshort|ethiomi|shortenbuddy|kiemlua|smoner|djbhojpurisongs|urlty|sakastau|modsbase|ac.totsugeki|bcvc2|earnwithshortlink|bitzite|link1s|diadiemcheckin|tudiendanhngon|chooyomi|staaker|lucidcam|forexlap|forexmab|linkjust|admediaflex|hoclamdaubep|rekonise|forex-articles|ponselharian|liinkat|thegoneapp|mobi2c|studyuo|hookeaudio|thehostingmentor|intlinki|linkshortify|shopsixseven|mohtawaa|msarzone|foodhear|fc-lc|expertvn|downphanmem|healdad|ez4mods|try2link|tmker|soft3arbi|techyadjectives|ex-foary|examtadka|bablyfeed|crypto4tun|blogmado|itsguider|coin-free|1xfaucet|dash-free|usdshort|cafenau|techacode|ls2earn|sevenjournals|7misr4day|trflink|sama-pro|s.ume24|shtfly|bestmobilenew|onlineincoms|modsfire|adneow|short.clickscoin|samaa-pro|techrfour|ez4short|topnewsnew|gawishpro|dz4link|skincarie|gaminplay|infinitycoupon|videoslyrics|shortlite|bitefaucet|techrayzer|shorteet|donnaleehunt|puggygaming|link2end|tranquangchuan|blogginglass|1shorten|lensabicara|tieutietkiem|yummy-reciepes|doctor-groups|link.bigboxnet|bioinflu|chamcuuhoc|litexblog|7nything|gamalk-sehetk|adsafelink|cbshort|bellurl|abcshort|checkscoin|llinkon|links.apksvip|nguyenvanbao|cloudgetlink|techloadz|atglinks|nulledsafe|dreamcheeky|cutpaid|fidlarmusic|rodjulian|anhdep24|money.alyoumeg|sl.claimfreebits|sl-1.btcbunch|sl-2.btcbunch|earncryptowrs|short-zero|insurancevela|poketoonworld|arahtekno|mopahealth|nghiencar|sl-3.btcbunch|apk.miuiku|bitlya|ecwizon|oncehelp|sportsmediaz|big2short|techymozo|loptelink|2shrt|charexempire|coindoog|shotzon|novelsapps|webhostingpost|tremamnon|tirailangit|intercelestial|tribuntekno|bestcash2020|hoxiin|fooot-map|priefy|dz-linkk|fauxlink|chinhnhacoban|autodime|cortaly|link.3dmili|1adlink|indianshortner|donia-tech|donia2tech|donia2link|short1s|cr3zyblog|btafile|pdiskshortener|urlsopen|1shortlink|linkerload|filenext|shrinkmoney|doodshort|paid4link|kienthucrangmieng|wiki-topia|aljoodm98|newworldnew|sahityt|mkomsel|niinga|bclikeqt|youssefsayed|fx4vip|shortzon|get4links|crickblaze|nostralink|clkmein|101desire|memangbau|hosting4lifetime|mesho-link|up4cash|newsharsh|examkhata|linksht|note1s|adclickersbot|mobitaak|btcwalk|99faucet|modebaca|paylinnk|olhonagrana|chedrive|teknosimple|discordserv|link-yz|apkadmin|ayelads|gawbne|mshortener|cutdomain|usersdrive|uptobox|1fichier|uploadrar|bayfiles|krakenfiles|post.copydev|icutlink|zegtrends|anonfiles|sharemods|ddownload|uppit|userscloud|newsnowbd|link.nulldown|asideway|url.namaidani|url.magmint|mp4upload|myshrinker|apkshrt|link.turkdown|drive.google|safe.intipanime|trylinko|uploadhaven|manga2day|shortyearn|workupload|filedm|themorningtribune|beingtek|sub2get|ex-load|campki|social-unlock|teerclub|short-jambo|link.bitmagge|nerdiess|best-cpm|clicksfly|megaupto|maqal360|foodboth|ufacw|techcartz|softechbharat|okrzone|informaxonline|shopdorod|short.skalbayrak|adshnk|sub2unlock|smarcrm|cryptomeloud|blog-everything|ikrey|tipsli|urlpayout|urlpoints|hocbeauty|95news|link.get4llink|twitonet|shrinklo|xemsport|cutwin|pubgquotes|examsteacher|adpaylink|yxoshort|mdiskurl|shrt10|imgbsr|linknih|lessurl|pureshort|adrinolinks|wikitraveltips|techkeshri|uploadsoon|shrinkgold|itechmafiia|link4earn|team.pastehosting|educur|3rabsnews)(.com)(/.*)/",
    "/^(https?://)(.+)?(zolomix|cararegistrasi|5golink|birdurls|snkra|artiskini|sh2rt|byboe|medcpu|nousdecor|restorbio|bdnewsx|upshrink|gifans|jardima|jobswd|gkqnaexam|imperialstudy|ovlinks|imagenesderopaparaperros|yofaurls|digiromotion|wingifta|rancah|coinadfly|delishwell|zippyshare|solidfiles|ourtecads|zubatecno|covemarkets|disheye|eda-ah|blog-forall|techymedies|gamelopte|allcryptotips|claimclicks|snowurl|riadcrypto|askpaccosi|linktrims|gets4link|visflakes|apk4do|dineroshare|elwatanelyoum|ledifha|claimfey|shrinkito|panylink|wrbloggers|tokenoto|saly-cash|upload-4ever|shortenn|admediaflex|btcpany|assettoworld|vikashmewada|linkyearn|appsbull|gam3ah|tinybc|diudemy|file-upload|shorterall|tribuncrypto|cempakajaya|safelinkduit|nadersoft7|adshorturl|linkbnao|phsensei|4shared|ta2deem7arbya|lrshortner|tinycmd|cloudshrinker|proviralhost|technicalatg|v2links|ytsubme|rainurl|arahlink|m4cut|teachsansar|web9academy|shortxlinks|flyrar|pythondunyasi|meykmen|on-scroll|shrtfly|i-polls|sonicbtc|cutln|menjelajahi|almontsf|crypturls|zombiebtc|sekilastekno|techwhom|hereofamily|cash4share|linkwards)(.com)(/.*)/",
    "/^(https?://)(ahyblogs|ourcoincash|1manga|watchdoge|arenaboard|ccsl|shrinkpay|adsgo|shon|crypto-faucet|bingeflix|studystar|liongiv|lokagames|3vw|short-cash2|wizzly|mgnet|crypteen|dogeen|fauceteen|cutdl|sportawy|fexkomin|technemo|zoomcrypto|techboyz|cblinks|99links|kartunik|post.nites-tv|shortplus|stores.filmyzilla-in|expresscoins|claimcoinsfree|short1|swzz|acortame|alghtas|wizly|horanews|a1link|short2fly|bcvc|healthbloog|post.movies-near-me|st.kleaco|playlink|q8c|sh0rt1|cars-1year|nabits|welovecrypto|worldappsstore|0uq|sh.tripledownloader|short2url|zeroshort|bitsyield|egstar|uscity|monsterurlshortner|bflinks|gibit|playdisk|studyis|kukslincs|magictoshi)(.xyz)(/.*)/",
    "/^(https?://)(.+)?(senuansatechno|insurglobal|claimercorner|shortly|dexlink|doctorcoin|speedynews|1apple|ffworld|textpage|fidovy|egfly|insurance-space|crypto-blog|sapica|earnfacut|urlbharat|dropz|chainfo|megano-coin|techleets|earnl)(.xyz)(/.*)/",
    "/^(https?://)(neonlink|techydino|world-trips|yoshare|lets.5get|crypto-fi|wpcheap|coinmasterx|catcut|aztravels|dulichkhanhhoa|sub2unlock|forex-gold|techtrickonline|7apple|ccurl|luckydice|link1s|url.namaidani|cryptowidgets|dogeclick|adskip|hurirk|usfinf|xervoo|sport4you|hexupload|eloism|cutt|forexshare|blog.cryptowidgets|neexulro|dailyuploads|douploads|simfileshare|fir3|magybu|racaty|linegee|blogesque|thuocdangian|altblogger|letsboost|cut-y|megadb|conghuongtu|vinaurl|tecmundo|try2link|cpmlink)(.net)(/.*)/",
    "/^(https?://)(.+)?(digitalnaz|owllink|mozlink|cryptosats|rocklinks|celinks|jiotech|bitcomarket|illink|jemari|fire-link|linkrex|urlw|paid4link|link3s|boscoin|pilinks|linkshortify)(.net)(/.*)/",
    "/^(https?://)(tnlink|jrlinks|qualitystudymaterial|cuturl|missionhight|wpking|zagl|ls2earn|streamshort|shareus|referus|megafly|megaurl|cutp|earnmoj|riadshot|urlmoney|cplink|cryptomonitor|technoflip|linkshortify|htlinks|techlearningtube|urlfly|linkocean|financeflix|uttan|jazbaat|djxmaza|bildirim|techy4you|battlechamp|sahilsumra|kerdlinfo|urlcut|insurancevlog|itechlogic|videolyrics|tekcrypt|missionhight|gplinks|moddingzone|adybrands|gpflix|gz2|dulink|aclinks|hidelinks|shortearn|siteblog|u.apgy|du-link|ouoi|by6|adrinolinks|rklinks|mymobilehub|techdaze|link4earn|rupamobile|examsolution)(.in)(/.*)/",
    "/^(https?://)(.+)?(cashurl|linkad|bitcoinly|crazyblog|zolomix|technologylover|expertlinks|largestpanel|linkres|rsrlink|linkstream|xmod|short2url|99links|rplinks|enit|adloot|url2go|tnvalue|pvidly|apurl|earnspace|urlinked|mdlink|gamerfang|writedroid|teckypress|fixno|paisakamalo|inkik|shrinkforearn|easysky|ajlinks|mdiskplayer|akcartoons)(.in)(/.*)?/",
    "/^(https?://)(aylink|linkszia|mynewsmedia|gtlink|adfloz|linksly|droplink|123link|linksfy|adshorti|hxfile|dosya|veganal|takem|ezimg|eng.ezimg|dausel|9-animie|veganho|nulledmod|veganac|dealprice|modlink|arabplus2|cut-y)(.co)(/.*)/",
    "/^(https?://)(.+)?(takez|linksfire|vosan|tinygo|veganab)(.co)(/.*)/",
    "/^(https?://)(ctbl|girls-like|gobits|zoss|shrinke|tlin|terafly|petafly|gigafly|adnews|papanews|panyflay|mozzfly|shortus|short.croclix|best-news|mega-news|wildblog|specx|dddrive|linkpoi|sh24|m.newhit|mboost|linkshorts|exafly|nonofly|lozzfly|uptomega|stfly|adbull|youshort|health-and|cutx|adsk|shorter.earn-hub|linkfly|pkin)(.me)(/.*)/",
    "/^(https?://)(.+)?(theconomy|richlink)(.me)(/.*)/",
    "/^(https?://)(sitr|flylink|downfile|savelink|linkshortify|shareus|promo-visits|mobileprice)(.site)(/.*)/",
    "/^(https?://)(.+)?(cekip|link4rev|coin-city)(.site)(/.*)/",
    "/^(https?://)(earnme|sanoybonito|automotur|kooza|1link|zentum|mytop5|forexwaw|megatube)(.club)(/.*)/",
    "/^(https?://)(.+)?(usanewstoday|kadal|webhostingtips)(.club)(/.*)/",
    "/^(https?://)(adrev|paid4|yousm|coinpayz|tr|yocto|clk.dti|besturl|boostme|takefile|appo|pureshort|linkshortifyx)(.link)(/.*)/",
    "/^(https?://)(.+)?(vshort|stex|cash4|zuba)(.link)(/.*)/",
    "/^(https?://)(shurt|shortit|adsy|bitlinks|clik|playstore|megalink)(.pw)(/.*)/",
    "/^(https?://)(.+)?(prz|pong)(.pw)(/.*)/",
    "/^(https?://)(bloogerspoot|vsbl)(.ga)(/.*)/",
    "/^(https?://)(bloogerspoot|linkshor|cortlink)(.tk)(/.*)/",
    "/^(https?://)(.+)?(madfaucet|mineshor|futureshor)(.tk)(/.*)/",
    "/^(https?://)(bloogerspoot|urlchanger|arearn|360shortlink)(.ml)(/.*)/",
    "/^(https?://)(onimports|link.encurtaon|economiarelevante)(.com.br)(/.*)/",
    "/^(https?://)(exee|onlineteori|punyablog|activity|massive|caview)(.my.id)(/.*)/",
    "/^(https?://)(.+)?(mycut|apasih)(.my.id)(/.*)/",
    "/^(https?://)(.+)?(suratresmi|carapedi|salink)(.id)(/.*)/",
    "/^(https?://)(link.skm4u|linkwards)(.co.in)(/.*)/",
    "/^(https?://)(.+)?(droplink)(.co.in)(/.*)/",
    "/^(https?://)(kiiw|passgen|wordcounter|shrink|revcot|clickzu|shortzu)(.icu)(/.*)/",
    "/^(https?://)(newforex|wplink|nbyts|wealthystyle|clicksfly|happy-living|earn-cash|yourtechnology|apks|network-earn|teacherana|earnow|battleroyal)(.online)(/.*)/",
    "/^(https?://)(.+)?(adslinkfly|readi|linkmumet)(.online)(/.*)/",
    "/^(https?://)(exey|ezlinks|techmody|ouo|ex-e|saly|cuty|evoload|oke|letsupload|eio|oii|exe)(.io)(/.*)/",
    "/^(https?://)(.+)?(linkfly|usalink)(.io)(/.*)/",
    "/^(https?://)(tny|tinyurl)(.so)(/.*)/",
    "/^(https?://)(zshort|claimcrypto|cashearn|1ink|linkpay|moneylink|intnews|openload|linkspy|letsupload|myasietv)(.cc)(/.*)/",
    "/^(https?://)(cryptoad|wikile|uploadev|mega4up|doibihar|cshort|payskip|homeairquality|shortearn|sl.btc25|earnsfly)(.org)(/.*)/",
    "/^(https?://)(.+)?(medipost|shrinkurl|keeplinks|rajdlsg)(.org)(/.*)/",
    "/^(https?://)(jameeltips|mitly|adfoc|link4fun)(.us)(/.*)/",
    "/^(https?://)(.+)?(yalla-shoot-now|forexeen|jaelink)(.us)(/.*)/",
    "/^(https?://)(noweconomy|deportealdia|adshort|ay|pngit|pndx)(.live)(/.*)/",
    "/^(https?://)(earnads|genpassword|shrlink|mshort|punyamerk|shortnow|short.freeltc)(.top)(/.*)/",
    "/^(https?://)(zagl|scratch247|siyn|portablesusb|children-learningreading|azmath|mobilereview|inform3tion|mobilism|machicon-akihabara|cooklike|videoclip|bitcrypto|shortlinkto|uptobhai|brbushare|fanclup)(.info)(/.*)/",
    "/^(https?://)(faucetcrypto|bildirim)(.eu)(/.*)/",
    "/^(https?://)(nex-url|olamovies|atrologyrex)(.cyou)(/.*)/",
    "/^(https?://)(antonimos|blog.hostratgeber)(.de)(/.*)/",
    "/^(https?://)(freelitecoin|uplinkto|1Link)(.vip)(/.*)/",
    "/^(https?://)(.+)?(flyad|lootcash)(.vip)(/.*)/",
    "/^(https?://)(romania|met|warp)(.bz)(/.*)/",
    "/^(https?://)(2ad|viya|17o)(.ir)(/.*)/",
    "/^(https?://)(adshrink|cutin)(.it)(/.*)/",
    "/^(https?://)(pingit|files|upo)(.im)(/.*)/",
    "/^(https?://)(clk|9xupload)(.asia)(/.*)/",
    "/^(https?://)(iir|tei|ier|ckk)(.ai)(/.*)/",
    "/^(https?://)(aii|clk|oko)(.sh)(/.*)/",
    "/^(https?://)(.+)?(i8l|clk|pi-l|bcvc|modli)(.ink)(/.*)/",
    "/^(https?://)(.+)?(upload|prx)(.ee)(/.*)/",
    "/^(https?://)(.+)?(mirrored|clicknupload)(.to)(/.*)/",
    "/^(https?://)(.+)?(ouo|forextrader|daga88)(.today)(/.*)/",
    "/^(https?://)(.+)?(techgeek|adsgo)(.digital)(/.*)/",
    "/^(https?://)(mhma12|surflink|techtrim)(.tech)(/.*)/",
    "/^(https?://)(kiw|redir.123file)(.li)(/.*)/",
    "/^(https?://)(zonearn|theprice|nhacremix|doanvanhai|hynews)(.biz)(/.*)/",
    "/^(https?://)(.+)?(123link)(.biz)(/.*)/",
    "/^(https?://)(.+)?(exe|exee|exep|upfiles|cutty|linkfly)(.app)(/.*)/",
    "/^(https?://)(adshort|1bit|2the|careerhunter|galaxy-link)(.space)(/.*)/",
    "/^(https?://)(makeeasybtc|softindex|techus)(.website)(/.*)/",
    "/^(https?://)(linka|xtrabits|skipads)(.click)(/.*)/",
    "/^(https?://)(.+)?(shortlinks|easysl|adlink|adzilla|urlcash)(.click)(/.*)/",
    "/^(https?://)(.+)?(hamody|nathanaeldan|freddyoctavio|davisonbarker|clks|cryptosh|bestfonts|gitlink|openurl)(.pro)(/.*)/",
    "/^(https?://)(up-load|zcash|mdisk)(.one)(/.*)/",
    "/^(https?://)(1dogecoin|faucet)(.work)(/.*)/",
    "/^(https?://)(sh.feyorra|fey.feyorra|claim|surelink|chuksblog|superlink|pricenews)(.fun)(/.*)/",
    "/^(https?://)(go|blog|go2|tech|test|blg)(.madshiba.fun)(/.*)/",
    "/^(https?://)(linkati|zenshort|curto|sh.kiddypay)(.win)(/.*)/",
    "/^(https?://)(cool-time|movies|anime|tech)(.dutchycorp.space)(/.*)/",
    "/^https://linkvertise.com/(1|2|3|4|5|6|7|8|9)/",
    "/^https://cryptofans.club/(short|next|other|step)/",
    "/^(https?://)(.+)?(mediafire)(.com)/(download|file)/",
    "/^(https?://)(.+)?(cryptocurrencytracker|freefaucet)(.biz)/(link)/",
    "/^(https?://)(.+)?(freebitcoin)(.fun)/(topsites|view)/",
    "/^(https?://)(.+)?(clickscoin|freefeyorra|reddcoineveryday|cryptotyphoon|softairbay)(.com)/(short)/",
  ],
  exclude: [
    "/^https://claimclicks.com/(btc|ltc|doge|trx|faucetlist|ptclist)/",
    "/^https://claimercorner.xyz/(claimer/dashboard|claimer/advertise|claimer/ptc|claimer/deposit|claimer/transfer|claimer/tasks|claimer/offerwall|claimer/profile|claimer/auto|claimer/mining|claimer/wheel|claimer/login)/",
    "/^https://cryptosats.net/(cryptosats/dashboard|cryptosats/advertise|cryptosats/ptc|cryptosats/deposit|cryptosats/transfer|cryptosats/tasks|cryptosats/offerwall|cryptosats/profile|cryptosats/auto|cryptosats/mining|cryptosats/wheel|cryptosats/login)/",
    "/^https://99faucet|faucet.cempakajaya.com/(dashboard|advertise|ptc|deposit|transfer|tasks|offerwall|profile|auto|mining|dice|lottery|faucet|login)/",
    "/^https://free.tribuncrypto.com/(dashboard|advertise|ptc|deposit|transfer|tasks|offerwall|profile|auto|mining|dice|lottery|faucet|login)/",
    "*://*.vosan.co/",
  ],
  match: [
    "*://dutchycorp.space/s*/*",
    "*://dutchycorp.ovh/s*/*",
    "*://shorts.lu/*",
    "*://adx.wiki/*",
    "*://adx.cx/*",
    "*://al.ly/*",
    "*://za.gl/*",
    "*://goo.st/*",
    "*://c2g.at/*",
    "*://fcc.lc/*",
    "*://adz.moe/*",
    "*://coin.mg/*",
    "*://send.cm/*",
    "*://kimo.ma/*",
    "*://goads.ly/*",
    "*://mdn.rest/*",
    "*://*.mdn.lol/*",
    "*://*.rota.cc/*",
    "*://ouo.press/*",
    "*://7cc.96.lt/*",
    "*://*.flyzu.icu/*",
    "*://tinyurl.is/*",
    "*://*.mdn.world/*",
    "*://nail.edu.pl/*",
    "*://lolabits.se/*",
    "*://3shorturl.gq/*",
    "*://litecoin.host/*",
    "*://*.goto.com.np/*",
    "*://z-cash.xyz/ad/*",
    "*://drop.download/*",
    "*://cryptofuns.ru/*",
    "*://gosixs.com/s/*",
    "*://linkshrink.ca/*",
    "*://short.express/*",
    "*://arbweb.info/sl/*",
    "*://*.cizgifilm.tv/*",
    "*://faucethub.ly/hs/*",
    "*://faucetpay.io/ptc*",
    "*://*.trangchu.news/*",
    "*://webmobile.store/*",
    "*://*.adz7short.space/*",
    "*://docs.google.com/uc*",
    "*://starfaucet.net/sl/*",
    "*://solarchaine.com/sl/*",
    "*://shrt.cryptofuns.ru/*",
    "*://iqfaucet.com/link3/*",
    "*://horrorbitcoin.com/?*",
    "*://satoshi-win.xyz/url/*",
    "*://cryptonetos.ru/page/*",
    "*://faucet.gold/BTC/?step*",
    "*://faucet.gold/ETH/?step*",
    "*://adbtc.top/surf/browse/*",
    "*://anonym.ninja/download/*",
    "*://claimsolana.xyz/short/*",
    "*://faucetcrypto.net/short/*",
    "*://stationbit.xyz/autolink/*",
    "*://cryptoaffiliates.store/sh*",
    "*://konstantinova.net/verify/*",
    "*://playnano.online/watch-and*",
    "*://adbtc.top/surfiat/browse/*",
    "*://rotator.nurul-huda.sch.id/*",
    "*://*api-secure.solvemedia.com/*",
    "*://faucetcrypto.com/claim/step/*",
    "*://linkvertise.download/download/*",
    "*://*.racedepartment.com/downloads/*",
    "*://cryptorotator.website/sh_live/*",
    "*://cryptonetos.ru/page/redirect*",
    "*://galerybits.com/protectlink/*",
    "*://earnultimate.space/short/*",
    "*://bas.nurul-huda.or.id/*",
  ],
};

let url = location.href;
let willRun = false;
// TODO : calculate willRun

if (willRun) {
  // prettier-ignore
  (function() {
    'use strict';
    const RexBp = new RegExp(/^\?([^&]+)/);
    const bp = query => document.querySelector(query);
    const elementExists = query => bp(query) !== null;
    const domainCheck = domains => new RegExp(domains).test(location.host);
    function click(query) {bp(query).click();}
    function submit(query) {bp(query).submit();}
    function clickIfElementExists(query, timeInSec = 1, funcName = 'setTimeout') {if (elementExists(query)) {window[funcName](function() {click(query);}, timeInSec * 1000);}}
    function Captchasub(query, act = 'submit', timeInSec = 0.5) {if (elementExists(query)) {var timer = setInterval(function() {if (window.grecaptcha && !!window.grecaptcha.getResponse?.()) {bp(query)[act](); clearInterval(timer);}}, timeInSec * 1000);}}
    function Captchaklik(query, act = 'click', timeInSec = 1) {if (elementExists(query)) {var timer = setInterval(function() {if (window.grecaptcha && !!window.grecaptcha.getResponse?.()) {bp(query)[act](); clearInterval(timer);}}, timeInSec * 1000);}}
    function redirect(url, blog = true) {location = blog ? 'https://rotator.nurul-huda.sch.id/?url=' + url : url;}
    function BypassedByBloggerPemula(re_domain, data, blog) { if (!re_domain.test(location.host)) return;
        if (typeof data === 'function') return data();
        if (Array.isArray(data)) data = {'/': data};
        if (!(location.pathname in data)) return;
        const [key, value] = data[location.pathname];
        if (typeof key === 'object' && key.test(location.search)) return redirect(value + RegExp.$1, blog);
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has(key)) redirect(value + searchParams.get(key), blog);}
    function BloggerPemula(domains, data, url, blog, use = null) {const searchParams = new URLSearchParams(location.search);
        if (!domainCheck(domains)) return;
        if (typeof data === 'string' && data.split(',').every(p => searchParams.has(p))) {use ??= data.split(',')[0];
            redirect(url + searchParams.get(use), blog);} else if (typeof data === 'object') {const o = data[location.pathname];
        if (!o) return; BloggerPemula(domains, ...o);}}
    function meta(href) {document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'referrer', content: 'origin'}));
        Object.assign(document.createElement('a'), {href}).click();}
    function waitForElm(query, callback) {setTimeout(function() {if (elementExists(query)) {callback(bp(query));} else {waitForElm(query, callback);}}, 1000);}
    function notify(txt, width = 780) { const m = document.createElement('div');
             m.style.padding = '5px'; m.style.zIndex = 99999999; m.style.position = 'fixed'; m.style.boxSizing = 'border-box';
             m.style.width = `${width}px`; m.style.top = '100px'; m.style.left = `${innerWidth / 2 - width / 2}px`; m.style.font = 'normal bold 20px sans-serif';
             m.style.backgroundColor = 'white'; m.innerText = txt; document.body.appendChild(m);}
    // There will be a Special Tricks and Bypass Codes only for Good Users (Anyone who have good attitude , Good Feedback, will be invited to my group)
    BloggerPemula('sport4you.net|nadersoft7.com|manga2day.com|pickhopes.com|gam3ah.com|cars-1year.xyz|m4cut.com', 'link', '', false);
    BloggerPemula('rupamobile.in', 'go', 'https://mdisk.one/', false);
    BloggerPemula('rsrlink.in', 'link', 'https://go.rsrlink.in/', false);
    BloggerPemula('itechmafiia.com', 'link', 'https://v.earnl.xyz/', false);
    BloggerPemula('veganab.co', 'link', 'https://techy.veganab.co/', false);
    BloggerPemula('siteblog.in', 'link', 'https://go.droplink.co.in/', false);
    BloggerPemula('tr.link|fauceteen.xyz|adpaylink.com', 'url,api', '', false);
    BloggerPemula('dealprice.co', 'adlinkfly', 'https://pricenews.fun/', false);
    BloggerPemula('ww1.linktrims.com', 'link', 'https://linktrims.com/', false);
    BloggerPemula('akcartoons.in', 'link', 'https://back.expertlinks.in/', false);
    BloggerPemula('missionhight.in', 'link', 'https://playdisk.url2go.in/', false);
    BloggerPemula('tech.techwhom.com', 'jeton', 'https://we.techwhom.com/', false);
    BloggerPemula('linkshortifyx.link', 'link', 'https://yo.linkshortify.net/', false);
    BloggerPemula('ffworld.xyz|doibihar.org', 'link', 'https://go.linkbnao.com/', false);
    BloggerPemula('team.pastehosting.com', 'adlinkfly', 'https://shortxlinks.com/', false);
    BypassedByBloggerPemula(/7apple.net/, {'/verify/': [RexBp, 'http://illink.net/'],}, false);
    BypassedByBloggerPemula(/techdaze.in/, {'/': [RexBp, 'https://web.mdiskplayer.in/'],}, false);
    BypassedByBloggerPemula(/rklinks.in/, {'/verify/': [RexBp, 'https://blog.inkik.in/'],}, false);
    BypassedByBloggerPemula(/jemari.net/, {'/verify/': [RexBp, 'http://skip.jemari.net/'],}, false);
    BypassedByBloggerPemula(/mymobilehub.in/, {'/safe.php': ['link', 'https://modlink.co/'],}, false);
    BypassedByBloggerPemula(/medipost.org/, {'/verify/': [RexBp, 'http://go.theconomy.me/?'],}, false);
    BypassedByBloggerPemula(/theconomy.me/, {'/verify/': [RexBp, 'http://links.medipost.org/'],}, false);
    BypassedByBloggerPemula(/shopsixseven.com/, {'/verify/': [RexBp, 'http://safelinkduit.com/'],}, false);
    BypassedByBloggerPemula(/linkwards.co.in/, {'/verify/': [RexBp, 'http://ads.linkwards.com/'],}, false);
    BypassedByBloggerPemula(/uploadsoon.com/, {'/safe.php': ['link', 'https://shrinkforearn.in/'],}, false);
    BypassedByBloggerPemula(/link.linksfire.co/, function() {location = location.href.replace('link', 'blog');});
    BypassedByBloggerPemula(/speedynews.xyz/, {'/blog/verify/': [RexBp, 'https://links.speedynews.xyz/'],}, false);
    //BypassedByBloggerPemula(/blogs.egfly.xyz/, function() {location = location.href.replace('blogs.', 'link.');});
    BypassedByBloggerPemula(/studyuo.com/, {'/pro2/verify/': [RexBp, 'https://speedynews.xyz/blog/verify/?'],}, false);
    BypassedByBloggerPemula(/short.rainurl.com|short.snowurl.com/, function() {location = location.href.replace('short.', '');});
    BypassedByBloggerPemula(/teachsansar.com/, () => waitForElm("#wpsafegenerate > #wpsafe-link > a[href]", safe => redirect(safe.href)));
    BypassedByBloggerPemula(/go.birdurls.com|go.owllink.net|go.illink.net|go.pong.pw/, function() {location = location.href.replace('go.', '');});
    const sl = (h => {switch (h.host) {
    case 'mobileprice.site': if (h.searchParams.has('alex')) { return 'https://msarzone.com/p/' + h.searchParams.get('alex');} break;
    case 'bestmobilenew.com': if (h.searchParams.has('get')) { return 'https://link2end.com/p/' + h.searchParams.get('get').substring(1);} break;
    case 'adlink.bitcomarket.net': if (h.searchParams.has('go')) { return 'https://adshorti.co/' + h.searchParams.get('go').substring(1);} break;
    case 'theconomy.me': case 'blog.medipost.org': if (h.pathname === '/' && /^\?([^&]+)/.test(h.search)) { meta('https://links.medipost.org/' + RegExp.$1);} break;
    default: break;} })(new URL(location.href)); if (sl) {location.href = sl; }
    BypassedByBloggerPemula(/adbtc.top/, function() {let count =0; setInterval(function(){if(bp("div.col.s4> a") && !bp("div.col.s4> a").className.includes("hide")){count = 0;bp("div.col.s4> a").click();}else{count = count + 1;}},5000);
    window.onbeforeunload = function() {if (unsafeWindow.myWindow) {unsafeWindow.myWindow.close();}if (unsafeWindow.coinwin) {let popc = unsafeWindow.coinwin;unsafeWindow.coinwin = {};popc.close();}};});
    BypassedByBloggerPemula(/dropz.xyz/, function() {if (window.location.href.includes('/captcha')&& !window.location.href.includes('/roll')) {}else if (window.location.href.includes('/site-friends')) {let windowName = "";let currentwindowOpenFunction = unsafeWindow.open;function newwindowOpenFunction(params1, params2) {if (!params2 || params2 == "_blank") {windowName = "popUpWindowMyDropz";} else {windowName = params2;} return currentwindowOpenFunction(params1, windowName);};unsafeWindow.open = newwindowOpenFunction;unsafeWindow.onbeforeunload = function() {currentwindowOpenFunction('', windowName).close();};
    function endsWithNumber(str){return isNaN(str.slice(-1)) ? false : true;}let clicked = false;setInterval(function(){for(let i=0; i< document.querySelectorAll(".btn.btn-info").length; i++){if(!clicked && !endsWithNumber(document.querySelectorAll(".btn.btn-info")[i].getAttribute('id')) && !document.querySelectorAll(".btn.btn-info")[i].innerText.includes("Submits")){document.querySelectorAll(".btn.btn-info")[i].click();break;}}},10000);} else {}});
    // Injecting from start document coded by @JustOlaf
    if (location.host === 'techcyan.com'){delete window.document.referrer; window.document.__defineGetter__('referrer', function () {return "https://google.com/";});}
    // Injecting from start document code by https://gist.github.com/lenivene
    if (['magybu.net', 'xervoo.net', 'hurirk.net', 'usfinf.net', 'eloism.net', 'neexulro.net'].indexOf(location.host) > -1){Object.defineProperty(window,"ysmm",{set:function(b){var a=b,c="",d="";for(b=0;b<a.length;b++)0==b%2?c+=a.charAt(b):d=a.charAt(b)+d;a=(c+d).split("");for(b=0;b<a.length;b++)if(!isNaN(a[b]))for(c=b+1;c<a.length;c++)isNaN(a[c])||(d=a[b]^a[c],10>d&&(a[b]=d),b=c,c=a.length);a=a.join("");a=window.atob(a);a=a.substring(a.length-(a.length-16));!(b=a=a.substring(0,a.length-16))||0!==b.indexOf("http://")&&0!==b.indexOf("https://")||(document.write("\x3c!--"),window.stop(),window.onbeforeunload=null,window.location=b);}});}
    // Injecting code from start and the end of document coded by @Konf
    if (['interactive', 'complete'].includes(document.readyState)) {onHtmlLoaded();} else {document.addEventListener('DOMContentLoaded', onHtmlLoaded);} function onHtmlLoaded() {if (['bas.nurul-huda.or.id', 'rotator.nurul-huda.sch.id'].indexOf(location.host) > -1){ } else { const listhide = document.querySelectorAll('#frame,.adb,#iframe,#particles-js,#canvas,.floawing-banner,#orquidea-slideup,.floating-banner,#wcfloatDiv4,#preloader,.vanta-canvas,.particles-js-canvas-el,#s65c,#ofc9,#overlay,#footerads,#d7b2,#_m_a_,#masthead_,.oulcsy,.sticky-bottom,.sticky-bottom1,.sticky-bottom2,.sticky-bottom3,.bElNbEFRL3JvbG89,.separator,html body iframe,html iframe,#cookie-pop,.vmyor,.tnjmvneldp,.full_post_area.rh-container,.sc-content-aside,#ofc9,.floawing-banner,div.demand-supply,.the_content,.alternative-ad'); for (const element of listhide) {element.remove();}}
    if (['up4cash.com', 'app.menjelajahi.com', 'blog.menjelajahi.com'].indexOf(location.host) > -1){ } else { const listre = document.querySelectorAll('.banner-inner'); for (const element of listre) {element.remove();}}
    if (['taiwancnan.com', 'blog.disheye.com'].indexOf(location.host) > -1){ } else { const listr = document.querySelectorAll('.blog-item'); for (const element of listr) {element.remove();}}
    if (['patak.dropz.xyz', 'my.dropz.xyz'].indexOf(location.host) > -1){ } else { const listd = document.querySelectorAll('.text-left'); for (const element of listd) {element.remove();}}
    if (location.host === 'jardima.com'){ } else { const listj = document.querySelectorAll('.td-ss-main-content'); for (const element of listj) {element.remove();}}
    if(location.href.indexOf("diudemy.com") != -1 || location.href.indexOf("djxmaza.in") != -1 || location.href.indexOf("on-scroll.com") != -1 || location.href.indexOf("blog-everything.com") != -1 || location.href.indexOf("proviralhost.com") != -1 ) {
    (function() {let FastInt = '{{1}}';if ( FastInt === '{{1}}' ) { FastInt = ''; }let delayArg = '{{2}}';if ( delayArg === '{{2}}' ) { delayArg = ''; }let boostArg = '{{3}}';if ( boostArg === '{{3}}' ) { boostArg = ''; }
    if ( FastInt === '' ) {FastInt = '.?';} else if ( FastInt.charAt(0) === '/' && FastInt.slice(-1) === '/' ) {FastInt = FastInt.slice(1, -1);} else {FastInt = FastInt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');}const FastInter = new RegExp(FastInt);
    let delay = delayArg !== '*' ? parseInt(delayArg, 10) : -1;if ( isNaN(delay) || isFinite(delay) === false ) { delay = 1000; }
    let boost = parseFloat(boostArg);boost = isNaN(boost) === false && isFinite(boost) ? Math.min(Math.max(boost, 0.02), 50) : 0.05; self.setInterval = new Proxy(self.setInterval, {apply: function(target, thisArg, args) {const [ a, b ] = args;
    if ((delay === -1 || b === delay) && FastInter.test(a.toString())) {args[1] = b * boost;}return target.apply(thisArg, args);}});})();}
    // ============================================
    // Captcha Mode
    // ============================================
    let captchaMode = ['#_mform', '#userForm', '#link-view', '#frmprotect', '#ShortLinkId', '#submit-form', '#lview > form', '#file-captcha', '#btget > form', 'div#login form', 'F1', '#short-captcha-form', '#wpsafelink-landing', '.col-12 > form:nth-child(1)', '.col-md-4 > form:nth-child(1)', '.col-md-6 > form:nth-child(4)', '.contenido > form:nth-child(2)', '#main > div:nth-child(4) > form:nth-child(1)', 'div.col-md-12:nth-child(3) > form:nth-child(1)', '.content > div:nth-child(4) > form:nth-child(1)', '#showMe > center:nth-child(4) > form:nth-child(1)', '.sect > div:nth-child(1) > center:nth-child(7) > form:nth-child(1)', '#showMe > center:nth-child(1) > center:nth-child(4) > form:nth-child(1)', '#adb-not-enabled > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > form:nth-child(1)', 'button#continue.btn.btn-primary.btn-captcha', '.m-2.btn-captcha.btn-outline-primary.btn', '#yuidea-btn-before.yu-btn.yu-blue', '#yuidea-btn-after.yu-blue.yu-btn', '#fauform'];
    for (let i = 0; i < captchaMode.length; i++) {Captchasub(captchaMode[i]);}
    let klikMode = ['button#continue.btn.btn-primary.btn-captcha', '.m-2.btn-captcha.btn-outline-primary.btn', '#yuidea-btn-before.yu-btn.yu-blue', '#yuidea-btn-after.yu-blue.yu-btn', '#submitBtn'];
    for (let i = 0; i < klikMode.length; i++) {Captchaklik(klikMode[i]);}
    // ============================================
    // SetTimeout Mode
    // ============================================
    let timeoutMode = {
        '2': ['.gobut'],
        '3': ['p.getlink', 'button.jeje', '.yu-blue.yu-btn', 'button#btn-get-link', '#links > a:nth-child(2)', 'button.btn-main.get-link', 'button#btn6.yu-btn.yu-go', '.mb-3 > .btn-primary.btn', 'input[name="method_free"]', 'div#wpsafe-generate a img', 'button#mdt.custom-btn.btn-7', 'button#btn-main.btn.btn-main', 'button#bt.btn.btn-info.btn-lg', 'button#article.btn.btn-success', 'input#btn-main.btn.btn-primary', 'button#getlink.getlink.disabled', '#link1s-snp > button:nth-child(1)', '#link1s-snp > button:nth-child(1)', 'button#showTimerText.btn.btn-accent', '#wpsafelinkhuman > img:nth-child(1)', 'button#submit-button.btn.btn-primary', '.next-button.text-white.btn-info.btn', 'button#btn6.g-recaptcha.btn.btn-primary', '#cl1 > a:nth-child(2) > font:nth-child(1)', '#cl1 > center:nth-child(1) > a:nth-child(1)', '.next-button.btn-lg.text-white.btn-info.btn', 'button#btn6.btn.btn-outline-primary.btn-captcha.m-2', '.col-md-8 > form:nth-child(17) > button:nth-child(3)', 'div.box-main:nth-child(2) > div:nth-child(4) > a:nth-child(1)', 'div.column:nth-child(2) > font:nth-child(2) > a:nth-child(8)'],
        '4': ['.exclude-popad.open-continue-btn-org.btn-primary.btn'],
        '5': ['#yuidea-btmbtn', 'div.complete a.btn', 'button#g-recaptcha.gobt', '#molien > a:nth-child(1)', 'a#surl1.btn-main.get-link', '#wpsafe-snp > a:nth-child(1)', '.close-ad-modal-go-ahead.close', 'button#invisibleCaptchaShortlink.btn-main.get-link', 'button#invisibleCaptchaShortlink.btn.ybtn.ybtn-accent-color.btn-captcha', 'button#invisibleCaptchaShortlink.btn.btn-outline-primary.btn-lg.btn-block.btn-captcha'],
        '7': ['button#invisibleCaptchaShortlink.btn.btn-primary.btn-goo.btn-captcha'],
        '9': ['div.lds-ellipsis']};
    let _timeoutMode = Object.keys(timeoutMode);
    for (let i = 0; i < _timeoutMode.length; i++) {for (let j = 0; j < timeoutMode[_timeoutMode[i]].length; j++) {clickIfElementExists(timeoutMode[_timeoutMode[i]][j], +_timeoutMode[i]);}}
    // ============================================
    // setInterval Mode
    // ============================================
    let intervalMode = {
        '3': ['#slu-link', '#makingdifferenttimer', 'a#finalx22.btn.btnstep1', '#wg-form > .btnstep1.btn', '#myButtonn > span:nth-child(1)', 'input.g-recaptcha.btn.btn-primary', '#mdt.btn.btn-primary.text-white.next-button', 'div.column:nth-child(2) > font:nth-child(2) > a:nth-child(8)', 'button#main-button.claim-button.btn.btn-lg.btn-accent', 'a.get-link.bg-red-600.px-8.py-2.rounded-md.inline-block'],
        '5': ['a.btn-main.get-link', 'a.btn.m-2.btn-success', '.btn-danger.btn-raised', '#link1s.btn-primary.btn', '.close-me > a:nth-child(1)', 'button#link.btn.btn-primary', '#btn6.btn-captcha.btn-primary.btn', 'a.btn.btn-primary.get-link.text-white', '#makingdifferenttimer9 > .btn-success.btn'],
        '7': ['#nextButton', 'button#get_link.btn.btn-primary.btn-sm']};
    let _intervalMode = Object.keys(intervalMode);
    for (let i = 0; i < _intervalMode.length; i++) {for (let j = 0; j < intervalMode[_intervalMode[i]].length; j++) {clickIfElementExists(intervalMode[_intervalMode[i]][j], +_intervalMode[i], 'setInterval');}}
    waitForElm('div#wpsafe-link > a', function(element) {const regex = /redirect=(.*)',/;
    const m = regex.exec(element.onclick.toString())[1]; location.href = JSON.parse(atob(m)).safelink;});
    if (typeof hcaptcha=="object" && typeof apiCounter=="object") { window.app_country_visitor="";
        window.hcaptcha.getResponse=()=>{};
        window.apiCounter.generateURL();
        window.apiCounter.redirectTo(bp("button.button-element-verification"));}
    if (typeof tokenURL=="string") { redirect(atob(window.tokenURL));}
    if (elementExists('#before-captcha')) { setTimeout(function() {bp('#before-captcha').submit();}, 3000);}
    if (elementExists('#surl')) { setInterval(function() { bp('#surl.btn-success.m-2.btn').click();}, 5000);}
    if (elementExists('#url_qu')) { setTimeout(function() {bp('.ad-banner.btn-captcha.btn-primary.btn').click();}, 3000);}
    if (bp('#link-view > div[style="display: none;"]')) {bp('#link-view > div[style="display: none;"]').style.display = '';}
    if (elementExists('a#firststep-btn.btn.btnstep1')) { setTimeout(function() {bp('button#getlink.btn.m-2.btn-success.disabled').click();}, 3000);}
    if (location.host === 'faucetpay.io') {} else {Captchasub('form.text-center');}
    if (['www.4shared.com', 'stfly.me'].indexOf(location.host) > -1) {} else {Captchasub("form[action='']");}
    if (location.host === 'www.upload-4ever.com') {} else {clickIfElementExists('.btn-outline-white.btn', 3);}
    if (location.host === 'uploadhaven.com') {} else {clickIfElementExists('button.btn-block.btn-success', 5, 'setInterval');}
    if (['ctbl.me', 'zshort.cc'].indexOf(location.host) > -1 && location.search === '') {location = 'https://mdn.rest/?url8j=' + location.href;}
    if (location.host === 'fc-lc.com') {window.top != window.self;} else {clickIfElementExists('button#submitbtn.g-recaptcha.btn.btn-primary', 3);}
    if (['uploadhaven.com', 'patak.dropz.xyz', 'my.dropz.xyz'].indexOf(location.host) > -1) {} else {clickIfElementExists('button.btn.btn-success', 7);}
    if (['paid4.link', 'ponselharian.com'].indexOf(location.host) > -1) {window.top != window.self;} else {clickIfElementExists('.btn-captcha.btn-sm.btn-primary.btn', 5);}
    if (['www.solidfiles.com', 'usersdrive.com', 'workupload.com'].indexOf(location.host) > -1) {} else {clickIfElementExists('.btn-sm.btn-default.btn', 5, 'setInterval');}
    if (['konstantinova.net', 'mobilereview.info'].indexOf(location.host) > -1) {} else {if (elementExists('#makingdifferenttimer')) { setInterval(function() { bp('#url_qu > a:nth-child(1)').click();}, 3000);}}
    if (['coin.mg', 'rancah.com'].indexOf(location.host) > -1) {window.top != window.self;} else {if (elementExists('#links')) { setInterval(function() { bp('#links > form:nth-child(2)').submit();}, 3000);}}
    if (['rancah.com','trangchu.news', 'techacode.com','downfile.site','upload-4ever.com'].includes(window.location.hostname) > -1) {window.top != window.self;} else {clickIfElementExists('input.btn.btn-primary', 5);}
    if (location.host === 'teknosimple.com' && bp('.slu-captcha') !== null) {var ts = function() {if (window.grecaptcha.getResponse?.().length > 0) {bp('#slu-continue.slu-button').click(); clearInterval(ks);}};var ks = setInterval(ts, 500);}
    if (['trangchu.news', 'downfile.site', 'techacode.com'].includes(window.location.hostname) > -1 && bp('.captcha') !== null) {var o = function() {if (window.grecaptcha.getResponse?.().length > 0) {bp('#proceed').click(); clearInterval(k);}};var k = setInterval(o, 500);}
    if (location.host === 'faucetpay.io' && bp('.h-captcha') !== null) {var fp = function() {if (window.grecaptcha.getResponse?.().length > 0) {bp('.btn-danger.btn-lg.btn').click(); clearInterval(fcp);}};var fcp = setInterval(fp, 500);}
    if (['blogmado.com','fc-lc.com', 'chooyomi.com','paid4.link','usersdrive.com', 'zentum.club', 'patak.dropz.xyz', 'my.dropz.xyz', 'workupload.com', 'taiwancnan.com','solarchaine.com','shortit.pw','djxmaza.in'].indexOf(location.host) > -1) {window.top != window.self;} else {clickIfElementExists('button.btn:nth-child(4)', 2, 'setInterval');}
    if (['bitlinks.pw','ayelads.com', 'apkadmin.com','cashearn.cc','rancah.com','digitalnaz.net','upload-4ever.com','hexupload.net','upfiles.app','cut-y.co','keeplinks.org','fileshare.adshorturl.com','bowfile.com','letsupload.io','workupload.com'].includes(window.location.hostname) > -1) {} else {if (elementExists('div.col-md-4:nth-child(2)')) { setInterval(function() { bp('div.col-md-4:nth-child(2) > span:nth-child(1) > img:nth-child(1)').click();}, 5000);}}
    let Numcode = bp('input.captcha_code'); let DigitNum;
    function getLeft (d) {return parseInt(d.style.paddingLeft);}
    if (Numcode) {DigitNum = Numcode.parentElement.previousElementSibling.children[0].children;
    Numcode.value = [].slice.call(DigitNum).sort(function (d1, d2) {return getLeft(d1) - getLeft(d2);}).map(function(d){return d.textContent;}).join('');}
    let $ = window.jQuery; let respect = 'https://bas.nurul-huda.or.id/?url='; // Don't use My Scripts if You Change/Remove My Blogs, Except You Make Donations!!!.
    if (location.host === 'www.4shared.com') {if (elementExists('.d3topTitle')) {$('.premium').text('IMPORTANT TRICKS By BloggerPemula : Wait 5 Second or more , Dont Close this Page ,Right Click Here Link Above, Open Link in New Tab, Close the Tabs if Your File not Downloaded, Try again the Right Click Methods, at This Time i Dont have Idea to Make it Auto , Do the Same Trick for All File Type in 4shared Site . Regards...');}}
    if (['short.croclix.me','www.adz7short.space'].indexOf(location.host) > -1) {function fireMouseEvents(query) { const element = document.querySelector(query);
    if (!element) return; ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(eventName => {if (element.fireEvent) { element.fireEvent('on' + eventName);} else { const eventObject = document.createEvent('MouseEvents');
     eventObject.initEvent(eventName, true, false); element.dispatchEvent(eventObject);}});}
     setInterval(function() { if ($("#link").length > 0) { fireMouseEvents("#link");}}, 500);
     setInterval(function() { if ($("input#continue").length > 0) {fireMouseEvents("input#continue");}
    if ($("a#continue.button").length > 0) {fireMouseEvents("a#continue.button");}}, 9000); setTimeout(function() {if ($("#btn-main").length < 0) return; fireMouseEvents("#btn-main");}, 5000);}
    if (['upfiles.app', 'cut-y.co'].indexOf(location.host) > -1) {clickIfElementExists('.get-link.btn-download.btn-primary.btn', 7);} else if (location.host === 'rodjulian.com') {clickIfElementExists('a.btn.btn-primary.btn-lg.get-link', 5, 'setInterval');} else if (location.href.indexOf("ay.live") != -1 || location.href.indexOf("aylink.co") != -1 || location.href.indexOf("gitlink.pro") != -1) { var form = $('#go-link');
    $.ajax({type: 'POST', async: true, url: form.attr('action'), data: form.serialize(), dataType: 'json', success: function(data) {redirect(data.url);}});} else if (elementExists('#go-link')) {$("#go-link").unbind().submit(function(e) {e.preventDefault(); var form = $(this); var url = form.attr('action'); const pesan = form.find('button'); const notforsale = $(".navbar-collapse.collapse"); const blogger = $(".main-header"); const pemula = $(".col-sm-6.hidden-xs");
    $.ajax({type: "POST", url: url, data: form.serialize(), beforeSend: function(xhr) { pesan.attr("disabled", "disabled"); $('a.get-link').text('Bypassed by Bloggerpemula');
    notforsale.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : Bloggerpemula</b></button>');
    blogger.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : Bloggerpemula</b></button>');
    pemula.replaceWith('<button class="btn btn-default , col-md-12 text-center" onclick="javascript: return false;"><b>Thanks for using Bypass All Shortlinks Scripts and for Donations , Regards : Bloggerpemula</b></button>');}, success: function(result, xhr) {location.href=respect+result.url;}});});}
    const bas = (h => { const result = { isNotifyNeeded: false, redirectDelay: 0, link: undefined };
    switch (h.host) {case 'bas.nurul-huda.or.id': case 'rotator.nurul-huda.sch.id': if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('sn')) {
        result.link = h.searchParams.get('url') + '&sn=' + h.searchParams.get('sn').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('sub_id') && h.searchParams.has('site_id') && h.searchParams.has('ip_address')) {
        result.link = h.searchParams.get('url') + '&sub_id=' + h.searchParams.get('sub_id') + '&site_id=' + h.searchParams.get('site_id') + '&ip_address=' + h.searchParams.get('ip_address'); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('X-Amz-Algorithm') && h.searchParams.has('X-Amz-Credential') && h.searchParams.has('X-Amz-Date') && h.searchParams.has('X-Amz-SignedHeaders') && h.searchParams.has('X-Amz-Expires') && h.searchParams.has('X-Amz-Signature')) {
        result.link = h.searchParams.get('url') + '&X-Amz-Algorithm=' + h.searchParams.get('X-Amz-Algorithm') + '&X-Amz-Credential=' + h.searchParams.get('X-Amz-Credential') + '&X-Amz-Date=' + h.searchParams.get('X-Amz-Date') + '&X-Amz-SignedHeaders=' + h.searchParams.get('X-Amz-SignedHeaders') + '&X-Amz-Expires=' + h.searchParams.get('X-Amz-Expires') + '&X-Amz-Signature=' + h.searchParams.get('X-Amz-Signature'); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('ssa') && h.searchParams.has('id')) {
        result.link = h.searchParams.get('url') + '&ssa=' + h.searchParams.get('ssa') + '&id=' + h.searchParams.get('id').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('id')) {
        result.link = h.searchParams.get('url') + '&id=' + h.searchParams.get('id').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('article')) {
        result.link = h.searchParams.get('url') + '&article=' + h.searchParams.get('article').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('antibot')) {
        result.link = h.searchParams.get('url') + '&antibot=' + h.searchParams.get('antibot').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('code')) {
        result.link = h.searchParams.get('url') + '&code=' + h.searchParams.get('code').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.searchParams.has('viewed')) {
        result.link = h.searchParams.get('url') + '&viewed=' + h.searchParams.get('viewed').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.pathname === '/shortlink.php' && h.searchParams.has('sl')) {
        result.link = h.searchParams.get('url') + 'sl' + h.searchParams.get('sl').replace('&m=1', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.href.includes('#')) {
        result.link = h.searchParams.get('url') + $(location).attr('hash'); result.redirectDelay = 5; result.isNotifyNeeded = true; return result;
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.href.includes('bloogerspoot.')) {window.location.assign('https://softindex.website'+ (location.search).substring(27));
    } else if (h.pathname === '/' && h.searchParams.has('url') && h.href.includes('gos2.urlcash')) {window.location.assign('https://urlcash.click'+ (location.search).substring(31));
    } else if (h.pathname === '/' && h.searchParams.has('url')) {
        result.link = h.searchParams.get('url').replace('&m=1', '').replace('<br />', ''); result.redirectDelay = 5; result.isNotifyNeeded = true; return result; } break;
        default: break;}})(new URL(location.href));
    if (bas) { const { isNotifyNeeded, redirectDelay, link } = bas;
    if (isNotifyNeeded) { notify(`Please Wait a moment .....You will be Redirected to Your Destination in ${redirectDelay} seconds`);}
        setTimeout(() => {location.href = link;}, redirectDelay * 1000);}
    const l = (h => {const b = h.pathname === '/verify/' && /^\?([^&]+)/.test(h.search); const p = h.pathname === '/blog3/verify/' && /^\?([^&]+)/.test(h.search);
    switch (h.host) {case 'okrzone.com': if (b) { meta('https://gtlink.co/' + RegExp.$1);} break;
    case 'ezimg.co': if (b) { meta('https://eng.ezimg.co/' + RegExp.$1);} break;
    case 'educur.com': if (b) { meta('https://blog.flyrar.com/' + RegExp.$1);} break;
    case 'tecmundo.net': if (b) { meta('https://go.jaelink.us/' + RegExp.$1);} break;
    case 'examkhata.com': if (b) { meta('https://playlink.xyz/' + RegExp.$1);} break;
    case 'examsolution.in': if (b) { meta('https://kukslincs.xyz/' + RegExp.$1);} break;
    case 'mytop5.club': if (b) { meta('https://technemo.xyz/blog/' + RegExp.$1);} break;
    case 'ledifha.com': if (b) { meta('https://process.ledifha.com/' + RegExp.$1);} break;
    case 'adybrands.in': if (b) { meta('https://mytop5.club/verify/?' + RegExp.$1);} break;
    case 'forexshare.net': if (b) { meta('https://shorturl.sh2rt.com/' + RegExp.$1);} break;
    case 'www.lootcash.vip': if (b) { meta('https://ads.lootcash.vip/' + RegExp.$1);} break;
    case 'www.allcryptotips.com': if (b) { meta('https://zenshort.com/' + RegExp.$1);} break;
    case 'gamerfang.in': if (b) { meta('https://faux.gamerfang.in/tech/' + RegExp.$1);} break;
    case 'economiarelevante.com.br': if (b) { meta('https://shrinkgold.com/' + RegExp.$1);} break;
    case 'techrayzer.com': if (b) { meta('https://techrayzer.com/insurance/' + RegExp.$1);} break;
    case 'teerclub.com': if (b) { meta('https://www.allcryptotips.com/verify/?' + RegExp.$1);} break;
    case 'techboyz.xyz': case 'studystar.xyz': if (b) { meta('https://short2fly.xyz/' + RegExp.$1);} break;
    case 'zuba.link': if (/^\/([^\/]+)/.test(h.pathname)) { return 'https://go.zuba.link/' + RegExp.$1; } break;
    case 'faucethub.ly': if (/^\/hs\/\/([^\/]+)/.test(h.pathname)) {return 'https://goads.ly/' + RegExp.$1;}break;
    case 'cekip.site': case 'www.cekip.site': if (/^\/go\/([^\/]+)/.test(h.pathname)) { meta(atob(RegExp.$1));} break;
    case 'sl.easysl.click': if (/^\/step1\/([^\/]+)/.test(h.pathname)) {return 'https://easysl.click/' + RegExp.$1;}break;
    case 'www.gifans.com': if (/^\/link\/([^\/]+)/.test(h.pathname)) {return 'https://shortlink.prz.pw/' + RegExp.$1;}break;
    case 'zonearn.biz': if (/^\/(.+)/.test(h.pathname) && h.searchParams.has('tok')) {return h.searchParams.get('tok');}break;
    case 'nulledsafe.com': if (/^\/link\/([^\/]+)/.test(h.pathname)) {return 'https://golink.nulledsafe.com/' + RegExp.$1;}break;
    case 'step0.shortlinks.click': if (/^\/([^\/]+)/.test(h.pathname)) { return 'https://shortlinks.click/' + RegExp.$1; } break;
    case 'crypto-faucet.xyz': if (/^\/bitco\/link\/([^\/]+)/.test(h.pathname)) {return 'https://doctor-groups.com/link/' + RegExp.$1;}break;
    case 'www.meykmen.com': if (h.searchParams.has('url')) {return 'https://arabplus2.co/' + h.searchParams.get('url').substring(22);} break;
    //case 'studyuo.com': if (h.pathname === '/pro2/verify/' && /^\?([^&]+)/.test(h.search)) { meta('https://csd.xmod.in/' + RegExp.$1);} break;
    case 'horrorbitcoin.com': if (h.searchParams.has('dex')) { meta('https://panylink.com//' + h.searchParams.get('dex').substring(1));} break;
    case 'techmody.io': if (h.pathname === '/' && h.searchParams.has('check')) { meta(decodeURIComponent(h.searchParams.get('check')));} break;
    case 'froggyreviews.com': if (h.searchParams.has('mflink')) { meta('https://froggyreviews.com/go/' + h.searchParams.get('mflink'));} break;
    case 'xmod.in': if (h.pathname === '/blog/verify/' && /^\?([^&]+)/.test(h.search)) { meta('https://mytop5.club/verify/?' + RegExp.$1);} break;
    case 'bingeflix.xyz': if (h.pathname === '/' && h.searchParams.has('link')) {meta ('https://linkyearn.com/' + h.searchParams.get('link'));}break;
    case 'hosting4lifetime.com': if (h.pathname === '/blog/verify/' && /^\?([^&]+)/.test(h.search)) { meta('https://abcshort.com/' + RegExp.$1);} break;
    case 'acortame.xyz': if (window.location.hash) {location.href ="https://rotator.nurul-huda.sch.id/?url="+(atob(window.location.hash.substr(1)));} break;
    case 'blog.textpage.xyz': if (h.searchParams.has('ajhvgadhdhgkdsvkd')) { meta('https://short.url2go.in/' + h.searchParams.get('ajhvgadhdhgkdsvkd'));} break;
    case 'my.dropz.xyz': if ( h.href.includes('/checkpoint') && location.search === '') { return 'https://my.dropz.xyz/checkpoint?redir=/site-friends'; } break;
    case 'gadgets.techymedies.com': if (h.pathname === '/' && h.searchParams.has('token')) { meta('https://blog.disheye.com/' + h.searchParams.get('token'));} break;
    case 'short.clickscoin.com': case 'watchdoge.xyz': case 'dogeclick.net': if (/^\/ccsl\/([^/]+)/.test(h.pathname)) {return 'https://ccsl.xyz/' + RegExp.$1;}break;
    case 'patak.dropz.xyz': if ( h.href.includes('/checkpoint') && location.search === '') { return 'https://patak.dropz.xyz/checkpoint?redir=/site-friends'; } break;
    case 'jrlinks.in': if (h.pathname === '/safe2.php' && h.searchParams.has('link')) { meta('https://internet.webhostingtips.club/' + h.searchParams.get('link'));} break;
    case 'crazyblog.in': case 'www.crazyblog.in': if (h.pathname === '/xhod/verify/' && /^\?([^&]+)/.test(h.search)) { meta('https://redd.crazyblog.in/' + RegExp.$1);} break;
    case 'blog.urlbharat.xyz': if (h.pathname === '/safe.php' && h.searchParams.has('link')) { return 'https://get.urlbharat.xyz/safe.php?link=' + h.searchParams.get('link');} break;
    case 'short2fly.xyz': case 'cbshort.com': if ( h.searchParams.has('url') && h.href.includes('bloogerspoot.') ) {window.location.assign('https://softindex.website'+ (location.search).substring(147));} break;
    case 'dogeclick.net': if (/^\/short\/([^/]+)/.test(h.pathname)) {return 'https://short.clickscoin.com/' + RegExp.$1;} else if (/^\/ccsl\/([^/]+)/.test(h.pathname)) {return 'https://ccsl.xyz/' + RegExp.$1;}break;
    case 'clickscoin.com': if (/^\/short\/([^/]+)/.test(h.pathname)) { return 'https://short.clickscoin.com/' + RegExp.$1;} else if (/^\/shortccsl\/([^/]+)/.test(h.pathname)) { return 'https://ccsl.xyz/' + RegExp.$1;} break;
    case 'blog.crazyblog.in': if (/^\/step\d+?\/([^/]+)$/.test(h.pathname)) {return 'https://wplink.online/' + RegExp.$1;} else if (/^\/visit\d+?\/step\d+?\/([^/]+)$/.test(h.pathname)) {return 'https://cblink.crazyblog.in/' + RegExp.$1;}break;
    case 'anime.dutchycorp.space': case 'movies.dutchycorp.space': case 'tech.dutchycorp.space': case 'cool-time.dutchycorp.space': if (/^\/redir[^.]+?\.php$/.test(h.pathname) && h.searchParams.has('code')) {return h.searchParams.get('code') + '?verif=0';}break;
    case 'kiiw.icu': if (h.pathname === '/check.php' && h.searchParams.has('alias')&& h.searchParams.has('wis')&& h.searchParams.has('siw')){ return 'https://kiiw.icu/' + h.searchParams.get('alias')+ '?wis=' + h.searchParams.get('wis')+ '&siw=' + h.searchParams.get('siw');} break;
    case 'ls2earn.in': if ( h.searchParams.has('url') && h.href.includes('bloogerspoot.') ) {window.location.assign('https://softindex.website'+ (location.search).substring(130));} else if (h.searchParams.has('api') && h.searchParams.has('url')) {return h.searchParams.get('url');} break;
    case 'ls2earn.com': case 'besturl.link': if ( h.searchParams.has('url') && h.href.includes('bloogerspoot.') ) {window.location.assign('https://softindex.website'+ (location.search).substring(144));} else if (h.searchParams.has('api') && h.searchParams.has('url')) {return h.searchParams.get('url');} break;
    case 'shrinkearn.com': case 'clk.sh': if ( h.searchParams.has('url') && h.href.includes('bloogerspoot.') ) {window.location.assign('https://softindex.website'+ h.searchParams.get('url').substring(22));} else if (h.searchParams.has('api') && h.searchParams.has('url')) {return h.searchParams.get('url');} break;
    case 'birdurls.com': case 'linkrex.net': case 'softindex.website': case 'dash-free.com': case 'owllink.net': case 'exe.io': if (h.searchParams.has('url') && h.href.indexOf('#')) { return 'https://' + h.searchParams.get('url') + h.href.substr(h.href.indexOf('#')); } else if (h.searchParams.has('api') && h.searchParams.has('url')) {return h.searchParams.get('url');} break;
    case 'usalink.io': if ( h.searchParams.has('url') && h.href.includes('bloogerspoot.') ) {window.location.assign('https://softindex.website'+ (location.search).substring(219));} else if (h.searchParams.has('url') && h.href.includes('mineshor.')) {return 'https://' + h.searchParams.get('url');} else if (h.searchParams.has('url') && h.href.indexOf('#')) { return 'https://' + h.searchParams.get('url') + h.href.substr(h.href.indexOf('#')); } else if (h.searchParams.has('api') && h.searchParams.has('url')) {return h.searchParams.get('url');} break;
    default: break;} })(new URL(location.href)); if (l) {location.href = l; }
    let apiBypassVip = {selectors: ['#stepid', '.locked', '#steps', '#link', '#targetbtn', '#theLinkID', '.locked-button'],
    re: /mboost\.me|letsboost\.net|social-unlock\.com|boostme\.link|sub2unlock\.net|sub2unlock\.com/,};
    for (let i = 0; i < apiBypassVip.selectors.length; i++) {BypassedByBloggerPemula(apiBypassVip.re, function() {if (elementExists(apiBypassVip.selectors[i])) {fetch('https://api.bypass.vip/',{"headers": {"content-type":"application/x-www-form-urlencoded; charset=UTF-8","x-requested-with":"XMLHttpRequest"},"body":new URLSearchParams({url:document.URL}),"method":"POST",}).then(res=>res.json()).then(res=>{if(res.status!=="success") {redirect(res.destination);}});}});}
    BloggerPemula('kienthucrangmieng.com|coindoog.com|tieutietkiem.com|askpaccosi.com|shopsixseven.com|hoclamdaubep.com|thuocdangian.net|chinhnhacoban.com|coin-free.com|fanclup.info|chamcuuhoc.com|nhacremix.biz|doanvanhai.biz|conghuongtu.net|95news.com|tremamnon.com|hynews.biz', 'wpsafelink', '', false);
    BloggerPemula('soft3arbi.com', 'link', '', false);
    BloggerPemula('7apple.net', 'go', 'https://illink.net/', false);
    BloggerPemula('niinga.com', 'get', 'https://liinkat.com/', false);
    BloggerPemula('m.newhit.me', 'link', 'https://link3s.net/', false);
    BloggerPemula('wpking.in', 'link', 'https://o.ovlinks.com/', false);
    BloggerPemula('jazbaat.in', 'link', 'https://go.rplinks.in/', false);
    BloggerPemula('itechlogic.in', 'link', 'https://go.apurl.in/', false);
    BloggerPemula('blog.hostratgeber.de', 'go', 'https://c2g.at/', false);
    BloggerPemula('autodime.com', 'go', 'https://go.linkrex.net/', false);
    BloggerPemula('techcartz.com', 'link', 'https://ads.mdlink.in/', false);
    BloggerPemula('1apple.xyz', 'link', 'https://link.turkdown.com/', false);
    BloggerPemula('kerdlinfo.in', 'link', 'https://go.lrshortner.com/', false);
    BloggerPemula('forextrader.today', 'get', 'https://link2end.com/p/', false);
    BloggerPemula('apasih.my.id', 'link', 'https://link.get4llink.com/', false);
    BloggerPemula('crickblaze.com', 'getlink', 'https://go.coinadfly.com/', false);
    BloggerPemula('videoslyrics.com', 'postid', 'https://ser3.crazyblog.in/', false);
    BloggerPemula('claimfey.com|zubatecno.com', 'link', 'https://go.zuba.link/', false);
    BloggerPemula('cryptomeloud.com', 'adlinkfly', 'https://links.crypturls.com/', false);
    BloggerPemula('crazyblog.in|newsharsh.com', 'postid', 'https://hr.vikashmewada.com//', false);
    BloggerPemula('qualitystudymaterial.in', 'link', 'https://thehostingmentor.com/mylink/', false);
    BloggerPemula('techloadz.com|sportsmediaz.com', 'link', 'https://link.cloudshrinker.com//', false);
    BypassedByBloggerPemula(/ouo.today/, function() {location.href = nextUrl;});
    BypassedByBloggerPemula(/yoshare.net/, function() { bp('#yuidea').submit();});
    BypassedByBloggerPemula(/sharemods.com/, function() { $('#dForm').submit();});
    BypassedByBloggerPemula(/upload.ee/, function() {clickIfElementExists('#d_l', 2);});
    BypassedByBloggerPemula(/specx.me/, function() {clickIfElementExists('.butt', 2);});
    BypassedByBloggerPemula(/tmker.com/, function() { bp('#submit_first_page').submit();});
    BypassedByBloggerPemula(/prx.ee/, function() {clickIfElementExists('#final_link', 1);});
    BypassedByBloggerPemula(/1ink.cc/, function() {clickIfElementExists('#countingbtn', 1);});
    BypassedByBloggerPemula(/up-load.one/, function() {clickIfElementExists('#submitbtn', 1);});
    BypassedByBloggerPemula(/makemoneywithurl.com/, function() { bp('#hidden form').submit();});
    BypassedByBloggerPemula(/evoload.io/, function() {clickIfElementExists('#generatebtn', 1);});
    BypassedByBloggerPemula(/cryptosh.pro/, function() {clickIfElementExists('#EarnButton', 2);});
    BypassedByBloggerPemula(/keeplinks.org/, function() {clickIfElementExists('#btnchange', 2);});
    BypassedByBloggerPemula(/theconomy.me/, {'/': ['link', 'https://link.theconomy.me/'],}, false);
    BypassedByBloggerPemula(/punyablog.my.id/, {'/safe.php': ['link', 'https://q8c.xyz/'],}, false);
    BypassedByBloggerPemula(/mkomsel.com/, function() {clickIfElementExists('#downloadfile', 12);});
    BypassedByBloggerPemula(/drop.download/, function() {clickIfElementExists('.btn-download', 2);});
    BypassedByBloggerPemula(/jardima.com/, function() {clickIfElementExists('.btn-primary.btn', 3);});
    BypassedByBloggerPemula(/playstore.pw/, function() { $('.col-md- > form:nth-child(1)').submit();});
    BypassedByBloggerPemula(/1shortlink.com/, function() {clickIfElementExists('#redirect-link', 3);});
    BypassedByBloggerPemula(/file-upload.com/, function() {clickIfElementExists('#download-btn', 2);});
    BypassedByBloggerPemula(/mirrored.to/, function() {clickIfElementExists('.larger.secondary', 2);});
    BypassedByBloggerPemula(/forex-trnd.com|gawbne.com/, function() { bp('#exfoary-form').submit();});
    BypassedByBloggerPemula(/modebaca.com/, function() {clickIfElementExists('.btn-success.btn', 1);});
    BypassedByBloggerPemula(/modsfire.com/, function() {clickIfElementExists('.download-button', 2);});
    BypassedByBloggerPemula(/sahityt.com/, {'/verify/': [RexBp, 'https://google.v2links.com/'],}, false);
    BypassedByBloggerPemula(/dddrive.me/, function() {clickIfElementExists('.btn-outline-primary', 2);});
    BypassedByBloggerPemula(/medipost.org/, {'/verify/': [RexBp, 'http://links.medipost.org/'],}, false);
    BypassedByBloggerPemula(/videolyrics.in/, {'/verify/': [RexBp, 'http://ser3.crazyblog.in/'],}, false);
    BypassedByBloggerPemula(/jameeltips.us/, function() {clickIfElementExists('#continue_button_1', 1);});
    BypassedByBloggerPemula(/antonimos.de/, function() {clickIfElementExists('#cbt', 5, 'setInterval');});
    BypassedByBloggerPemula(/techyadjectives.com/, {'/check/': [RexBp, 'https://demo.pvidly.in/'],}, false);
    BypassedByBloggerPemula(/usersdrive.com/, function() {clickIfElementExists('.btn-download.btn', 1);});
    BypassedByBloggerPemula(/post.copydev.com/, function() {clickIfElementExists('.btn-success.btn', 6);});
    BypassedByBloggerPemula(/uppit.com/, function() {clickIfElementExists('.btn-primary.btn-xl.btn', 2);});
    BypassedByBloggerPemula(/krakenfiles.com/, function() {clickIfElementExists('.download-now-text', 2);});
    BypassedByBloggerPemula(/go.insurglobal.xyz/, {'/': ['link', 'https://link.insurglobal.xyz/'],}, false);
    BypassedByBloggerPemula(/adsy.pw|linkpay.cc|wi.cr|pndx.live/, function() { bp('#link-view').submit();});
    BypassedByBloggerPemula(/linegee.net/, function() {clickIfElementExists('.btn-xs.btn-primary.btn', 2);});
    BypassedByBloggerPemula(/zippyshare.com|filedm.com/, function() {clickIfElementExists('#dlbutton', 3);});
    BypassedByBloggerPemula(/bildirim.in|bildirim.eu/, function() {clickIfElementExists('#btnPermission', 1);});
    BypassedByBloggerPemula(/userscloud.com|dosya.co/, function() {clickIfElementExists('#btn_download', 2);});
    BypassedByBloggerPemula(/hexupload.net/, function() {clickIfElementExists('.btn-success.btn-lg.btn', 1);});
    BypassedByBloggerPemula(/solidfiles.com/, function() {clickIfElementExists('.btn-sm.btn-primary.btn', 2);});
    BypassedByBloggerPemula(/faucetpay.io/, function() {clickIfElementExists('.btn-block.btn-primary.btn', 3);});
    BypassedByBloggerPemula(/get.urlbharat.xyz/, {'/safe.php': ['link', 'https://video.earnspace.in/'],}, false);
    BypassedByBloggerPemula(/insurance-space.xyz/, {'/': ['link', 'https://link.insurance-space.xyz/'],}, false);
    BypassedByBloggerPemula(/dailyuploads.net/, function() {clickIfElementExists('.inner > a:nth-child(9)', 2);});
    BypassedByBloggerPemula(/files.im/, function() {clickIfElementExists('.btn-dow.btn', 2);bp('#F1').submit();});
    BypassedByBloggerPemula(/cooklike.info|model-tas-terbaru.com/, {'/': ['link', 'https://yousm.link/'],}, false);
    BypassedByBloggerPemula(/lets.5get.net/, function() {clickIfElementExists('.jump_link > a:nth-child(1)', 2);});
    BypassedByBloggerPemula(/cshort.org/, function() {clickIfElementExists('.timer.redirect', 3, 'setInterval');});
    BypassedByBloggerPemula(/megaupto.com/, function() {clickIfElementExists('#direct_link > a:nth-child(1)', 2);});
    BypassedByBloggerPemula(/blog-everything.com/, function() {clickIfElementExists('button.btn.btn-warning', 3);});
    BypassedByBloggerPemula(/delishwell.com|artiskini.com/, {'/': ['link', 'https://link.paid4link.net/'],}, false);
    BypassedByBloggerPemula(/tinyurl.so/, function() {clickIfElementExists('.btn.btn-secondary', 3, 'setInterval');});
    BypassedByBloggerPemula(/douploads.net/, function() {clickIfElementExists('.btn-primary.btn-lg.btn-block.btn', 2);});
    BypassedByBloggerPemula(/takem.co|themorningtribune.com/, {'/verify/': [RexBp, 'https://push.bdnewsx.com/'],}, false);
    BypassedByBloggerPemula(/informaxonline.com|gaminplay.com/, {'/': ['link', 'https://go.adslinkfly.online/'],}, false);
    BypassedByBloggerPemula(/webhostingtips.club/, {'/safe.php': ['link', 'https://jrlinks.in/safe2.php?link='],}, false);
    BypassedByBloggerPemula(/litecoin.host|skipads.click/, function() {clickIfElementExists('#wBtn', 3, 'setInterval');});
    BypassedByBloggerPemula(/ponselharian.com/, function() {if (elementExists('#link-view')) {window.scrollTo(0,9999);}});
    BypassedByBloggerPemula(/techrfour.com|veganal.co|veganho.co/, {'/go/': [RexBp, 'https://push.bdnewsx.com/'],}, false);
    BypassedByBloggerPemula(/linkerload.com/, function() {clickIfElementExists("#download form input[id='button1']", 2);});
    BypassedByBloggerPemula(/ayelads.com/, function() {clickIfElementExists('.btn-bl.btn-primary.btn', 5, 'setInterval');});
    BypassedByBloggerPemula(/mp4upload.com/, function() {clickIfElementExists('#todl', 2);$("form[name='F1']").submit();});
    BypassedByBloggerPemula(/adfoc.us/, function() {if (elementExists('#skip')) {let adf = bp('.skip').href;redirect(adf);}});
    BypassedByBloggerPemula(/wp.sekilastekno.com/, function() {clickIfElementExists('div > div > button', 3, 'setInterval');});
    BypassedByBloggerPemula(/letsupload.io/, function() {clickIfElementExists('button.btn.btn--primary.type--uppercase', 1);});
    BypassedByBloggerPemula(/informaxonline.com|gaminplay.com/, {'/verify/': [RexBp, 'https://go.adslinkfly.online/'],}, false);
    BypassedByBloggerPemula(/largestpanel.in|earnme.club|usanewstoday.club/, function() {clickIfElementExists('#tp-snp2', 1);});
    BypassedByBloggerPemula(/healdad.com|gamalk-sehetk.com/, function() {clickIfElementExists('.submitBtn', 3, 'setInterval');});
    BypassedByBloggerPemula(/assettoworld.com/, function() {clickIfElementExists('.text-capitalize.btn-outline-success.btn', 3);});
    BypassedByBloggerPemula(/chooyomi.com|blogmado.com/, () => waitForElm(".get-link > a:nth-child(1)", cho => redirect(cho.href)));
    BypassedByBloggerPemula(/bestfonts.pro/, () => waitForElm(".download-font-button > a:nth-child(1)", pro => redirect(pro.href)));
    BypassedByBloggerPemula(/cutt.net|cut-y.net|cutty.app/, function() {clickIfElementExists('#submit-button', 5, 'setInterval');});
    BypassedByBloggerPemula(/docs.google.com/, function() {if (elementExists('#uc-dl-icon')) {bp('#downloadForm').submit();} else {}});
    BypassedByBloggerPemula(/workupload.com/, function() {if (elementExists('#download')) {clickIfElementExists('.btn-prio.btn', 2);}});
    BypassedByBloggerPemula(/techus.website/, function() { $('.code-block-4.code-block > form').submit();$('.topnav > form').submit();});
    BypassedByBloggerPemula(/1link.club/, function() {$("a[target='_blank']").removeAttr("target");clickIfElementExists('#download', 1);});
    BypassedByBloggerPemula(/zegtrends.com/, function() {clickIfElementExists('#go', 3);clickIfElementExists('.bsub', 3, 'setInterval');});
    BypassedByBloggerPemula(/forex-articles.com|forexlap.com|forexmab.com/, function() {clickIfElementExists('.oto > a:nth-child(1)', 1);});
    BypassedByBloggerPemula(/linkspy.cc/, function() {if (elementExists('.skipButton')) {let lsp = bp('.skipButton').href;redirect(lsp);}});
    BypassedByBloggerPemula(/automotur.club|sanoybonito.club/, function() {clickIfElementExists('.g-recaptcha', 3);bp('#page2').submit();});
    BypassedByBloggerPemula(/uploadhaven.com/, function() {clickIfElementExists('.alert > a:nth-child(1)', 2);bp('#form-download').submit();});
    BypassedByBloggerPemula(/cashearn.cc|bitlinks.pw/, function() {clickIfElementExists('.next-button.btn-lg.btn-info.btn', 3, 'setInterval');});
    BypassedByBloggerPemula(/upfiles.app|cut-y.co/, function() {if (elementExists('#captchaDownload')) {}else{bp('form.text-center').submit();}});
    BypassedByBloggerPemula(/pythondunyasi.com/, () => waitForElm("#countdown3 > span:nth-child(1) > a:nth-child(1)", pit => redirect(pit.href)));
    BypassedByBloggerPemula(/litexblog.com/, function() {if (elementExists('.g-recaptcha')) {}else{clickIfElementExists('.bg-primary.btn', 5);}});
    BypassedByBloggerPemula(/bcvc.xyz|bcvc.ink/, function() {clickIfElementExists('.js-scroll-trigger.btn-xl.btn-outline.btn', 3, 'setInterval');});
    BypassedByBloggerPemula(/racedepartment.com/, function() {$("a[target='_blank']").removeAttr("target");clickIfElementExists('.button--cta', 2);});
    BypassedByBloggerPemula(/hxfile.co|ex-load.com|megadb.net/, function() {clickIfElementExists('.btn-dow.btn', 2);bp("form[name='F1']").submit();});
    BypassedByBloggerPemula(/tinyurl.is/, function() {if (elementExists('ul > li > a')) {const link = bp('a[id^=newskip-btn]').href;redirect(link);}});
    BypassedByBloggerPemula(/mega4up.org/, function() {clickIfElementExists('input.btn.btn-info.btn-sm', 2);clickIfElementExists('.btn-dark.btn', 2);});
    BypassedByBloggerPemula(/uploadev.org/, function() {clickIfElementExists('#dspeed > input:nth-child(3)', 1); clickIfElementExists('.directl', 1);});
    BypassedByBloggerPemula(/bayfiles.com|anonfiles.com|openload.cc|lolabits.se|letsupload.cc/, function() {clickIfElementExists('#download-url', 2);});
    BypassedByBloggerPemula(/fx4vip.com/, function() {$("a #button1[disabled='disabled']").removeAttr("disabled");clickIfElementExists('#button1', 2);});
    BypassedByBloggerPemula(/altblogger.net/, function() {clickIfElementExists('.form-send.m-2.btn-captcha.btn-outline-primary.btn', 3, 'setInterval');});
    BypassedByBloggerPemula(/satoshi-win.xyz|shorterall.com|promo-visits.site/, function() {clickIfElementExists('.box-main > button:nth-child(3)', 1);});
    BypassedByBloggerPemula(/mynewsmedia.co/, function() {clickIfElementExists('#myBtn.cssBtn.myBtn', 3);clickIfElementExists('#nxBtn.cssBtn.nxBtn', 5);});
    BypassedByBloggerPemula(/btcpany.com|zombiebtc.com|blog.zubatecno.com|news.claimfey.com|battleroyal.online/, function() { bp('#link1s-form').submit();});
    BypassedByBloggerPemula(/send.cm|racaty.net|files.im|sharemods.com|clicknupload.to|modsbase.com/, function() {clickIfElementExists('#downloadbtn', 1);});
    BypassedByBloggerPemula(/sub2get.com/, function() {if (elementExists('#butunlock')) {let subt = bp('#butunlock > a:nth-child(1)').href;redirect(subt);}});
    BypassedByBloggerPemula(/takefile.link/, function() {if (elementExists('#F1')) {bp('div.no-gutter:nth-child(2) > form:nth-child(1)').submit();} else {}});
    BypassedByBloggerPemula(/claimclicks.com/, function() {clickIfElementExists('div.col-md-12:nth-child(2) > form:nth-child(11) > button:nth-child(4)', 2);});
    BypassedByBloggerPemula(/ac.totsugeki.com/, function() {$("a[target='_blank']").removeAttr("target");clickIfElementExists('.btn-lg.btn-success.btn', 2);});
    BypassedByBloggerPemula(/fexkomin.xyz/, function() {$("a[target='_blank']").removeAttr("target");clickIfElementExists('.btn-captcha.btn-danger.btn', 3);});
    BypassedByBloggerPemula(/uptobhai.info|shortlinkto.info|uplinkto.vip|brbushare.info/, function() {clickIfElementExists('.btn-block.btn-primary.btn', 2);});
    BypassedByBloggerPemula(/rancah.com|menjelajahi.com|shortly.xyz/, function() {clickIfElementExists('.get-link.btn-lg.btn-success.btn', 5, 'setInterval');});
    BypassedByBloggerPemula(/shortit.pw/, function() {clickIfElementExists('.pulse.btn-primary.btn', 5);clickIfElementExists('a#btn2.btn.btn-primary.pulse', 3);});
    BypassedByBloggerPemula(/theprice.biz|massive.my.id|activity.my.id|caview.my.id/, function() {clickIfElementExists('a.btn.btn-primary.m-2.btn-captcha', 6);});
    BypassedByBloggerPemula(/upload-4ever.com/, function() {clickIfElementExists("input[name='method_free']", 2);clickIfElementExists('#downLoadLinkButton', 5);});
    BypassedByBloggerPemula(/fileshare.adshorturl.com/, function() {clickIfElementExists('.download-timer > a:nth-child(1) > span:nth-child(1)', 4, 'setInterval');});
    BypassedByBloggerPemula(/1fichier.com/, function() {if (elementExists('#pass')){}else {clickIfElementExists('.btn-orange.btn-general.ok', 1);bp('.alc').submit();}});
    BypassedByBloggerPemula(/proviralhost.com|examtadka.com/, function() {clickIfElementExists('#wait1button', 3);clickIfElementExists('#wait2button', 5, 'setInterval');});
    BypassedByBloggerPemula(/healdad.com|gamalk-sehetk.com|newforex.online|forex-gold.net|world-trips.net|mobi2c.com/, function() {clickIfElementExists('.submitBtn', 2);});
    BypassedByBloggerPemula(/adsgo.digital|newsnowbd.com|techus.website/, function() {clickIfElementExists('.myButton', 2); $('.code-block-1.code-block > form').submit();});
    BypassedByBloggerPemula(/anonym.ninja/, function() {var fd = window.location.href.split('/').slice(-1)[0];redirect(`https://anonym.ninja/download/file/request/${fd}`);});
    BypassedByBloggerPemula(/uptobox.com/, function() {clickIfElementExists('a.big-button-green:nth-child(1)', 2); clickIfElementExists('.download-btn', 3, 'setInterval');});
    BypassedByBloggerPemula(/on-scroll.com|diudemy.com/, function() {clickIfElementExists('.blog_btn.show_btn', 3);waitForElm("#next", roll => redirect(roll.href, false));});
    BypassedByBloggerPemula(/stfly.me/, function() {if (elementExists('.g-recaptcha')) {}else{clickIfElementExists('.form-send.m-2.btn-captcha.btn-outline-primary.btn', 3);}});
    BypassedByBloggerPemula(/i-polls.com/, function() {clickIfElementExists('button#btn', 2);clickIfElementExists('#anchor_button', 2);clickIfElementExists('a#safe_link', 30);});
    BypassedByBloggerPemula(/suratresmi.id/, function() {clickIfElementExists('button#hmn.btn-more', 3, 'setInterval');clickIfElementExists('a#hmn.btn-more',3, 'setInterval');});
    BypassedByBloggerPemula(/blog-forall.com/, function(){var bypasslinks = atob(`aH${bp("#landing [name='go']").value.split("aH").slice(1).join("aH")}`); redirect(bypasslinks);});
    BypassedByBloggerPemula(/olamovies.cyou/, function() {let omo = document.getElementsByTagName("script")[1].innerText.split("\n")[8].split(" ")[3].split("\"")[1];redirect(omo);});
    BypassedByBloggerPemula(/apkadmin.com/, function() {clickIfElementExists('.text > a:nth-child(4) > img:nth-child(1)', 1);bp('.download-file-button > form:nth-child(1)').submit();});
    BypassedByBloggerPemula(/newsharsh.com/, {'/box-office/verify/': [RexBp, 'https://hr.vikashmewada.com/'],'/english/verify/': [RexBp, 'https://crazyblog.in/harsh/verify/?'],}, false);
    BypassedByBloggerPemula(/writedroid.in/, function() {clickIfElementExists('#shortPostLink', 5);clickIfElementExists('#showModalAds', 3);clickIfElementExists('#shortGoToLink.button', 5);});
    BypassedByBloggerPemula(/vosan.co/, function() {$("a[target='_blank']").removeAttr("target");clickIfElementExists('.elementor-size-lg', 2);clickIfElementExists('.wpdm-download-link', 2);});
    BypassedByBloggerPemula(/4shared.com/, function() {clickIfElementExists('.jsDownloadButton', 2);if (elementExists('.freeDownloadButton')) {bp("form[name^='redirectToD3Form']").submit();}});
    BypassedByBloggerPemula(/riadcrypto.com|donia2tech.com/, function() {var form = document.getElementById('wpsafelink-landing'); redirect(JSON.parse(atob(form.newwpsafelink.value)).linkr);});
    BypassedByBloggerPemula(/mobi2c.com|newforex.online|world-trips.net|forex-gold.net|healdad.com|gamalk-sehetk.com|mobitaak.com/, function() {clickIfElementExists('#go_d', 3, 'setInterval');});
    BypassedByBloggerPemula(/enit.in|clk.asia|clicksfly.com/, function() {var linkbypass = atob(`aH${bp("#link-view [name='token']").value.split("aH").slice(1).join("aH")}`);redirect(linkbypass);});
    BypassedByBloggerPemula(/daga88.today/, function() {if (elementExists('#traffic-countdown-1s')) {const daga = document.querySelectorAll('#wrapper'); for (const element of daga) {element.remove();}}});
    BypassedByBloggerPemula(/solarchaine.com/, function() {if (elementExists('#captchaShortlink')) {clickIfElementExists('button.btn:nth-child(4)', 2);} else {bp('.box-body > form:nth-child(2)').submit();}});
    BypassedByBloggerPemula(/rodjulian.com/, function() {if (elementExists('#traffic-countdown-1s')) {const roju = document.querySelectorAll('.site-content'); for (const element of roju) {element.remove();}}});
    BypassedByBloggerPemula(/uploadrar.com|chedrive.com|uptomega.me/, function() {clickIfElementExists('.mngez-free-download', 2);clickIfElementExists('#direct_link > a:nth-child(1)', 2);$('#downloadbtn').click();});
    BypassedByBloggerPemula(/azmath.info|aztravels.net|techacode.com/, () =>{if (elementExists('#megaurl-verified-captcha')) {clickIfElementExists('button.h-captcha', 3);} else {submit("#megaurl-banner-page", 5);}});
    BypassedByBloggerPemula(/studyuo.com/, {'/pro/': ['link', 'https://shrinkpay.crazyblog.in'],'/short/verify/': [RexBp, 'https://redd.crazyblog.in'], '/blog/verify/': [RexBp, 'https://speedynews.xyz/verify/?'],}, false);
    BypassedByBloggerPemula(/crazyblog.in/, { '/finance/': ['link', 'https://shrinkpay.crazyblog.in'],'/hars/verify/': [RexBp, 'https://redd.crazyblog.in'], '/harsh/verify/': [RexBp, 'https://ser3.crazyblog.in/'],}, false);
    BypassedByBloggerPemula(/9xupload.asia/, function() {clickIfElementExists('#container > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)', 2);$("form[name='F1']").submit();});
    BypassedByBloggerPemula(/nathanaeldan.pro|freddyoctavio.pro|davisonbarker.pro/, function() { var urls = new URL(document.URL); var dest = urls.searchParams.get("dest"); var decoded = decodeURI(dest);redirect(decoded);});
    BypassedByBloggerPemula(/rekonise.com/, ()=>{let xhr=new XMLHttpRequest();xhr.onload=()=>redirect(JSON.parse(xhr.responseText).url);xhr.open("GET","https://api.rekonise.com/unlocks"+location.pathname,true);xhr.send();});
    BypassedByBloggerPemula(/wrbloggers.com/, () => {if (elementExists('div.col-sm-4')){clickIfElementExists('.btn-danger.btn-block.btn', 2);}else{var ju = setInterval( () => {click("#nextpagelink"); clearInterval(ju);},3000);}});
    BypassedByBloggerPemula(/cutin.it/, function() {let tin = [...document.getElementsByTagName("script")].filter(elem => elem.innerText !== "")[3].innerText.split("\n")[14].split(" ")[9].replace(";", "").replaceAll("\"", "");redirect(tin);});
    BypassedByBloggerPemula(/playnano.online/, function() {clickIfElementExists('#watch-link', 2);clickIfElementExists('.watch-next-btn.btn-primary.button', 2);clickIfElementExists('button.button.btn-primary.watch-next-btn', 5, 'setInterval');});
    BypassedByBloggerPemula(/wiki-topia.com/, function() {if (elementExists('.g-recaptcha')) {}else{clickIfElementExists("input[style^='font-weight: 700']", 2, 'setInterval');clickIfElementExists("input[style^='font-weight: 500']", 3, 'setInterval');}});
    BypassedByBloggerPemula(/mediafire.com/, function() {var bass; var md = function closeWindows(){window.close(); clearInterval(bass);};var mf = bp('.download_link .input').getAttribute('href'); console.log(mf); location.replace(mf); bass = setInterval(md, 1000 * 5);});
    BypassedByBloggerPemula(/dutchycorp.space|dutchycorp.ovh|gtlink.co|fc-lc.com|mdn.rest|antonimos.de|ctbl.me|zshort.cc|feyyora.fun|twitonet.com|oii.io/, function() {var ticker = setInterval(function(){ try{window.grecaptcha.execute(); clearInterval(ticker);} catch(e) {}},3000);});
    BypassedByBloggerPemula(/ytsubme.com/, function() {if (elementExists('.cont1')) {let ytsub = bp("#msg-box3-o > div > div > div.col-md-4.text-center > div > div > div > div.col-md-8.col-md-offset-2.text-xs-center > div > div > script").innerHTML.split(';')[7].split('=')[1].replaceAll('\'', "");redirect(ytsub);}});
    BypassedByBloggerPemula(/faucet.work|techlearningtube.in|wildblog.me|blogginglass.com|technoflip.in|arahtekno.com|mopahealth.com|welovecrypto.xyz|crypto-blog.xyz|jiotech.net|crypto4tun.com|adshorturl.com|digitalnaz.net/, function() {var el = document.querySelector("input[name=newwpsafelink]");redirect(JSON.parse(atob(el.value)).linkr);});
    BypassedByBloggerPemula(/linkvertise.com|linkvertise.download/, function() {var linkver = new XMLHttpRequest; linkver.responseType = 'json'; linkver.open('GET', `https://main-bypass-server.tk/v3?${document.location.href.slice(0,-1)}`, !0); linkver.onload = function(n) {4 === linkver.readyState && redirect(this.response.destination);}; linkver.send(null);});
    BypassedByBloggerPemula(/drive.google.com/, function() {var dg = window.location.href.split('/').slice(-2)[0];if (window.location.href.includes('drive.google.com/file/d/')) {redirect(`https://drive.google.com/u/0/uc?id=${dg}&export=download`).replace('<br />', '');} else if (window.location.href.includes('drive.google.com/u/0/uc?id')) {bp('#downloadForm').submit();} else {}});
    BypassedByBloggerPemula(/adshnk.com|adshrink.it/, () => {let adsh =setInterval(()=>{if(typeof _sharedData=="object"&&0 in _sharedData&&"destination"in _sharedData[0]){clearInterval(adsh);document.write(_sharedData[0].destination);redirect(document.body.textContent);}else if(typeof ___reactjsD!="undefined"&&typeof window[___reactjsD.o]=="object"&&typeof window[___reactjsD.o].dest=="string"){clearInterval(adsh);redirect(window[___reactjsD.o].dest);}});});
    BypassedByBloggerPemula(/99faucet.com|readi.online|cempakajaya.com|freebitcoin.fun|onlineteori.my.id|xtrabits.click|onlineincoms.com|punyablog.my.id|9-animie.co|tribuncrypto.com|bitzite.com|nivaprofit.xyz|videoclip.info|punyamerk.top|lycoslink.com|aduzz.com|soltoshindo.com|techleets.xyz|moddingzone.in|crypto-fi.net|claimcrypto.cc|ourcoincash.xyz|poketoonworld.com|sapica.xyz|chuksblog.fun|liongiv.xyz|bioinflu.com|sonicbtc.com|healthbloog.xyz|pubgquotes.com|m.linkmumet.online|web9academy.com|studyis.xyz/, function(){var bypasslink = atob(`aH${bp("#landing [name='go']").value.split("aH").slice(1).join("aH")}`); redirect(bypasslink, false);});
    if (window.location.hostname==('solvemedia.com') != -1 ){let PHRASES=["1.21 gigawatts","4 8 15 16 23 42","5 dollar shake","6 feet of snow","8th chevron","a wild captcha appears","abelian grape","abide with me","abracadabra","absent without leave","absolute zero","accidentally on purpose","ace of spades","across the board","adapt improve","adapt improve succeed","against the grain","agree to disagree","al capone","all dancing","all grown up","all of the above","all singing","all your base","allergic reaction","almost got it","always there","am i happy","anchors away","and that's the way it is","angel food","another castle","anti dentite","apple juice","apple pie","apple sauce","april may","april showers","are we there yet","are you ready","are you the keymaster","army training","army training sir","around here","as i see it","as you wish","ask questions","attila the hun","auto driving","awesome dude","awesome sauce","azgoths of kria","babel fish","baby blues","baby boomer","baby steps","back to basics","back track","background noise","bacon and eggs","bad books","bad egg","bait the line","baked in a pie","bald eagle","ball of confusion","banana bread","banana split","banana stand","bangers and mash","barber chair","barking mad","basket case","bated breath","bath towel","bath water","battle royale","bazinga","be careful","be mine","be my friend","be nice","be nimble be quick","be serious now","beach ball","bean town","beans and rice","beautiful friendship","bee line","been there","beer in a bottle","beer in the bottle","bees knees","beg the question","believe me","belt up","berlin wall","best fit line","best seller","better call saul","better half","better next time","beyond me","big brother","big kahuna burger","big nose","big screen","bigger in texas","bike rider","bird cage","birthday boy","birthday girl","bizarro jerry","black and white","black coffee","black gold","black jack","black monday","blahblahblah","blaze a trail","bless you","blinded by science","blog this","blood type","blue cheese","blue ribbon","blue sky","bob loblaw","body surfing","boiled cabbage","bon voyage","bond james bond","bone dry","bonus points","bonus round","book reading","book worm","boomerang","born to run","bots are bad m'kay","bottled water","bowties are cool","box jelly fish","box kitty","box of chocolates","braaains","brand spanking new","bread of life","break the ice","brick house","broken heart","broken record","bruce lee","brush your teeth","buckle your shoe","buffalo wing","bunny rabbit","burger with fries","burning oil","burnt sienna","butler did it","butter side down","button fly","buy some time","by and large","by the board","by the book","by the seashore","cabbage borsht","cabbage stew","caesar salad","call me","call me maybe","can i love","can you see","candy apple","candy cane","capital gain","captcha in the rye","car trouble","carbon copy","carbon footprint","card sharp","card-sharp","carpe diem","carry a towel","carry on","cary grant","case closed","cat got your tongue","catch the man","cats and dogs","cats pajamas","chaise lounge","challenge accepted","change the world","change yourself","channel surfing","charley horse","charlie bit me","charm offensive","charmed life","check your coat","check your work","cheese burger","cheese fries","cheese steak","cherry on top","chicken feed","chicken noodle","chicken salad","chicken soup","chin boy","chit chat","choco lazer boom","chocolate cookie","chocolate milk","chow down","chuck norris","circle of life","civil war","clean and shiny","clean hands","clear blue water","clear sailing","click, click, click","cliff hanger","clod hopper","close quarters","cloud nine","clown around","coffee can","cold comfort","cold feet","cold hat","cold shoulder","cold turkey","coleslaw","collaborate and listen","colored paper","come along","come along pond","come back","come clean","come on down","come what may","comfort zone","comma comma","common law","complex number","construction ahead","cookie cutter","cool heads prevail","cop an attitude","cor blimey","cordon bleu","corned beef","cotton on","count your change","counting sheep","covered bridge","crab cake","crayola","cream and sugar","create new things","creative process","creative vision","creepy crawler","crime of passion","crocodile tears","crop up","cross the road","cross the rubicon","cubic spline","cucumber sandwich","cup cake","cupid's arrow","curate's egg","curry favour","cut and run","cut the mustard","dalek asylum","dallas texas","dance all night","danish robot dancers","dark horse","das oontz","david after dentist","dead battery","dead ringer","deal me in","dear cookie","dear mr vernon","dear sir","deep thought","deep waters","dharma initiative","diced onion","diddly squat","digital clock","ding a ling","dinner bell","dinosaur spaceship","dish water","do a little dance","do be do be do","do it now","do more situps","do not touch","do or do not","do unto others","do wah ditty","do you believe in miracles","do you love me","doctor caligari","doctor who","doctor who?","doe a deer","dog days","dog's breakfast","dog's dinner","dogapus","dogs and cats living together","dollar bill","dollar signs","dollars to donuts","domestic spying","don't be late","don't count on it","don't dawdle","don't stop","don't waste time","done that","donkey's years","doodah man","double cross","double crossed","double dutch","double jump","double rainbow","double time","double whammy","down the hatch","down the rabbit hole","downward slope","drag race","dragon with matches","dragonfly","dramatic chipmunk","draw a blank","drawing board","dream big","drink milk","drive me to firenze","drop table users","drumhead","drummer boy","dry clean only","dueling banjos","dusk till dawn","dust bunny","dust up","duvet day","dynamo clock","ear candy","ear mark","ear muffs","easy as cake","easy as pie","easy peasy","easy street","eat cous cous","eat out","eat your dinner","eat your veggies","eat your vitamins","ecks why zee","edgar degas","egg on","eggs ter minate","eighty six","electro head","elevator going up","emperor's clothes","empire state of mind","end of story","english muffin","enjoy life","ermahgerd capcher","evil eye","evil genius","exceedingly well read","exclamation","exercise more","extra cheese","face the music","face to face","fade away","fair and square","fair play","fairy godmother","fairy tale","fait accompli","fall guy","falling pianos","fancy free","fancy pants","far away","farsical aquatic ceremony","fashion victim","fast and loose","fast asleep","father time","father uncle","fathom out","fava beans","feeding frenzy","feeling blue","fellow traveller","fezes are cool","field day","fifth column","fill it up","filthy dirty mess","filthy rich","finagle's law","final answer","finger lickin good","fire brim stone","firecracker","first contact","first post","first water","first world","fish and chips","fish on","fishy smell","flag day","flat foot","flat out","flat tire","flipadelphia","flipflops","flux capacitor","follow me","folsom prison","fool's paradise","fools gold","for keeps","for sure","for the birds","for the gripper","forbidden fruit","foregone conclusion","forget this","forget you","fork knife spoon","forty two","foul play","four by two","frabjous day","france","frankly my dear","free hat","freezing temperatures","french fried","french fries","french phrases","fresh water","fried ices","fried rice","friend zone","frozen peas","fruit salad","fuddy duddy","full house","full monty","full of stars","full stop","full tilt","fun with flags","funny farm","fusilli jerry","fuzzy wuzzy","gadzooks","game is up","gangnam style","garden of eden","garlic yum","gathers moss","gee louise","gee whiz","geez louise","gene parmesan","general tso","generation x","genghis khan","george washington","get out","get over it","get well","get your goat","giant bunny rabbit","giant panda","giddy goat","gift horse","gimme pizza","ginger bread","give or take","glass ceiling","glazed donut","global warming","go berserk","go further","go gadget go","goes to eleven","gold medal","gold record","golly jeepers","gone dolally","gone fishing","good afternoon","good as gold","good buddy","good day","good evening","good for nothing","good grief","good job","good luck","good morning","good night","good night and good luck","good riddance","good samaritan","good work","goody goody gumdrops","goody gumdrop","goody two shoes","goosebumps","gordon bennett","got my mojo","gotham city","gothic arch","gothic church","grain of salt","grand slam","grape soda","grass up","graveyard shift","gravy train","grease the skids","greased lightning","great scott","great unwashed","gregory peck","gridlock","grilled cheese","groundhog day","grumpy cat","guinea pig","guitar player","gum shoe","gung ho","habsons choice","had a great fall","had me at hello","hairy eyeball","halcyon days","half done","half empty","half full","half inch","hallowed ground","halp meh","ham and cheese","hamburger bun","hammer time","hand over fist","hands down","hangers and mash","happy anniversary","happy blessings","happy clappy","happy retirement","happy trails","hard captcha is hard","hard cheese","hard lines","hard sharp","hardened prestoopnicks","harp on","haste makes waste","hat head","hat trick","have a purpose","have an inkling","have courage","have fun","he loves her","head case","head honcho","head over heels","heads up","health food","healthy food","hear hear","hear me roar","heart break","heart strings","heart's content","heartache","heat up","heated debate","heavens to betsy","heavy metal","heebie jeebies","hello newman","hello sweetie","hello watson","hello world","here or there","here's johnny","hey brother","higgledy piggledy","higgs boson","high def","high five","high flyer","high horse","high sleeper","high time","him with her","hissy fit","history repeats itself","hit the hay","hit the sack","hoagie roll","hobby horse","hobson's choice","hocus pocus","hoi polloi","hoity-toity","hold your horses","hold your tongue","home james","honey mustard","hooray henry","hops a daisy","horse and cart","horse's mouth","hot blooded","hot diggity dog","hot dog roll","hot pola","hot sauce","hover hand","how about lunch","how about that","how are you","how interesting","how now, brown cow","how quaint","how sweet","how's it going","howdy partner","hug me","huggle muggle","hulk smash","hunky-dory","hush puppies","i am captcha","i am fine","i am here","i can do this","i can fix it","i have fallen","i know nothing","i like humans","i like people","i like turtles","i like you","i love deadlines","i love lamp","i love you","i made tea","i moustache you why","i saw that","i see","i think i am","i think i can","i think so","i want control","i'll make tea","i'm batman","i'm blessed","i'm blushing","i'm cold brr","i'm only human","i'm so cold","i'm sorry","i'm sorry dave","i'm yours","ice to meet you","idk my bff jill","if it fits","im cold. brr","imagine inspire create","in a box","in limbo","in over my head","in spades","in stitches","in the air","in the box","in the cart","in the club","in the doldrums","in the limelight","industrial revolution","infra dig","inside out","is it enough","is it hot","is it hot?","is it hot in here","is it plugged in","is low","it doesn't count","it happens","it hurts","it is certain","it is enough","it will pass","it's over","it's super effective","ivory tower","jabber wocky","jack be nimble","jam tomorrow","jay gatsby","jerk store","jerry built","jimmy cricket","jimmy horner","john lennon","john steinbeck","jump higher","jump over","jump the candlestick","jump the gun","jumping jack","june july","just dance","just deserts","just drive","just friends","just in time","kangaroo count","karma points","keep calm","keyboard","keyboard cat","khyber pass","kick the can","kick your heels","kindness of strangers","king arthur","kiss me","kitten mittens","kitty kat","klatu berada nikto","knick knack","knock at the door","knock back","knock knock knock penny","knock off","knock on wood","know the ropes","know thy self","know your paradoxes","know your rights","knuckle down","kosher dill","kundalini express","labour of love","ladies first","lager frenzy","lame duck","lardy-dardy","lark about","laser beams","last straw","later gator","laugh at me","law of sines","lawn giland","lazy sunday","leap higher","leaps and bounds","learn challenge improve","learn from mistakes","learn succeed","learn the ropes","learn, advance","leave britney alone","leave me alone","left or right","left right","lefty loosey","less is more","let go","let it be","let me know","let me out","lets eat","level playing field","liberty bell","library book","lickety split","lie low","light sleeper","like a boss","like the dickens","linear algebra","little bird told me","little bobby tables","little did he know","little sister","live free","live in the moment","live in the now","live life","live long + prosper","live love internet","live love type","live transmission","live with purpose","live your dream","living daylights","living things","lizard poisons spock","lo and behold","loaf of bread","local derby","lol cat","lollerskates","lolly pop","london calling","long division","long in the tooth","look away","look before crossing","look both ways","looking glass","lose face","lost love","loud music","love is automatic","love is blind","love life","love me","love you","love-hate","lovey dovey","lucille 2","lucky you","ludwig van","lumpy gravy","lunatic fridge","lunch time","lunch tuesday","mad hatter","mad science","magic decoder ring","magic eight ball","magical realism","magnetic monopole","main chance","major intersection","make a bee line","make haste","make it so","make my day","many happy returns","many wishes","maple syrup","marble rye","marcia marcia marcia","mare's nest","margin of error","mark it zero","market forces","marry me","mars rover","math test","mayan ruins","mea culpa","meat and drink","meat with gravy","meddling kids","media frenzy","melody pond","men in suits","mend fences","meow meow","metropolis","mexican wave","mickey finn","miles to go","milk was a bad choice","milkshake","million dollars","miloko plus","miloko plus vellocet","mimsy borogoves","minced oaths","mind the gap","minty fresh","mish-mash","miss you","mister wilson","modern love","moe's tavern","mom and dad","money lender","moo shoo pork","moon cheese","moot point","more better","more chocolate","more coffee","more cow bell","more internets","morning person","most interesting man","most likely","mother country","mother earth","motley crew","mouth watering","move along","move mountains","move over","moveable feast","movers and shakers","movie star","mrs robinson","muffled rap music","multi pass","mum's the word","mumbo jumbo","murphy's law","mushy peas","music machine","mustachioed","my bad","my beating heart","my better half","my dear watson","my friends can't dance","my mind's eye","my sources say no","naise cain","namby-pamby","name drop","nanoo nanoo","nap time","narrow minded","nautical phrases","ne regrets","near tannhauser gate","neart strings","neckbeard","need a bigger boat","needs must","nercolas cerg","nest egg","never give up","never gonna give you up","never mind","never quit","new york city","nice job","nice marmot","nice to meet you","night owl","nip and tuck","nitty gritty","no brainer","no crying in baseball","no dice","no friend of mine","no holds barred","no means no","no regrets","no soup for you","no spoon","no stinking badges","no time to explain","no way","nobody home","none of the above","nope chuck testa","nose bleed","nosy parker","not a bot","not in kansas","not yet","now and forever","now look here","nth degree","nul points","numa numa","nut case","nutrition","nyan cat","nyquist rate","of course","off the record","oh brother","oh em gee","oh hai","oh sigh","oh so close","oh yes","oh you","oh,you","oh, wait","okey dokey","old hat","old man winter","old shoe","om nom nom","on a boat","on cloud nine","on the ball","on the qt","on-off","once again","once upon a time","one day more","one fell swoop","one hit wonder","one small step for man","one stop shop","one way","one way street","one, two, three","only way to be sure","oontz oontz","oops a daisy","open season","open sesame","orange juice","other worldly","out of sorts","out of toner","outlook good","over the hill","over the moon","over the top","over there","oxford university","oxo cube","paint it red","pandora's box","pants on the ground","paper jam","paper plate","partial derivative","partly cloudy","party on garth","passing lane","patch of grass","path less taken","patience child","patty cake","pay the ferryman","pea brain","pearly whites","peg out","pell mell","penny loafer","people like me","pepe silvia","pepper pot","pepperoni pizza","peppers and onions","perfect world","pester power","peter out","philadelphia","phone home","pick me","pick up sticks","pickle juice","pickled peppers","picture perfect","pie are round","pie are squared","pie chart","piece of cake","pig's ear","piggyback","pin money","pipe down","pipe dream","piping hot","pitter patter","pizza topping","plain sailing","play a game","play again","play ball","play hookey","play it again sam","pleased as punch","plenty of time","plugged nickel","plus or minus","pocket sized","pod bay doors","poetic justice","point blank","point to point","points dont matter","points font matter","poison apple","political party","politicaly correct","poly's cracker","pond life","pool boy","pool hall","pool house","poor house","pork pies","pound cake","power dressing","power tool","practice makes perfect","press into service","prime time","primrose path","print out","print paper","printer paper","propane accessories","public good","pudding pops","puffy shirt","pumpkin pie","puppy dog","puppy love","push harder","push on","push the edge","push the envelope","pyrrhic victory","quality time","queen nefertiti","queen of hearts","queen's yacht","question everything","question mark","quid pro quo","quotations","rack and ruin","rack your brains","rain go away","rain tonight","rainy days","raise cain","raspberry tart","reach higher","read all over","read me, write me","read my mail","ready set go","real hoopy frood","real mccoy","red herring","red tape","red white and blue","red-handed","reduplicated phrases","remain calm","rent-a-swag","respect me","return to sender","reverse the polarity","rhino beetle","rhodeisland","rhyme nor reason","rhyming slang","rice and beans","rice job","ride the subway","riff-raff","right hand turn","right left","righty tighty","ring fencing","ring fenring","rinky-dink","rise and shine","river song","river styx","road apples","road less travelled","roast beef","robe of saffron","rocket science","rodents of unusual size","roflcopter","roll again","roll over","roller skates","rolling stone","rooftop","room for activities","roommate agreement","root beer float","rope burn","rosebud","rosie lea","rough diamond","round one","round robin","round tab1e","route one","row boat","roy g biv","royal flush","rubicon crossed","rule of chomio","rule of thumb","rum do","run amok","run away","run farther","run the gauntlet","run through","runny nose","saber tooth","sacred cow","safe streets","safer streets","safety first","salad days","salt and pepper","salty cheese","same same","sandy beach","saturday detention","saucy","sauer kraut","sausages","save face","save it","save our bluths","savoir faire","sax and violins","say cheese","school is cool","science class","science fair","science it works","science project","scot free","screw driver","sea change","sea shell","sea shore","seattle","see red","see ya","see-saw","seek beauty","seems legit","seize the day","select from table","send packing","senior citizen","seven ate nine","seven signs","seze the day","shake a leg","shaken not stirred","shakers and movers","shane come back","sharp pencil","sharp stick","she loves him","she sells","she sells seashells","she's a witch","sheldon alpha five","shilly-shally","ship shape","shoe shine","shoes shine","shoot through","shoulder of orion","show down","shuffle the deck","sick puppy","signal your turns","signs point to yes","silence is golden","silver bells","silver bullet","silver hoing","silver lining","silver spoon","sin cos tan","since when","sing a song","sixes and sevens","sixteen point turn","skidrow","skip a turn","sky's the limit","skynet is watching","skynet knows","skynet watches","sleep tight","sleepy hollow","slimy goop","slippery slope","sloane ranger","slow down","slow milenky lizards","slush fund","slythy toves","small fries","small fry","smart casual","smart phone","smashed potato","smell that","smelling salt","smoked salmon","snake eyes","snapshot","snare drum","sneezing baby panda","snoop lion","snow drift","snow flurry","snow shovel","so far away","so life like","so so","sod's law","soft kitty warm kitty","soft kitty, warm kitty","somebody that i used to know","sonic screw driver","sorry dave","sorry sight","souffle girl","sound bite","sound of sirens","sound out","sour grapes","space is big","space plumber","spangled banner","speeding bullet","spelling bee","spend time","spick and span","spicy","spicy hot","spin doctor","spitting feathers","spitting image","spoilers","spread the net","spring water","spruce up","square meal","square one","squeaky clean","squirrel friend","st johns bay","stalla stella","stand and deliver","stand by me","stand up guy","star spangled","star wars kid","start from scratch","stay safe","steak and eggs","steam punk","steering wheel","step back","step over","steve holt","steve jobs","sticky wicket","sting like a bee","stinking rich","stinky feet","stone soup","stone's throw","stony hearted","stool pigeon","stop waisting time","stranger danger","streams of oceanus","strike a match","strike three","string along","string cheese","stuck in mud","stump up","sudo make sandwich","sulphur smell","summon inglip","sun tzu says","sunday","sunshine","super star","surf and turf","surface integral","swan song","sweet dreams","sweety pie","swirling vortex of entropy","taco tuesday","take a look","take an umbrella","take care","take it all","take out food","take potluck","take the cake","take umbrage","take wrong turns","taken aback","talk the talk","talk to strangers","talk turkey","tall building","tall story","tastes good","tastes like chicken","tea earl gray hot","tea leaf","tea with jam","tea with milk","tear us apart","technicolor yawn","teflon president","teh inter webs","ten four","tesla coil","thank you","thank you, come again","that escalated quickly","that hurts","that will not work","that's a fact jack","that's all folks","that's enough","that's hot","that's it","that's my spot","that's right","the bee's knees","the bible","the big apple","the big cheese","the big easy","the cat lady","the cats cradle","the dennis system","the dude abides","the extra mile","the next level","the nightman cometh","the one eyed man is a king","the other side","the tribe has spoken","the yellow king","there is no spoon","there is only zul","there once was","these parts","they are watching","they ate it","thick and thin","thin air","think create do","think green","think hard","think twice","thinking cap","third degree","thirty one days","this is it","this is not fake","this is sparta","this or that","this statement is false","three short words","three strikes","through the grapevine","thumbs up","thunder storm","ticked off","tickle the ivories","tickled ivories","tickled pink","tide over","tight lipped","time and paper","time circuits","time flies","time is an illusion","time lord","time machine","time will tell","times square","tinker's dam","to boot","toast points","toe the line","toe-curling","together again","too bad","too late","too many cooks","too many secrets","too salty","toodle oo","top dog","top drawer","top notch","top ten","topsy turvy","topsy-turvy","total shamble","towel dry","tower of strength","toy soldier","traffic jam","traffic light","train surfing","travel size","treat yoself","trick or treat","trickle down","trolololol","true blue","true life","trust me","tuckered out","tuna fish","tune in","turkey sandwich","turn signal","turn the tables","turn up trumps","twenty eight days","twenty four seven","twenty one","twenty three","two cents worth","two hands","two left feet","two tone","u jelly","umbrella corporation","uncharted island","uncle leo","under the sea","underpants","union jack","unlimited wishes","untied laces","until next time","until tomorrow","until tonight","up and away","up or down","upper crust","upper hand","ups a daisy","upside down","upvote this","upward slope","urban myth","usual suspects","uu dd lr lr ba","van surfing","vanilla ice cream","veg out","vegan diet","vegan zombie wants grains","vegetarian","very doubtful","very nice","vice versa","vicious cycle","video tape","vienna calling","virtue of necessity","vis a vis","vocal minority","vogon poetry","voigt kampf","vorpal sword","vote pancakes","wake of the flood","walk free","walk the plank","walk the walk","want more","warp speed","wash whites separately","watch c-beams glitter","watch me","watch out","water gate","wax poetic","way to go","way to go donny","we go forwards","we like the moon","weakest link","weasel words","welcome to earth","well done","well heeled","well isn't that special","well now","well read","weylan yutani","what even","what ever","what for","what if","what is for dinner","what is your quest","what should we call me","what to see","what's that","wheel group","when where","where to go","whet your appetite","whistle and flute","white as snow","white bread","white elephant","white rabbit","who am i","who are you","who is it","who you gonna call","who, what, where","whoa there","whole nine yards","whole shebang","whoopee cushion","whoops a daisy","wicked witch","wide berth","wild and crazy guys","wild and woolly","wild goose chase","wild west","willy nilly","win hands down","window dressing","wing it","winning","winter is coming","winter snow","wisdom of inglip","wisdom teeth","wishy-washy","with bells on","without a doubt","woof woof","word for word","words of wisdom","work out","would you believe","wright flyer","writing desk","x all the y","xylophone","yada yada","yadda yadda yadda","yeah right","year dot","yee haw","yelling goat","yellow belly","yes definitely","yes ma'am","yes sir","yes this is dog","you are happy","you are here","you can do this","you don't say","you first","you good","you have my stapler","you rock","you the man","you win","you're in my spot","you're not listening","you're welcome","zig zag","zombie attack","zombie prom","who what where",];
    function solvemed(b){var a=document.createElement("datalist");a.setAttribute("id","adcopy_phrases");for(var c=0;c<PHRASES.length;++c)a.appendChild(document.createElement("option")).appendChild(document.createTextNode(PHRASES[c]));b.parentNode.insertBefore(a,b.nextSibling);b.setAttribute("list",a.id);}for(var scripts=document.getElementsByTagName("script"),i=0;i<scripts.length;++i)if(scripts[i].src.indexOf("solvemedia.com")> -1){document.body.addEventListener("keydown",function c(a){if(/^adcopy_response/.test(a.target.id)){this.removeEventListener(a.type,c);var b=a.target;solvemed(b);b.blur();b.focus();}});break;}}
}})();
}
