/*
Author: Scott Field
Date: 10/17/2025
Purpose: Dynamically Fill The UI with data.
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received:', request, 'from:', sender);
  if (request.type === 'elementClicked') {
    const container = document.getElementById('table');
    if (container) {
      const entry = document.createElement('div');
      entry.textContent = `Type: ${request.type}, Path: ${request.path}`;
      container.appendChild(entry);
    }
    sendResponse({ status: 'data received' });
  }
  // Must return true if you plan to send async response, else false or undefined
  return false;
});
