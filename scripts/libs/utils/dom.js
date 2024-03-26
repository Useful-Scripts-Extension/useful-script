export function hideDom(selector, delay) {
  setTimeout(function () {
    const dom = document.querySelector(selector);
    if (dom) {
      dom.style.opacity = 0;
    }
  }, delay || 1000 * 5);
}

/**
 * Search upward operation
 * @param dom {Element} - required initial dom element
 * @param fn {function} - required The callback operation of each level of ParentNode
 * If the function returns true, it means to stop the upward search action
 */
export function eachParentNode(dom, fn) {
  let parent = dom.parentNode;
  while (parent) {
    const isEnd = fn(parent, dom);
    parent = parent.parentNode;
    if (isEnd) {
      break;
    }
  }
}

/**
 * Get the wrapped node based on the width and height of the node
 * @param el {Element} - required The node to be found
 * @param noRecursive {Boolean} - optional to disable recursion, default false
 * @returns {element}
 */
export function getContainer(el, noRecursive) {
  if (!el || !el.getBoundingClientRect) return el;

  const domBox = el.getBoundingClientRect();
  let container = el;
  eachParentNode(el, function (parentNode) {
    if (!parentNode || !parentNode.getBoundingClientRect) return true;
    const parentBox = parentNode.getBoundingClientRect();
    const isInsideTheBox =
      parentBox.width <= domBox.width && parentBox.height <= domBox.height;
    if (isInsideTheBox) {
      container = parentNode;
    } else {
      return true;
    }
  });

  // If the found package node points to itself, try to find it again using parentNode as the package node.
  if (container === el && el.parentNode) {
    if (noRecursive) {
      // Directly use the parent node as the wrapping node
      container = el.parentNode;
    } else {
      // Search again based on the parent node, but no longer recurse further
      container = getContainer(el.parentNode, true);
    }
  }

  return container;
}

/**
 * Dynamically load css content
 * @param cssText {String} - required text content of the style
 * @param id {String} - optional specifies the id number of the style text. If the corresponding id number already exists, it will not be inserted again.
 * @param insetTo {Dom} - optional specifies where to insert
 * @returns {HTMLStyleElement}
 */
export function loadCSSText(cssText, id, insetTo) {
  if (id && document.getElementById(id)) {
    return false;
  }

  const style = document.createElement("style");
  const head =
    insetTo || document.head || document.getElementsByTagName("head")[0];
  style.appendChild(document.createTextNode(cssText));
  head.appendChild(style);

  if (id) {
    style.setAttribute("id", id);
  }

  return style;
}

/**
 * Determine whether the current element is an editable element
 * @param target
 * @returnsBoolean
 */
export function isEditableTarget(target) {
  const isEditable =
    target.getAttribute && target.getAttribute("contenteditable") === "true";
  const isInputDom = /INPUT|TEXTAREA|SELECT|LABEL/.test(target.nodeName);
  return isEditable || isInputDom;
}

/**
 * Determine whether an element is inside shadowDom
 * Reference: https://www.coder.work/article/299700
 * @param node
 * @returns {boolean}
 */
export function isInShadow(node, returnShadowRoot) {
  for (; node; node = node.parentNode) {
    if (node.toString() === "[object ShadowRoot]") {
      if (returnShadowRoot) {
        return node;
      } else {
        return true;
      }
    }
  }
  return false;
}

/**
 * Determine whether an element is in the visible area. It is suitable for passive calling. If high performance is required, please use IntersectionObserver.
 * Reference: https://github.com/febobo/web-interview/issues/84
 * @param element
 * @returns {boolean}
 */
export function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}

/**
 * Judgment of visible area based on IntersectionObserver
 * @param { Function } callback
 * @param { Element } element
 * @returns { IntersectionObserver }
 */
export function observeVisibility(callback, element) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        /* The element is within the visible area */
        callback(entry, observer);
      } else {
        /* The element is not within the visible area */
        callback(null, observer);
      }
    });
  });

  if (element) {
    observer.observe(element);
  }

  /*
Return the observation object so that the outside can cancel the observation: observer.disconnect(), or add a new observation object: observer.observe(element) */
  return observer;
}

// Usage example:
// const temp1 = document.querySelector('#temp1')
// var observer = observeVisibility(function (entry, observer) {
//   if (entry) {
//     console.log('[entry]', entry)
//   } else {
//     console.log('[entry]', 'null')
//   }
// }, temp1)

/**
 * Determine whether the element is invisible, mainly used to determine whether it has left the document flow or is set to display:none.
 * @param {*} element
 * @returns
 */
export function isOutOfDocument(element) {
  if (!element || element.offsetParent === null) {
    return true;
  }

  const { top, right, bottom, left, width, height } =
    element.getBoundingClientRect();

  return (
    top === 0 &&
    right === 0 &&
    bottom === 0 &&
    left === 0 &&
    width === 0 &&
    height === 0
  );
}

// Determine whether the coordinates are within the element
export function isCoordinateInElement(x, y, element) {
  if (!element || !element.getBoundingClientRect) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
    return true;
  } else {
    return false;
  }
}

/**
 * Given a coordinate point, determine its position on the element, which can be left, right, top, bottom, center
 * Note that there is no restriction that the given coordinates must be internal coordinates of the element, they can be any coordinates
 * @param { Number } x - required The x coordinate of the mouse
 * @param { Number } y - required The y coordinate of the mouse
 * @param { Element } element -required element to be judged
 * @param { Number } deadZone - optional dead zone range, default is 0
 * @returns
 */
export function coordinateToPosition(x, y, element, deadZone = 0) {
  const rect = element.getBoundingClientRect();

  const verticalMidpoint = rect.top + rect.height / 2;
  const horizontalMidpoint = rect.left + rect.width / 2;

  const position = {
    horizontal: "",
    vertical: "",
  };

  if (x <= horizontalMidpoint - deadZone) {
    position.horizontal = "left";
  } else if (x >= horizontalMidpoint + deadZone) {
    position.horizontal = "right";
  } else {
    position.horizontal = "center";
  }

  if (y < verticalMidpoint - deadZone) {
    position.vertical = "top";
  } else if (y > verticalMidpoint + deadZone) {
    position.vertical = "bottom";
  } else {
    position.vertical = "center";
  }

  return position;
}

/**
 * Calculate the angle formed between two points
 */
export function calculateDegree(x1, y1, x2, y2) {
  const dy = y2 - y1;
  const dx = x2 - x1;
  let theta = Math.atan2(dy, dx); // Returns radians
  theta *= 180 / Math.PI; // Convert radians to degrees
  return Math.round(theta);
}
