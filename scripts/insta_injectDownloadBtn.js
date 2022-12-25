export default {
  icon: "https://www.instagram.com/favicon.ico",
  name: {
    en: "Add Instagram download button",
    vi: "Thêm nút tải cho Instagram",
  },
  description: {
    en: "Add a download button to all photo/video/post/story on Instagram",
    vi: "Thêm nút để tải (ảnh/video/story/post) trên Instagram",
  },
  whiteList: ["https://www.instagram.com/*"],

  onDocumentIdle: () => {
    // ==UserScript==
    // @name                Instagram Download Button
    // @name:zh-TW          Instagram 下載器
    // @name:zh-CN          Instagram 下载器
    // @name:ja             Instagram ダウンローダー
    // @name:ko             Instagram 다운로더
    // @name:es             Descargador de Instagram
    // @name:fr             Téléchargeur Instagram
    // @name:hi             इंस्टाग्राम डाउनलोडर
    // @name:ru             Загрузчик Instagram
    // @namespace           https://github.com/y252328/Instagram_Download_Button
    // @version             1.15.3
    // @compatible          chrome
    // @compatible          firefox
    // @compatible          edge
    // @description         Add the download button and the open button to download or open profile picture and media in the posts, stories, and highlights in Instagram
    // @description:zh-TW   在Instagram頁面加入下載按鈕與開啟按鈕，透過這些按鈕可以下載或開啟大頭貼與貼文、限時動態、Highlight中的照片或影片
    // @description:zh-CN   在Instagram页面加入下载按钮与开启按钮，透过这些按钮可以下载或开启大头贴与贴文、限时动态、Highlight中的照片或影片
    // @description:ja      メディアをダウンロードまたは開くためのボタンを追加します
    // @description:ko      미디어를 다운로드하거나 여는 버튼을 추가합니다
    // @description:es      Agregue botones para descargar o abrir medios
    // @description:fr      Ajoutez des boutons pour télécharger ou ouvrir des médias
    // @description:hi      मीडिया को डाउनलोड या खोलने के लिए बटन जोड़ें।
    // @description:ru      Добавьте кнопки для загрузки или открытия медиа
    // @author              ZhiYu
    // @match               https://www.instagram.com/*
    // @grant               none
    // @license             MIT
    // ==/UserScript==

    // prettier-ignore
    (function () {
    'use strict';

    // =================
    // =    Options    =
    // =================
    // Old method is faster than new method, but not work or unable get highest resolution media sometime 
    const disableNewUrlFetchMethod = false;
    const prefetchAndAttachLink = true; // add link into the button elements
    const postFilenameTemplate = '%id%-%datetime%-%medianame%';
    const storyFilenameTemplate = postFilenameTemplate;
    const replaceJpegWithJpg = false;

    // ==================

    const postIdPattern = /^\/p\/([^/]+)\//;
    function yyyymmdd(date) {
        // ref: https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object?page=1&tab=votes#tab-top
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();

        return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
    }

    var svgDownloadBtn = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="24" width="24"
        viewBox="0 0 477.867 477.867" style="fill:%color;" xml:space="preserve">
        <g>
            <path d="M443.733,307.2c-9.426,0-17.067,7.641-17.067,17.067v102.4c0,9.426-7.641,17.067-17.067,17.067H68.267
                c-9.426,0-17.067-7.641-17.067-17.067v-102.4c0-9.426-7.641-17.067-17.067-17.067s-17.067,7.641-17.067,17.067v102.4
                c0,28.277,22.923,51.2,51.2,51.2H409.6c28.277,0,51.2-22.923,51.2-51.2v-102.4C460.8,314.841,453.159,307.2,443.733,307.2z"/>
        </g>
        <g>
            <path d="M335.947,295.134c-6.614-6.387-17.099-6.387-23.712,0L256,351.334V17.067C256,7.641,248.359,0,238.933,0
                s-17.067,7.641-17.067,17.067v334.268l-56.201-56.201c-6.78-6.548-17.584-6.36-24.132,0.419c-6.388,6.614-6.388,17.099,0,23.713
                l85.333,85.333c6.657,6.673,17.463,6.687,24.136,0.031c0.01-0.01,0.02-0.02,0.031-0.031l85.333-85.333
                C342.915,312.486,342.727,301.682,335.947,295.134z"/>
        </g>
    </svg>`;

    var svgNewtabBtn = `<svg id="Capa_1" style="fill:%color;" viewBox="0 0 482.239 482.239" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
        <path d="m465.016 0h-344.456c-9.52 0-17.223 7.703-17.223 17.223v86.114h-86.114c-9.52 0-17.223 7.703-17.223 17.223v344.456c0 9.52 7.703 17.223 17.223 17.223h344.456c9.52 0 17.223-7.703 17.223-17.223v-86.114h86.114c9.52 0 17.223-7.703 17.223-17.223v-344.456c0-9.52-7.703-17.223-17.223-17.223zm-120.56 447.793h-310.01v-310.01h310.011v310.01zm103.337-103.337h-68.891v-223.896c0-9.52-7.703-17.223-17.223-17.223h-223.896v-68.891h310.011v310.01z"/>
    </svg>`;

    document.addEventListener('keydown', keyDownHandler);

    function keyDownHandler(event) {
        if (window.location.href === 'https://www.instagram.com/') return;

        const mockEventTemplate = {
            stopPropagation: function(){},
            preventDefault: function(){}
        };

        if (event.altKey && event.key === 'k') {
            let buttons = document.getElementsByClassName('download-btn');
            if (buttons.length > 0) {
                let mockEvent = { ...mockEventTemplate };
                mockEvent.currentTarget = buttons[buttons.length - 1];
                if (prefetchAndAttachLink) onMouseInHandler(mockEvent);
                onClickHandler(mockEvent);
            }
        }
        if (event.altKey && event.key === 'i') {
            let buttons = document.getElementsByClassName('newtab-btn');
            if (buttons.length > 0) {
                let mockEvent = { ...mockEventTemplate };
                mockEvent.currentTarget = buttons[buttons.length - 1];
                if (prefetchAndAttachLink) onMouseInHandler(mockEvent);
                onClickHandler(mockEvent);
            }
        }

        if (event.altKey && event.key === 'l') {
            // right arrow
            let buttons = document.getElementsByClassName('coreSpriteRightChevron');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        }

        if (event.altKey && event.key === 'j') {
            // left arrow
            let buttons = document.getElementsByClassName('coreSpriteLeftChevron');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        }
    }

    var checkExistTimer = setInterval(function () {
        let sharePostSelector = 'article section span button';
        let storySelector = 'header button > div';
        let profileSelector = 'header section svg circle';
        // Thanks for Jenie providing color check code
        // https://greasyfork.org/zh-TW/scripts/406535-instagram-download-button/discussions/122185
        let iconColor = getComputedStyle(document.body).backgroundColor === 'rgb(0, 0, 0)' ? 'white' : 'black';

        // check profile
        if (document.getElementsByClassName('custom-btn').length === 0) {
            if (document.querySelector(profileSelector)) {
                addCustomBtn(document.querySelector(profileSelector), iconColor, append2Header);
            }
        }

        // check post
        let articleList = document.querySelectorAll('article');
        for (let i = 0; i < articleList.length; i++) {
            if (articleList[i].querySelector(sharePostSelector) && articleList[i].getElementsByClassName('custom-btn').length === 0) {
                addCustomBtn(articleList[i].querySelector(sharePostSelector), iconColor, append2Post);
            }
        }

        // check story
        if (document.getElementsByClassName('custom-btn').length === 0) {
            if (document.querySelector(storySelector)) {
                addCustomBtn(document.querySelector(storySelector), 'white', append2Post);
            }
        }
    }, 500);

    function append2Header(node, btn) {
        node.parentNode.parentNode.parentNode.appendChild(btn, node.parentNode.parentNode);
    }

    function append2Post(node, btn) {
        node.parentNode.parentNode.appendChild(btn);
    }

    function addCustomBtn(node, iconColor, appendNode) {
        // add download button and set event handlers
        // add newtab button
        let newtabBtn = createCustomBtn(svgNewtabBtn, iconColor, 'newtab-btn', '16px');
        appendNode(node, newtabBtn);

        // add download button
        let downloadBtn = createCustomBtn(svgDownloadBtn, iconColor, 'download-btn', '14px');
        appendNode(node, downloadBtn);

        if (prefetchAndAttachLink) {
            onMouseInHandler({ currentTarget: newtabBtn });
            onMouseInHandler({ currentTarget: downloadBtn });
        }
    }

    function createCustomBtn(svg, iconColor, className, marginLeft) {
        let newBtn = document.createElement('a');
        newBtn.innerHTML = svg.replace('%color', iconColor);
        newBtn.setAttribute('class', 'custom-btn ' + className);
        newBtn.setAttribute('target', '_blank');
        newBtn.setAttribute('style', 'cursor: pointer;margin-left: ' + marginLeft + ';margin-top: 8px;z-index: 999;');
        newBtn.onclick = onClickHandler;
        if (prefetchAndAttachLink) newBtn.onmouseenter = onMouseInHandler;
        if (className.includes('newtab')) {
            newBtn.setAttribute('title', 'Open in new tab');
        } else {
            newBtn.setAttribute('title', 'Download');
        }
        return newBtn;
    }

    function onClickHandler(e) {
        // handle button click
        let target = e.currentTarget;
        e.stopPropagation();
        e.preventDefault();
        if (window.location.pathname.includes('stories')) {
            storyOnClicked(target);
        } else if (document.querySelector('header') && document.querySelector('header').contains(target)) {
            profileOnClicked(target);
        } else {
            postOnClicked(target);
        }
    }

    function onMouseInHandler(e) {
        let target = e.currentTarget;
        if (!prefetchAndAttachLink) return;
        if (window.location.pathname.includes('stories')) {
            storyOnMouseIn(target);
        } else if (document.querySelector('header') && document.querySelector('header').contains(target)) {
            profileOnMouseIn(target);
        } else {
            postOnMouseIn(target);
        }
    }

    // ================================
    // ====        Profile         ====
    // ================================
    function profileOnMouseIn(target) {
        let url = profileGetUrl(target);
        target.setAttribute('href', url);
    }

    function profileOnClicked(target) {
        // extract profile picture url and download or open it
        let url = profileGetUrl(target);

        if (url.length > 0) {
            // check url
            if (target.getAttribute('class').includes('download-btn')) {
                // generate filename
                const filename = document.querySelector('header h2').textContent;
                downloadResource(url, filename);
            } else {
                // open url in new tab
                openResource(url);
            }
        }
    }

    function profileGetUrl(target) {
        let img = document.querySelector('header img');
        let url = img.getAttribute('src');
        return url;
    }

    // ================================
    // ====         Post           ====
    // ================================
    async function postOnMouseIn(target) {
        let articleNode = postGetArticleNode(target);
        let { url } = await postGetUrl(target, articleNode);
        target.setAttribute('href', url);
    }

    async function postOnClicked(target) {
        // extract url from target post and download or open it
        let articleNode = postGetArticleNode(target);
        let { url, mediaIndex } = await postGetUrl(target, articleNode);

        // download or open media url
        if (url.length > 0) {
            // check url
            if (target.getAttribute('class').includes('download-btn')) {
                let mediaName = url
                    .split('?')[0]
                    .split('\\')
                    .pop()
                    .split('/')
                    .pop();
                mediaName = mediaName.substring(0, mediaName.lastIndexOf('.'));
                let datetime = new Date(articleNode.querySelector('time').getAttribute('datetime'));
                datetime =
                    yyyymmdd(datetime) +
                    '_' +
                    datetime
                        .toTimeString()
                        .split(' ')[0]
                        .replace(/:/g, '');
                let posterName = articleNode
                    .querySelector('header a')
                    .getAttribute('href')
                    .replace(/\//g, '');
                let postId = articleNode
                    .querySelector('a time')
                    .closest('a')
                    .getAttribute('href')
                    .match(postIdPattern)[1];
                let filename = filenameFormat(postFilenameTemplate, posterName, datetime, mediaName, postId, mediaIndex);
                downloadResource(url, filename);
            } else {
                // open url in new tab
                openResource(url);
            }
        }
    }

    function postGetArticleNode(target) {
        let articleNode = target;
        while (articleNode && articleNode.tagName !== 'ARTICLE') {
            articleNode = articleNode.parentNode;
        }
        return articleNode;
    }

    async function postGetUrl(target, articleNode) {
        // meta[property="og:video"]
        let list = articleNode.querySelectorAll('li[style][class]');
        let url = null;
        let mediaIndex = 0;
        if (list.length === 0) {
            // single img or video
            if (!disableNewUrlFetchMethod) url = await getUrlFromInfoApi(articleNode);
            if (url === null) {
                if (articleNode.querySelector('article  div > video')) {
                    // media type is video
                    let videoElem = articleNode.querySelector('article  div > video');
                    url = videoElem.getAttribute('src');
                    if (videoElem.hasAttribute('videoURL')) {
                        url = videoElem.getAttribute('videoURL');
                    } else if (url === null || url.includes('blob')) {
                        url = await fetchVideoURL(articleNode, videoElem);
                    }
                } else if (articleNode.querySelector('article  div[role] div > img')) {
                    // media type is image
                    url = articleNode.querySelector('article  div[role] div > img').getAttribute('src');
                } else {
                    console.log('Err: not find media at handle post single');
                }
            }
        } else {
            // multiple imgs or videos
            const postView = location.pathname.startsWith('/p/');
            const dotsElements = [...articleNode.querySelector(`:scope > div > div:nth-child(${postView ? 1 : 2}) > div > div:nth-child(2)`).children];
            mediaIndex = [...dotsElements].reduce((result, element, index) => (element.classList.length === 2 ? index : result), null);

            if (!disableNewUrlFetchMethod) url = await getUrlFromInfoApi(articleNode, mediaIndex);
            if (url === null) {
                const listElements = [...articleNode.querySelectorAll(`:scope > div > div:nth-child(${postView ? 1 : 2}) > div > div:nth-child(1) ul li[style*="translateX"]`)];
                const listElementWidth = Math.max(...listElements.map(element => element.clientWidth));

                const positionsMap = listElements.reduce((result, element) => {
                    // console.log(Number(element.style.transform.match(/-?(\d+)/)[1]));
                    const position = Math.round(Number(element.style.transform.match(/-?(\d+)/)[1]) / listElementWidth);
                    return { ...result, [position]: element };
                }, {});

                console.log({ dotsElements, listElements, listElementWidth, positionsMap });

                const node = positionsMap[mediaIndex];
                if (node.querySelector('video')) {
                    // media type is video
                    let videoElem = node.querySelector('video');
                    url = videoElem.getAttribute('src');
                    if (videoElem.hasAttribute('videoURL')) {
                        url = videoElem.getAttribute('videoURL');
                    } else if (url === null || url.includes('blob')) {
                        url = await fetchVideoURL(articleNode, videoElem);
                    }
                } else if (node.querySelector('img')) {
                    // media type is image
                    url = node.querySelector('img').getAttribute('src');
                }
            }
        }
        return { url, mediaIndex };
    }

    let infoCache = {}; // key: media id, value: info json
    let mediaIdCache = {}; // key: post id, value: media id
    async function getUrlFromInfoApi(articleNode, mediaIdx = 0) {
        // return media url if found else return null
        // fetch flow:
        //	 1. find post id
        //   2. use step1 post id to send request to get post page 
        //   3. find media id from the reponse text of step2
        //   4. find app id in clicked page
        //   5. send info api request with media id and app id
        //   6. get media url from response json
        try {
            const appIdPattern = /"X-IG-App-ID":"([\d]+)"/
            const mediaIdPattern = /instagram:\/\/media\?id=(\d+)|["' ]media_id["' ]:["' ](\d+)["' ]/
            function findAppId() {
                let bodyScripts = document.querySelectorAll("body > script");
                for (let i = 0; i < bodyScripts.length; ++i) {
                    let match = bodyScripts[i].text.match(appIdPattern);
                    if (match) return match[1];
                }
                console.log("Cannot find app id");
                return null;
            }

            function findPostId() {
                const timeSelector = 'time._aaqe';
                let nodeWalker = articleNode.querySelector(timeSelector);
                if (nodeWalker) {
                    for (let i = 0; i < 10 && nodeWalker.parentNode; ++i) {
                        nodeWalker = nodeWalker.parentNode;
                        if (nodeWalker.tagName === "A") {
                            break;
                        }
                    }
                    if (nodeWalker.tagName === "A") {
                        let link = nodeWalker.getAttribute('href');
                        let match = link.match(postIdPattern);
                        if (match) return match[1];
                    }
                }
                return null;
            }

            async function findMediaId() {
                let match = window.location.href.match(/www.instagram.com\/stories\/[^\/]+\/(\d+)/)
                if (match) return match[1];

                let postId = await findPostId();
                if (!postId) {
                    console.log("Cannot find post id");
                    return null;
                }
                if (!(postId in mediaIdCache)) {
                    let postUrl = `https://www.instagram.com/p/${postId}/`;
                    let resp = await fetch(postUrl);
                    let text = await resp.text();
                    let idMatch = text.match(mediaIdPattern);
                    let mediaId = null;
                    for (let i = 0; i < idMatch.length; ++i) {
                        if (idMatch[i]) mediaId = idMatch[i];
                    }
                    if (!mediaId) return null;
                    mediaIdCache[postId] = mediaId;
                }
                return mediaIdCache[postId];
            }

            function getImgOrVideoUrl(item) {
                if ("video_versions" in item) {
                    return item.video_versions[0].url;
                } else {
                    return item.image_versions2.candidates[0].url;
                }
            }

            let appId = findAppId();
            if (!appId) return null;
            let headers = {
                method: 'GET',
                headers: {
                    Accept: '*/*',
                    'X-IG-App-ID': appId
                },
                credentials: 'include',
                mode: 'cors'
            };

            let mediaId = await findMediaId();
            if (!mediaId) {
                console.log("Cannot find media id");
                return null;
            }
            if (!(mediaId in infoCache)) {
                let url = 'https://i.instagram.com/api/v1/media/' + mediaId + '/info/';
                let resp = await fetch(url, headers);
                if (resp.status !== 200) {
                    console.log(`Fetch info API failed with status code: ${resp.status}`);
                    return null;
                }
                let respJson = await resp.json();
                infoCache[mediaId] = respJson;
            }
            let infoJson = infoCache[mediaId];
            if ('carousel_media' in infoJson.items[0]) {
                // multi-media post
                return getImgOrVideoUrl(infoJson.items[0].carousel_media[mediaIdx]);
            } else {
                // single media post
                return getImgOrVideoUrl(infoJson.items[0]);
            }
        } catch (e) {
            // console.log(`Uncatched in getUrlFromInfoApi(): ${e}\n${e.stack}`);
            return null;
        }
    }

    async function fetchVideoURL(articleNode, videoElem) {
        let poster = videoElem.getAttribute('poster');
        let timeNodes = articleNode.querySelectorAll('time');
        // special thanks 孙年忠 (https://greasyfork.org/en/scripts/406535-instagram-download-button/discussions/120159)
        let posterUrl = timeNodes[timeNodes.length - 1].parentNode.parentNode.href;
        const posterPattern = /\/([^\/?]*)\?/;
        let posterMatch = poster.match(posterPattern);
        let postFileName = posterMatch[1];
        let resp = await fetch(posterUrl);
        let content = await resp.text();
        // special thanks to 孙年忠 for the pattern (https://greasyfork.org/zh-TW/scripts/406535-instagram-download-button/discussions/116675)
        const pattern = new RegExp(`${postFileName}.*?video_versions.*?url":("[^"]*")`, 's');
        let match = content.match(pattern);
        let videoUrl = JSON.parse(match[1]);
        videoUrl = videoUrl.replace(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/g, 'https://scontent.cdninstagram.com');
        videoElem.setAttribute('videoURL', videoUrl);
        return videoUrl;
    }

    // ================================
    // ====        Story           ====
    // ================================
    async function storyOnMouseIn(target) {
        let sectionNode = storyGetSectionNode(target);
        let url = await storyGetUrl(target, sectionNode);
        target.setAttribute('href', url);
    }

    async function storyOnClicked(target) {
        // extract url from target story and download or open it
        let sectionNode = storyGetSectionNode(target);
        let url = await storyGetUrl(target, sectionNode);

        // download or open media url
        if (target.getAttribute('class').includes('download-btn')) {
            let mediaName = url
                .split('?')[0]
                .split('\\')
                .pop()
                .split('/')
                .pop();
            mediaName = mediaName.substring(0, mediaName.lastIndexOf('.'));
            let datetime = new Date(sectionNode.querySelector('time').getAttribute('datetime'));
            datetime =
                yyyymmdd(datetime) +
                '_' +
                datetime
                    .toTimeString()
                    .split(' ')[0]
                    .replace(/:/g, '');
            let posterName = sectionNode
                .querySelector('header a')
                .getAttribute('href')
                .replace(/\//g, '');

            let filename = filenameFormat(storyFilenameTemplate, posterName, datetime, mediaName);
            downloadResource(url, filename);
        } else {
            // open url in new tab
            openResource(url);
        }
    }

    function storyGetSectionNode(target) {
        let sectionNode = target;
        while (sectionNode && sectionNode.tagName !== 'SECTION') {
            sectionNode = sectionNode.parentNode;
        }
        return sectionNode;
    }

    async function storyGetUrl(target, sectionNode) {
        let url = null;
        if (!disableNewUrlFetchMethod) url = await getUrlFromInfoApi(target);

        if (!url) {
            if (sectionNode.querySelector('video > source')) {
                url = sectionNode.querySelector('video > source').getAttribute('src');
            } else if (sectionNode.querySelector('img[decoding="sync"]')) {
                let img = sectionNode.querySelector('img[decoding="sync"]');
                url = img.srcset.split(/ \d+w/g)[0].trim(); // extract first src from srcset attr. of img
                if (url.length > 0) {
                    return url;
                }
                url = sectionNode.querySelector('img[decoding="sync"]').getAttribute('src');
            } else if (sectionNode.querySelector('video')) {
                url = sectionNode.querySelector('video').getAttribute('src');
            }
        }
        return url;
    }

    function filenameFormat(template, id, datetime, medianame, postId = +new Date(), mediaIndex = '0') {
        let filename = template;
        filename = filename.replace(/%id%/g, id);
        filename = filename.replace(/%datetime%/g, datetime);
        filename = filename.replace(/%medianame%/g, medianame);
        filename = filename.replace(/%postId%/g, postId)
        filename = filename.replace(/%mediaIndex%/g, mediaIndex);
        return filename;
    }

    function openResource(url) {
        // open url in new tab
        var a = document.createElement('a');
        a.href = url;
        a.setAttribute('target', '_blank');
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function forceDownload(blob, filename, extension) {
        // ref: https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down
        var a = document.createElement('a');
        if (replaceJpegWithJpg) extension = extension.replace('jpeg', 'jpg')
        a.download = filename + '.' + extension;
        a.href = blob;
        // For Firefox https://stackoverflow.com/a/32226068
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    // Current blob size limit is around 500MB for browsers
    function downloadResource(url, filename) {
        if (url.startsWith('blob:')) {
            forceDownload(url, filename, 'mp4');
            return;
        }
        console.log(`Dowloading ${url}`);
        // ref: https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down
        if (!filename) {
            filename = url
                .split('\\')
                .pop()
                .split('/')
                .pop();
        }
        fetch(url, {
            headers: new Headers({
                Origin: location.origin,
            }),
            mode: 'cors',
        })
            .then(response => response.blob())
            .then(blob => {
                const extension = blob.type.split('/').pop();
                let blobUrl = window.URL.createObjectURL(blob);
                forceDownload(blobUrl, filename, extension);
            })
            .catch(e => console.error(e));
    }
    })();
  },
};
