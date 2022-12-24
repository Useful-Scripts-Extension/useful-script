export default {
  icon: '<i class="fa-solid fa-shield-virus fa-lg"></i>',
  name: {
    en: "Anti clickjacking",
    vi: "Chống clickjacking",
  },
  description: {
    en: "Anti clickjacking attack",
    vi: "Ngăn cản sự tấn công clickjacking",
  },
  infoLink: "https://viblo.asia/p/lo-hong-clickjacking-aWj536e1l6m",
  whiteList: ["http://*/*", "https://*/*"],

  onDocumentIdle: () => {
    // Source code copy from J2team security

    "use strict";
    // prettier-ignore
    "function"!=typeof String.prototype.includes&&(String.prototype.includes=function(e){return this.indexOf(e)>-1}),function(e,t){function n(e){var t=Array.from(document.querySelectorAll(e));t.length>0&&(t.map(function(e){e.remove()}),t=null)}function i(e){return!!e.hasAttribute("src")&&e.src.includes("facebook.com/plugins/like.php")}function r(e){if(e.hasAttribute("src")){var t=decodeURIComponent(e.src);if(t.toLowerCase().includes("href=")){var n=t.split("href=",2);if(n.length>1&&n[1].includes("&")){var i=n[1].split("&",1)[0];return i}}}return null}function o(){var e=document.getElementById("theiframe");null!==e&&i(e)&&(r(e),e.remove(),n('script[src*="likeme.js"]'))}t.storage.sync.get({anti_clickjacking:!0},function(t){t.anti_clickjacking&&(e.top===e&&o(),e.document.addEventListener("DOMContentLoaded",o))})}(window,chrome),function(e,t,n){var i=0,r=10,o=100,c=o,a="_no-clickjacking-",l=0,s={},u=function(){},f=function d(){u("detecting...",i,c);var n=t.getElementsByTagName("iframe"),f=[];for(var m in n)for(var p=n[m],g=p;g;){try{var v=getComputedStyle(g);if(v&&parseFloat("0"+v.opacity)<.1){u("found",g,p),c=o,i=0;var y=g.id;y||(y=a+l,l++,g.id=y),f.push(y)}}catch(h){u(h.message)}g=g.parentNode}if(f.length>0){var k="";for(var w in f){var E=f[w],j=t.getElementById(E);if("undefined"==typeof s[E]?s[E]=1:s[E]++,s[E]>3){var b=t.getElementById(E);null!==b&&u("too many strikes, removed",E)}else j.style.opacity=1,j.style.overflow="visible",k+="#"+E+"{opacity:1 !important;overflow: visible !important}"}if(k.length>0){var B=t.createElement("style");B.innerText=k;var C=t.getElementsByTagName("head");C.length>0&&C[0].appendChild(B)}}i<r?(i++,c+=i*o,e.setTimeout(d,c)):u("stopped")};n.storage.sync.get({anti_clickjacking:!0},function(t){t.anti_clickjacking&&e.top===e&&f()})}(window,document,chrome);
  },
};
