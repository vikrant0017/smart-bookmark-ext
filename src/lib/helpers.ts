const BOOKMARKS_PAGE_PATH = "index.html";
const SETTINGS_PATH_PATH = "settings.html";

export const openBookmarks = () => {
  chrome.tabs.create({ url: BOOKMARKS_PAGE_PATH });
};

export const openSettings = () => {
  chrome.tabs.create({ url: SETTINGS_PATH_PATH });
};
