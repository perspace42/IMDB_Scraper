/*
Author: Scott Field
Date: 10/17/25
Purpose:
Automatically deploy UI Elements when extension is run.
Automatically adds Script to opened Tabs
*/

// Check if URL is suitable for injection (http or https)
function isInjectableUrl(url) {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
}

// Inject content script into a given tab, skip invalid URLs or chrome-extension pages
function injectContentScript(tab) {
  if (!tab || !tab.url) {
    console.log(`Skipping injection: tab ${tab?.id} has no URL.`);
    return;
  }
  if (tab.url.startsWith('chrome-extension://')) {
    console.log(`Skipping injection on extension page tab ${tab.id} with URL ${tab.url}`);
    return;
  }
  if (!isInjectableUrl(tab.url)) {
    console.log(`Skipping injection on tab ${tab.id} with URL ${tab.url}`);
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['Content/select.js'],
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Injection failed in tab ${tab.id}:`, chrome.runtime.lastError.message);
    } else {
      console.log(`Content script injected in tab ${tab.id}`);
    }
  });
}

// Inject content script into all open tabs on install/startup
function injectIntoAllTabs() {
  chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, tabs => {
    for (const tab of tabs) {
      injectContentScript(tab);
    }
  });
}

chrome.runtime.onInstalled.addListener(injectIntoAllTabs);
chrome.runtime.onStartup.addListener(injectIntoAllTabs);

// Inject script on tab updates when complete
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isInjectableUrl(tab.url)) {
    injectContentScript(tab);
  }
});

// Inject script on newly created tabs after load finished
chrome.tabs.onCreated.addListener(tab => {
  const listener = (tabId, changeInfo) => {
    if (tabId === tab.id && changeInfo.status === 'complete') {
      injectContentScript(tab);
      chrome.tabs.onUpdated.removeListener(listener);
    }
  };
  chrome.tabs.onUpdated.addListener(listener);
});

// UI window opening code unchanged
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL('View/ui.html'),
    type: 'normal',
    width: 400,
    height: 600,
  });
});
