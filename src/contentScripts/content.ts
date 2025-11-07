import { Readability } from "@mozilla/readability";
// Listen for messages from the popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message, sender);
  if (message.type === "EXTRACT_CONTENT") {
    // Create a new document object from scratch, to prevent content modification by Readbility
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      document.documentElement.outerHTML,
      "text/html",
    );

    const reader = new Readability(doc);
    const article = reader.parse();
    const llmContent = article?.textContent;

    console.log("HERE", llmContent?.substring(0, 100));

    sendResponse({
      message: llmContent,
      pageTitle: document.title,
      pageUrl: window.location.href,
    });
  }

  // Return true to indicate we'll send a response asynchronously
  return true;
});

console.log("Content script loaded");
