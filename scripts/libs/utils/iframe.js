/**
 * Determine whether it is in an Iframe
 * @returns {boolean}
 */
export function isInIframe() {
  return window !== window.top;
}

/**
 * Determine whether it is in a cross-domain restricted Iframe
 * @returns {boolean}
 */
export function isInCrossOriginFrame() {
  let result = true;
  try {
    if (window.top.localStorage || window.top.location.href) {
      result = false;
    }
  } catch (e) {
    result = true;
  }
  return result;
}
