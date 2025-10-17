/*
Author: Scott Field
Date: 10/17/2025
Purpose:
listen for user input and receive data from the browser pages DOM.
*/
//Global Variables
let isSelecting = false;
let previousElement = null;

//Functions
function getXPath(element) {

  // Get the tag name of the current element in lowercase for XPath
  const tagName = element.tagName.toLowerCase();
  // Get parent node to recursively build XPath upward
  const parent = element.parentNode;

  // Base case: if element is the body, return absolute path to body
  if (element === document.body) {
    return '/html/body';
  }

  // Helper function to find the element's index among siblings with the same tag name
  const idx = (sib, name) => {
    // XPath starts counting at 1
    let count = 1;
    // Iterate over previous siblings to count how many of the same tag precede this node
    for (let sibling = sib.previousSibling; sibling; sibling = sibling.previousSibling) {
      // nodeType 1 means ELEMENT_NODE
      if (sibling.nodeType === 1 && sibling.tagName === name) {
        count++;
      }
    }
    return count;
  };

  // Determine this element's position (index) among siblings with the same tag
  let index = '';
  if (parent) {
    index = `[${idx(element, tagName)}]`;
  }

  // Recursively generate XPath for the parent
  const parentPath = parent ? getXPath(parent) : '';

  // Return path to selected element
  return `${parentPath}/${tagName}${index}`;;
}

function clearHighlight() {
  if (previousElement) {
    previousElement.style.outline = '';
    previousElement.style.cursor = '';
    previousElement = null;
  }
}

function onMouseOver(event) {
  if (!isSelecting) return;

  if (previousElement && previousElement !== event.target) {
    previousElement.style.outline = '';
    previousElement.style.cursor = '';
  }

  previousElement = event.target;
  previousElement.style.outline = '2px solid red';
  previousElement.style.cursor = 'pointer';
}

function onClick(event) {
  if (!isSelecting) return;

  event.preventDefault();
  event.stopPropagation();

  clearHighlight();
  stopSelection();

  const clickedElement = event.target;

  chrome.runtime.sendMessage({ type: 'elementClicked', path: getXPath(clickedElement) });

  console.log('Selected element XPath:', xpath);
}

function startSelection() {
  if (isSelecting) return;
  isSelecting = true;
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('click', onClick, true);
  console.log('Selection mode started');
}

function stopSelection() {
  if (!isSelecting) return;
  isSelecting = false;
  document.removeEventListener('mouseover', onMouseOver);
  document.removeEventListener('click', onClick, true);
  clearHighlight();
  console.log('Selection mode stopped');
}

//Event Listener to Stop / Start Selection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'startSelection') {
    startSelection();
    sendResponse({ status: 'started' });
  } else if (request.type === 'stopSelection') {
    stopSelection();
    sendResponse({ status: 'stopped' });
  }
  return true; // to keep message channel open if needed
});
