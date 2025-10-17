/*
Author: Scott Field
Date: 10/17/25
Purpose:
Automatically deploy UI Elements when extension is run
*/
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
