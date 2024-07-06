import { UfsGlobal } from './content-scripts/ufs_global.js';
import { BADGES } from './helpers/badge.js';

export default {
  icon: `https://www.youtube.com/s/desktop/ff71ea81/img/favicon_48x48.png`,
  name: {
    en: 'Render buttons to download youtube video/audio',
    vi: 'Tạo các nút để tải video/audio youtube',
  },
  description: {
    en: 'Bypass age restriction, without login',
    vi: 'Tải cả video giới hạn độ tuổi, không cần đăng nhập',
  },
  badges: [BADGES.new],

  contentScript: {
    onDocumentIdle: () => {
      setTimeout(function () {
        // https://stackoverflow.com/a/8260383/11898496
        function getIdFromYoutubeURL(url) {
          const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          return match && match[1].length == 11 ? match[1] : false;
        }

        const colors = {
          default: '#272727',
          green: '#2fb024',
          red: '#e62e2e',
          blue: '#3034bd',
        };

        const providers = [
          {
            name: 'savefrom.net',
            color: colors.green,
            func: (url) => url.replace('youtube', 'ssyoutube'),
          },
          {
            name: '10downloader.com',
            color: colors.blue,
            func: (url) => url.replace('youtube', '000tube'),
          },
          {
            name: 'y2mate.com',
            color: colors.red,
            func: (url) => url.replace('youtube', 'youtubepp'),
          },
          {
            name: 'yt5s.com',
            color: colors.blue,
            func: (url) => url.replace('youtube', 'youtube5s'),
          },
          {
            name: 'yt1s.com',
            color: colors.red,
            func: (url) => 'https://yt1s.com/vi/youtube-to-mp4?q=' + url,
          },
          {
            name: 'tubemp3.to',
            color: colors.default,
            func: (url) => 'https://tubemp3.to/' + url,
          },
          {
            name: '10downloader.com',
            color: colors.default,
            func: (url) => 'https://10downloader.com/download?v=' + url,
          },
          {
            name: '9xbuddy.com',
            color: colors.default,
            func: (url) => 'https://9xbuddy.com/process?url=' + url,
          },
          {
            name: 'ymp4.com',
            color: colors.default,
            func: (url) => 'https://ymp4.download/?url=' + url,
          },
          {
            name: 'getlinks.vip',
            color: colors.default,
            func: (url) => 'https://getlinks.vip/vi/youtube/' + getIdFromYoutubeURL(url),
          },
        ];

        const videoUrl = window.location.href;

        const downloadIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events:none;display:inherit;width:100%;height:100%;">
          <path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path>
        </svg>`;

        const genDownloadLinkFromProvider = (provider, url) =>
          /* html */
          `<a
            href="${provider.func(url)}"
            target="_blank"
            class="ufs-ytDownloadVideoUI__btn"
            onclick="((e)=>e.stopPropagation())(event)">
            ${provider.name}
          </a>`;

        injectCss();

        let intervalId = setInterval(function () {
          const container = document.querySelector('#above-the-fold #title > h1');
          if (!container) return;

          clearInterval(intervalId);

          document.addEventListener('click', () => {
            const el = document.querySelector('#ufs-ytDownloadBtn__container');
            if (el && el.style.display === 'flex') el.style.display = 'none';
          });

          const links = providers.map((provider) => genDownloadLinkFromProvider(provider, videoUrl));

          container.insertAdjacentHTML(
            'afterend',
            /* html */
            `
            <button
              class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading"
              style="position:relative;margin:6px 0;"
              onclick="((e)=>{e.stopPropagation();const el = document.querySelector('#ufs-ytDownloadBtn__container');if (!el) return;el.style.display = el.style.display == 'flex' ? 'none' : 'flex'})(event)"
            >
              <div class="yt-spec-button-shape-next__icon">
                ${downloadIcon}
              </div>

              <div class="yt-spec-button-shape-next__button-text-content"><span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">Tải video</span></div>

              <div id="ufs-ytDownloadBtn__container" class="ufs-ytDownloadVideoUI__container">
                ${links.join('')}
              </div>
            </button>`
          );
        }, 500);
      }, 500);
    },
  },
};

function injectCss(path = '/scripts/youtube_downloadVideoUI.css', id = 'ufs-yt_downloadVideoUI-css') {
  if (!document.querySelector('#' + id)) {
    UfsGlobal.Extension.getURL(path).then((url) => {
      UfsGlobal.DOM.injectCssFile(url, id);
    });
  }
}
