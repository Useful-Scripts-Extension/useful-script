export default {
  name: {
    en: "Scroll by dragging",
    vi: "cuộn web bằng cách kéo thả",
  },
  description: {
    en: "Use this will turn the cursor into a scroller and use it again will return it back to normal.",
    vi: "Bấm vào sẽ biến con trỏ thành con lăn và bấm lại nó sẽ đưa con trỏ trở lại bình thường",
  },
  blackList: [],
  whiteList: [],
  func: async function () {
    let X, Y;
    with(document){
        if(document.onmousedown&&document.onmouseup&&document.onmousemove){body.style.cursor='auto';document.onmousedown=document.onmouseup=document.onmousemove=null}else{body.style.cursor='all-scroll';document.onmousedown=function(e){if((e&&!e.button)||(window.event&&event.button&1)){with(e||event){X=clientX;Y=clientY;return(false)}}};document.onmouseup=function(e){if((e&&!e.button)||(window.event&&event.button&1)){X=Y=null;return(false)}};document.onmousemove=function(e){if(X||Y){with(e||event){scrollBy(X-clientX,Y-clientY);X=clientX;Y=clientY;return(false)}}}}
    }
  },
};
