import { BADGES } from './helpers/badge.js';

const contextMenuId = 'youglish-search';

export default {
  icon: '<i class="fa-solid fa-expand fa-lg fa-bounce"></i>',
  name: {
    en: 'YouGlish search',
    vi: 'Tìm kiếm trên YouGlish',
  },
  description: {
    en: "Master English pronunciation naturally! Learn how to pronounce tricky sounds like a native with YouGlish's real-world clips. No more dictionary confusion, just real English in context. (from 'youglish.com')",
    vi: 'Làm chủ phát âm tiếng Anh một cách tự nhiên! Học cách phát âm những âm thanh khó khăn như người bản xứ với các đoạn video thực tế từ YouGlish. Không còn bối rối với từ điển, chỉ có tiếng Anh thực sự trong ngữ cảnh. (từ "youglish.com")',
  },
  badges: [BADGES.new],
  changeLogs: {
    '2024-07-06': 'init',
  },

  popupScript: {
    onClick: () => window.close(),
  },

  backgroundScript: {
    runtime: {
      onInstalled: () => {
        chrome.contextMenus.create({
          title: 'YouGlish Search',
          contexts: ['selection'],
          id: contextMenuId,
          parentId: 'root',
        });
      },
    },
    contextMenus: {
      onClicked: ({ info }, context) => {
        if (info.menuItemId == contextMenuId) {
          const content = (info.selectionText || '').trim().toLowerCase();
          if (!content.length) return;

          const link = `https://youglish.com/pronounce/${content}/english`;
          chrome.tabs.create({ url: link });
        }
      },
    },
  },
};
