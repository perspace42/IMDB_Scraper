/*
Author: Scott Field
Date: 10/17/2025
Purpose: Dynamically Fill The UI with data received from back end, turns back end Script
on/off
*/

//Code That Depends On Dom Elements
let started = false;
document.addEventListener('DOMContentLoaded', () => {
  const stateBtn = document.getElementById('stateBtn');
  stateBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      if (!started){
        started = true;
        stateBtn.textContent = 'Stop';
        chrome.tabs.sendMessage(tabId, { type: 'startSelection' }, (response) => {
          console.log('Selection started:', response?.status);
        });
      }else{
        started = false;
        stateBtn.textContent = 'Start';
        chrome.tabs.sendMessage(tabId, { type: 'stopSelection' }, (response) => {
          console.log('Selection stopped:', response?.status);
        });
      }
    });
  });
});

//Code That Runs After DOM Elements are already Loaded
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
