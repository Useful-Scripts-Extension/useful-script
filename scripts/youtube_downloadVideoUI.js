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
          let regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
          let match = url.match(regExp);
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
            func: (url) => 'https://ymp4.download/en50/?url=' + url,
          },
          {
            name: 'getlinks.vip',
            color: colors.default,
            func: (url) => 'https://getlinks.vip/vi/youtube/' + getIdFromYoutubeURL(url),
          },
        ];

        const videoUrl = window.location.href;

        const genDownloadLinkFromProvider = (provider, url) =>
          /* html */
          `<a href="${provider.func(
            url
          )}" target="_blank" style="display:inline-block;font-size:16px;padding:8px 12px;background-color:${
            provider.color
          };color:white;border-radius:12px;text-decoration:none;font-weight:bold">${provider.name}</a>`;

        let intervalId = setInterval(function () {
          const container = document.querySelector('#above-the-fold #title > h1');
          if (!container) return;

          clearInterval(intervalId);

          const links = providers.map((provider) => genDownloadLinkFromProvider(provider, videoUrl));

          container.insertAdjacentHTML(
            'afterend',
            /* html */
            `<div style="display:flex;justify-content:start;align-items:center;flex-wrap:wrap;gap:6px;width:100%;h:max-content">
            ${links.join('')}
          </div>`
          );
        }, 500);
      }, 500);
    },
  },
};
