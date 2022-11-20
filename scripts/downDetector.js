export default {
  icon: "https://cdn2.downdetector.com/dc31f7f27fda396/images/v2/problem.svg",
  name: {
    en: "DownDetector - Check web die",
    vi: "DownDetector - Kiểm tra web die",
  },
  description: {
    en: "Check if current website is down on internet",
    vi: "Kiểm tra trang web hiện tại có bị lỗi trên mạng không",
  },
  runInExtensionContext: true,

  func: function () {
    // crawl list avai from https://downdetector.com/search/
    const avai = `000webhost,1-password,2600hz,2k,4chan,7daystodie,8x8,911-covid-testing,abc-us,abebook,absolver,accesoneinc,acorns,adams-networks,adobe-connect,adobe-creative-cloud,adp,adt,adyen,aer-lingus,agar-io,aidvantage,air-canada,airbnb,airespring,airnow,airtable,akamai,alamo-drafthouse,alaska-airlines,alaskacommunications,albion-online,amazon-alexa,aliexpress,all-west-communications,allegiant-air,ally,amazon,amazon-freevee,amazon-prime-music,amazon-prime-instant-video,aws-amazon-web-services,ambient-weather,amc-theatres,american-airlines,americanexpress,amex-serve,american-messaging,amino,ammyy,among-us,amtrak,ancestorsgame,ancestry,anno-1800,anthem,antietam,anydesk,aol,apex-legends,app-store,applecard,find-my-iphone,apple-fitness,apple-homekit,imessage,iwork,os-x-software-update,apple-maps,apple-music,apple-news,apple-store,apple-support,apple-tv,apple-tv-plus,appriver,appvalley,arbuckle,archeage,archive-of-our-own,ark,arlo,armstrong,arvest,arvig,asana,assassins-creed,wave-broadband,asus,att,atttv,atom-tickets,auth0,authorize-net,avoxi,backblaze,badoo,banco-popular-dominicano,bandcamp,bandwidth,bank-of-america,bankjerusalem,bankofthewest,barclays,bart,basecamp,telltale-games,batallion-1944,battleborn,battlefield,battlerite,bbt,bbva,becu,bein,bejeweled,benbroadband,best-buy,bet,bet365,bethesda,betmgm,bill-com,binance,bing,bitbucket,bitchute,bitfinex,bitflyer,bitstamp,bittrex,bitwarden,blackdesertdown,blackberry,blackboard,blade-and-soul,blazing-hog,blink-security,battle-net,blogger,blue-jay-wireless,bluebird,bluehost,bluejeans,bmo-harris,bmw-connected-drive,bnymellon,boingo,booking-com,boom-beach,borealis-broadband,box,boycom,braintree,brawl-stars,brawlhalla,breezeline,bridge-base-online,brightspeed,bring-a-trailer,bt-british-telecom,buckeye-cablesystem,buffer,bullet-force,bumble,bwin,c-spire,cableamerica,california-iso,call-of-duty,calltower,caltrain,candy-crush,candy-crush-soda,canva,instructure,capital-one,careershift,cash-app,cbs-fantasy-football,cbssports,centerpoint_energy,cdc,central-bank,central-hudson,centralmainepower,century-national-bank,centurylink,champions-legion,change-org,charles-schwab,chase,chegg,chewy,chicago-transit-authority,chime,chrome-web-store,chuffed,cigna,cincinnati-bell,cinemark,cirranet,cisco_webex_teams,citi,citizens-bank,cityofmontbelvieu,civilization,clash-of-clans,clash-royale,classlink,classy,clear,clever,clickfunnels,clickup,cloudflare,cloudli,cloudsmith,cnet,cnn,codeacademy,cogent,coinbase,coingecko,coldwellbanker,colgia,comedy-central,common-app,community-america,comporium,conan-exiles,confluence,connectwise,consolidated,coned,constant-contact,consumer-cellular,copy,coredial,costco,counter-strike,coursera,covidtests,cox-communications,crr-environmental-services,crackle,craigslist,credit-karma,credit-one-bank,creditone-bank,crexendo,cricket-wireless,criminalip,lightower,crunchyroll,crypto-com,cryptopia,cvent,dailymotion,diaryqueen,dankmemer,dark-souls,datto,dauntless,day-one,dayz,dazn,dc-universe-online,dead-by-daylight,deathstranding,deezer,defiance-2050,delta-air-lines,desire2learn,destiny,deviantart,dexcom,difm,diablo,digikey,digipcservers,digitalocean,directv,DIRECTVSTREAM,zaumstudio,discord,discover,discoveryplus,dish-network,disneyworld,disney-plus,disqus,dissenter,dvlottery,dlive,dochub,docker,docusign,dominionenergy,don-johnson,donorschoose,doom,doordash,dota-2,doublelist,downforeverybodyorjustme,draftkings,dragon-ball,dragonball-z,dramafever,dreamhost,driveclub,dropbox,dte-energy,duckduckgo,duelingbook,duke-energy,duo,duolingo,dyl,e-trade,ea,ea-sport-ufc,eaglecom,earnest,earthlink,easypost,ebay,echostar,eclinicalworks,ecobee,ecsi,edfinancial-services,edx,efax,epb,elevateinternet,elite-dangerous,ello,emirates,emoney,endicia,engine-yard,enom,epbfi,epic-games-store,escape-from-tarkov,espn,espn-fantasy-football,espn-plus,etherdelta,etoro,etsy,eufy,eveonline,evevalkyrie,eventbrite-us,evernote,everquest,everydayhero,ewtn,examsoft,exchange,exede,expedia,expensify,experian,explorelearning,express-scripts,express-vpn,ezoic,faceapp,facebook,facebook-messenger,faceit,facetime,fafsa,fairpoint-communications,fall-guys,fallout,family-search,fandango,fandom,fanduel,fanfiction,fantasypros,far-cry,fark,fastly,fastmail,fastpay,fatcow,fax2mail,federal-student-aid,fedex,fedloan-servicing,feedly,fidelity,fifa,figma,finalfantasyviipc,firstcomm,first-horizon,firstenergycorp,firstlight,firstmarkservices,firstnet,fitbit,fite,five9,fivem,fiverr,fleaflicker,flickr,flightradar24,fling,flipboard,flock,fpl,floridavirtualschool,for-honor,forgeofempires,fortnite,forza-motorsport,fox-news,fox-sports-go,frameio,frankfort-plantboard,free-fire,freedompop,freepik,freshdesk,freshservice,friday-the-13th,frii,frontier,frontier-airlines,fubo-tv,fundly,fundrazr,funimation,fur-affinity,fusionconnect,futurequest,fuze,fxnow,g-portal,g2a,gab,gaia-gps,game-of-thrones-conquest,game-of-war,gamebattles,gameloft,gamestop,gang-beasts,garmin,connect-garmin,gasbuddy,gatehub,gci,gearsofwar,geeking,gemini,gems-of-war,genshin-impact,geocaching,georgia-power,gfycat,ghost,ghost-recon,ghosttunes,github,gitlab,givecampus,glassdoor,glide,glitch,gmail,go-daddy,go-to,gofundme,gog-com,goguardian,goldman-sachs,goodreads,google,google-analytics,google-calendar,google-classroom,google-cloud,google-drive,google-duo,google-fiber,google-hangouts,google-maps,google-meet,google-nest,google-photos,google-play,gotoconnect,gotomeeting,grafana,grammarly,gran-turismo,grande,grayson-collin-electric-cooperative-gcec,great-lakes-educational-loan-services,greenlight,grindr,groove,groove-music,groupme,groupon,growtopia,grubhub,gta5,gtt,guild-wars-2,hr-block,halo,haloinfinite,halo-wars,happn,hargray,harry-potter-wizards-unite,hashflare,hawaiian-airlines,hawaiian-telcom,hay-day,hayu,hbo-max,healthcare-gov,hearthstone,heartland,hello-mobile,herecomesthebus,heroku,hibid,hidive,hesc,hilton,hinge,hipchat,hitbtc,hitman,hive,homes-com,honey,honeywell,hootsuite,horizonsatellite,hostgator,hosting24,hostinger-us,hostmonster,hotels-com,hotwire,hotwire-communications,houseparty,hq-trivia,hsbc,hubspot,hudson-valley-wireless,hue,hughesnet,hulu,humanity,humble-bundle,hunt-showdown,he,hyatt,hyperwallet,i-ready,i3broadband,ibm-cloud,icici-bank-us,icloud,icq,id-me,ifttt,ifunny,ign,igtv,iheartradio,ikea,illinois-gov,imgur,imvu,inbox,indeed,indiegogo,inet,infinite_campus,ingress,injustice,inmotion,instacart,instagram,integra,inter-mountain-cable,interactive-brokers,intermedia,imdb,invixium,ionos,ipage,ip-vanish,iqcent,iracing,iridium,ironsight,irs,itemfix,itslearning,itunes,itunes-connect,itunes-match,jabber,jackbox,jamf-school,jetblue-airways,jira,jive,jp-morgan,juno,jurassic-world-alive,kahn-academy,kaltrua,kayak,keap,keek,kickstarter,kik,kingdomhearts3,klarna,knockoutcity,kraken-exchange,kucoin,kumo-cloud,last-fm,lastpass,lawbreakers,layer3-tv,leaco,league-of-legends,league-of-legends-wild-rift,liberty-utilities,life360,lifesize,lightpath,limebike,limelight,line,linkedin,linode,liquid-web,liveperson,locast,logix,lolawireless,lost-ark,lowes,lsnetworks,lumen,lumos-networks,lyft,lynda,m-t-bank,macys,madden,maguss,mail-com,mailbox,mailchimp,maknet,manhunt,mapbox,mariokarttour,marriott,marta,marvel,marvel-contest-of-champions,maryland-transit-administration-mta,mashable,masseffect,mastercard,maxxsouth,mbta,mcdonalds,mediatemple,mediacom-communications,medicare,meetme,meetup,mega,megapath,membean,mercury-wireless,merriam-webster,merrill-lynch,metra,metrc,metrobyt-mobile,metrolink,metronetinc,mewe,mhz-choice,miami-dade-transit,micro-center,microsoft-365,windows-azure,microsoft,teams,microsoft-to-do,vlsc,midcontinent,milanote,mimecast,minecraft,mint,mint-mobile,mitel,mixer,mlb-the-show,mlb-tv,mobile-legends,mobile-strike,mohela,molina-healthcare,momentum-telecom,mondaydotcom,moneylion,monster-hunter,moodle,mordhau,morgan_stanley,mortalkombat,mouser,moviepass,movies-anywhere,movietickets,mls-live,mta-solutions,mtv,mu-legend,mural,musically,myfitnesspal,my-social-security,myq,namemc,naruto-storm,nba,nationalgridus,nih,navient,navy_federal_credit_union,nba-2k,nbc-sports-live-extra,nbc-news,nctc,nearpod,need-for-speed,nelnet,nemr,net10,netatmo,netblazr,neteller,netflix,netfortris,netsuite,nettalk,network-solutions,netzero,neverwinter,new-jersey-transit,new-world,new-york-mta,new-york-state,new-york-times,newegg,nextdoor,nextiva,nfl-fantasy-football,nfl-network,nice,nicehash,nifty,nikeplus,nintendo-eshop,nintendo-network,nintendo-switch-online,no-mans-sky,nomura,nook,nord-vpn,nortex-communications,north-state,northland,norwoodlight,notion,npm,us-ntt,nuget,nvidia,oculus,offerup,okcupid,osla,okta,omegle,onedrive,onelogin,onesource-communications,onstar,ooma,oovoo,opendns,opera,opticaltel,optimum-cablevision,oracle,oracle-cloud,orbitz,origin,outlook,outriders,overdrive,overwatch-2,ovh,png,pacific_power,page-plus,pagely,paladins,pandora,panopto,paperspace,epicgames-paragon,paramountplus,patco,path,path-of-exile,patreon,payday-2,paypal,pcloud,peacock,peloton,penteledata,periscope,personal-capital,pes,pge,pga-tour-live,phasmophobia,philo,phonepower,phonoscope-fiber,photobucket,piggtbackr,pinterest,plaid,planetzoo,planetside2,plasma-cloud,playstation-network,playstation-vue,pof,plex,plutotv,pnc,pokemon-duel,pokemon-go,pokerstars,poki,polar-communications,poloniex,postmates,powerschool,pozible,phs,prey,prezi,priceline,printify,procore,project,proofpoint,protonmail,playbattlegrounds,pupilpath,pypi,qlik,quad9,quake,questrade,quickbooks-intuit,quicken,quizlet,quizup,quora,rabbit,race-communications,rackspace,rainworldgame,rainbow-six,razer,rbc,rcn,realm-royale,realtor-com,recaptcha,red-dead-redemption,redbox,reddit,redfin,reflexion,renweb,residentevil2,restream,resy,returnal,lets-rev,revolut,ring,ringbyname,ringcentral,rise-broadband,robinhood,roblox,rocket-league,rocket-rez,roku,roll20,royal-games,rubygems,runescape,runkeeper,runtastic,rust,ruzzle,ryver,safelink-wireless,sage,salesforce,samsung-shop,santander_bank,concur,sarahah,savvas-realize,schooldesk,schoology,schoolpass,scottrade,scum,sea-of-thieves,sec-network,secom,second-life,securely,segra,sense,septa,service-electric,service-fusion,service-now,sharebuilder,sharefile,sharepoint,sharpspring,shentel,shopify,shoretel,showtime-anytime,shutterstock,sifibe,signal,signupgenius,simple,simple-mobile,simplisafe,sinclairbroadcastgroup,siri,siriusxm,skillshare,skoda-connect,skrill,skybest,skype,skype-for-business,skyscanner,skyswitch,skyward,skywest,slack,slashdot,sleeper,slideshare,sling,smart-hub,smartcom-telephone,smartsheet,smartthings,smite,snap-ebt,snapchat,snowflake,socket-telecom,sofi,sonic-net,sonos,soundcloud,soundtrap,sourceforge,socen,sce,southwest-airlines,sova,sparklight,spectrum,speedtest,splashid,splunk,spok,spotify,spyrothedragon,square,squarespace,intralinks,stackexchange,stackoverflow,stackpath,stadia,stamps-com,star-citizen,startrek-house-divided,star-wars-battlefront,starwars-jedi-fallen-order,starbucks,starlink,starz,oregon,steam,steep-ubisoft,straight-talk,strava,streamlabs,strife,stripe,stumble-guys,stylish,suddenlink-communications,suitebox,summit-broadband,summoners-war,suntrust-bank,surfline,surveymonkey,synchrony-bank,t-mobile,t-rowe-price,taichi-panda,talkray,tango,target,tata-communications,taxslayer,td-ameritrade,tdbank,tds-telecom,teamviewer,tekken,telecharge,telegram,tennis-tv,tera,tesla,thales,the-crew,the-culling,the-division,the-elder-scrolls-online,home-depot,huffington-post,the-last-of-us,outerworlds,the-simpsons,the-sims-4,departmentofeducation,the-weather-channel,thingiverse,thinkific,threads,threema,tiaa,ticketmaster,tidal,tiktok,tinder,tip-transparency,titanfall,tivo,todoist,toggle,tpx-communications,tracfone-wireless,tradeking,trade-satoshi,tradestation,trakt,transferwise,travelocity,treasurydirect,trello,trove,troy-cable,trulia,trusted-id,truth-social,tsys,ttec,tumblr,tunein,tunnelbear,turbotax,tutanota,tv-time,tweakbox,tweetdeck,twilio,twitch,twitter,txuenergy,uber,uber-eats,uplay,udacity,udemy,ufc,ulule,umg-gaming,uncharted,united-airlines,unrollme,untappd,untitledgoosegame,updraftplus,ups,upwork,us-bank,us-cellular,usaa,usps,uspsholdmail,utahbroadband,vainglory,valorant,vanguard,varo,vastbroadband,vectren,venmo,verizon,vero,vertex,viaero,viasat,viber,vidangel,viewster,viki,vimeo,vine,vipkid,virgin-mobile,visa,visible,visionary-broadband,visual-studio,v-live,vonage,voxer,vpn-unlimited,vrchat,vrv,vudu,broadbandnow,w3schools,waiter-com,walmart-family-mobile,wal-mart,war-thunder,warface,warframe,washington-metropolitan-area-transit-authority,wattpad,wayfair,waze,wunderground,webassign,webex,webhosting-net,webreus,webs,webtoon,webull,weebly,wefunder,weightwatchers,welink,wells-fargo,wemo,westman,wetransfer,whatsapp,whatsapp-business,whisper,wifiber,wikipedia,wilcoinc,wildstar,wiline,william-hill,wimkin,windermere,windstream,wish,wix,wolters-kluwer,wordle,wordpresscom,workday,who,world-of-tanks,world-of-warcraft,world-of-warships,world-war-3,world-war-z,wow,wow-presents-plus,wp-engine,wwenetwork,wyze,xbox-live,xfinity,xfinity-flex,xoom,yahoo,yahoo-fantasy-football,yahoo-mail,yahoo-messenger,yammer,yelp,yodlee,youtube,youtube-music,youtube-tv,yubo,h1z1,zayo,zelle,zendesk,zettle,zillow,ziply_fiber,zoho,zoom,zultys,zwift,zynga`;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var currentTab = tabs[0];
      if (currentTab?.url) {
        const hostname = new URL(currentTab?.url).hostname;
        let avaiSorted = avai
          .split(",")
          .map((a) => {
            let score = 0;
            let parts = a.split("-");
            parts.forEach((p) => {
              if (hostname.includes(p)) score += p.length * 10;
            });

            let full = parts.join("");
            if (hostname.includes(full)) score += full.length * 5;

            let chars = full.split("");
            chars.forEach((c) => {
              if (hostname.includes(c)) score++;
            });

            return {
              name: a,
              score,
            };
          })
          .sort((a, b) => b.score - a.score);

        const mostEqual = avaiSorted[0];
        let name = prompt("Enter web name to check", mostEqual.name);
        if (name) {
          window.open("https://downdetector.com/search/?q=" + name);
        }
      } else {
        alert("Không tìm thấy url web hiện tại");
      }
    });
  },
};
