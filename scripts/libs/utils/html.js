/**
 * Some websites enable CSP, which will prevent innerHTML from being used, so trustedTypes needs to be used.
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
 * @param { String } htmlString - required HTML string
 * @returns
 */
export function createTrustedHTML(htmlString) {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    /* Before creating the default policy, check whether it already exists. */
    let policy = window.trustedTypes.defaultPolicy || null;
    if (!policy) {
      policy = window.trustedTypes.createPolicy("default", {
        createHTML: (string) => string,
      });
    }

    const trustedHTML = policy.createHTML(htmlString);

    return trustedHTML;
  } else {
    return htmlString;
  }
}

/**
 * Parse HTML string and return DOM node array
 * @param { String } -required htmlString HTML string
 * @param { HTMLElement } - optional targetElement target element, if passed in, the parsed node will be added to this element
 * @returns {Array} DOM node array
 */
export function parseHTML(htmlString, targetElement) {
  if (typeof htmlString !== "string") {
    throw new Error("[parseHTML] Input must be a string");
  }

  const trustedHTML = createTrustedHTML(htmlString);

  const parser = new DOMParser();
  const doc = parser.parseFromString(trustedHTML, "text/html");
  const nodes = doc.body.childNodes;
  const result = [];

  if (targetElement && targetElement.appendChild) {
    nodes.forEach((node) => {
      const targetNode = node.cloneNode(true);
      try {
        /* Some websites will rewrite appendChild due to business needs, which may cause appendChild to report an error, so try catch is needed here. */
        targetElement.appendChild(targetNode);
      } catch (e) {
        console.error(
          "[parseHTML] appendChild error",
          e,
          targetElement,
          targetNode
        );
      }
      result.push(targetNode);
    });
  }

  return result.length ? result : nodes;
}
