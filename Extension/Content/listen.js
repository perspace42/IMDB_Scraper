/*
Author: Scott Field
Date: 10/17/2025
Purpose:
listen for user input and receive data from the browser pages DOM.
*/
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


document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(event) {
    const clickedElement = event.target;
    //Send Info To User Interface
    chrome.runtime.sendMessage({ type: 'elementClicked', path: getXPath(clickedElement) }, function(response) {
      console.log('Sent Message, received response:', response ? response : null);
    });
  });
});
