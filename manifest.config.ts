import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Smart Bookmark",
  version: "0.1.0",
  description: "Summarize pages with AI and save",
  permissions: ["sidePanel", "activeTab", "storage", "tabs", "contextMenus"],
  action: {
    default_title: "Open Bookmark Panel",
    default_popup: "popup.html",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/contentScripts/content"], // Dont use .{js,ts} exts
    },
  ],
});
