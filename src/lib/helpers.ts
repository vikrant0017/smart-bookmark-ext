const BOOKMARKS_PAGE_PATH = "index.html";

export const openBookmarks = () => {
  chrome.tabs.create({ url: BOOKMARKS_PAGE_PATH });
};
