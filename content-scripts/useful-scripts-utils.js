window.UsefulScriptsUtils = {
  // Có trang web tự động xoá console để ngăn cản người dùng xem kết quả thực thi câu lệnh trong console
  // Ví dụ: https://beta.nhaccuatui.com/
  // Hàm này sẽ tắt chức năng tự động clear console đó, giúp hacker dễ hack hơn :)
  disableAutoConsoleClear: () => {
    window.console.clear = () => null;
    console.log("Auto console.clear DISABLED!");
  },

  // Hiển thị tất cả các biến toàn cục được tạo ra trong trang web
  listGlobalVariables: () => {
    const defaultKeys = `window,self,document,name,location,customElements,history,locationbar,menubar,personalbar,scrollbars,statusbar,toolbar,status,closed,frames,length,top,opener,parent,frameElement,navigator,origin,external,screen,innerWidth,innerHeight,scrollX,pageXOffset,scrollY,pageYOffset,visualViewport,screenX,screenY,outerWidth,outerHeight,devicePixelRatio,clientInformation,screenLeft,screenTop,defaultStatus,defaultstatus,styleMedia,onsearch,isSecureContext,trustedTypes,performance,onappinstalled,onbeforeinstallprompt,crypto,indexedDB,sessionStorage,localStorage,onbeforexrselect,onabort,onbeforeinput,onblur,oncancel,oncanplay,oncanplaythrough,onchange,onclick,onclose,oncontextlost,oncontextmenu,oncontextrestored,oncuechange,ondblclick,ondrag,ondragend,ondragenter,ondragleave,ondragover,ondragstart,ondrop,ondurationchange,onemptied,onended,onerror,onfocus,onformdata,oninput,oninvalid,onkeydown,onkeypress,onkeyup,onload,onloadeddata,onloadedmetadata,onloadstart,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout,onmouseover,onmouseup,onmousewheel,onpause,onplay,onplaying,onprogress,onratechange,onreset,onresize,onscroll,onsecuritypolicyviolation,onseeked,onseeking,onselect,onslotchange,onstalled,onsubmit,onsuspend,ontimeupdate,ontoggle,onvolumechange,onwaiting,onwebkitanimationend,onwebkitanimationiteration,onwebkitanimationstart,onwebkittransitionend,onwheel,onauxclick,ongotpointercapture,onlostpointercapture,onpointerdown,onpointermove,onpointerrawupdate,onpointerup,onpointercancel,onpointerover,onpointerout,onpointerenter,onpointerleave,onselectstart,onselectionchange,onanimationend,onanimationiteration,onanimationstart,ontransitionrun,ontransitionstart,ontransitionend,ontransitioncancel,onafterprint,onbeforeprint,onbeforeunload,onhashchange,onlanguagechange,onmessage,onmessageerror,onoffline,ononline,onpagehide,onpageshow,onpopstate,onrejectionhandled,onstorage,onunhandledrejection,onunload,crossOriginIsolated,scheduler,alert,atob,blur,btoa,cancelAnimationFrame,cancelIdleCallback,captureEvents,clearInterval,clearTimeout,close,confirm,createImageBitmap,fetch,find,focus,getComputedStyle,getSelection,matchMedia,moveBy,moveTo,open,postMessage,print,prompt,queueMicrotask,releaseEvents,reportError,requestAnimationFrame,requestIdleCallback,resizeBy,resizeTo,scroll,scrollBy,scrollTo,setInterval,setTimeout,stop,structuredClone,webkitCancelAnimationFrame,webkitRequestAnimationFrame,chrome,caches,cookieStore,ondevicemotion,ondeviceorientation,ondeviceorientationabsolute,launchQueue,onbeforematch,getScreenDetails,queryLocalFonts,showDirectoryPicker,showOpenFilePicker,showSaveFilePicker,originAgentCluster,navigation,webkitStorageInfo,speechSynthesis,openDatabase,webkitRequestFileSystem,webkitResolveLocalFileSystemURL,NONCE_ID,getCookieConsentRequired,_ssrServiceEntryUrl,_webWorkerBundle,_authCookieName,authHeaderPromiseParts,_pageTimings,webWorker,onErrorHandler,webpackChunk_msnews_msnews_experiences,_secondaryPageTimings,_webVitalsPageTimings,_getEntityMetricsCollection,_isWebWorkerPresent,MSANTracker,Gemini,telemetryEventsClear,telemetryEventsFlush,__dynProto$Gbl,_getAppPerfTrace,Base64,_wpoContext,AutoSuggest`;
    const defaultKeysArr = defaultKeys.split(",");

    let all = {};
    Object.keys(window)
      .filter((x) => defaultKeysArr.indexOf(x) < 0)
      .forEach((key) => {
        all[key] = window[key];
      });

    return all;
  },
};
