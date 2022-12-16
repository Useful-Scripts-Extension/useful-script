// Source: https://github.com/fregante/webext-patterns/blob/main/index.ts

export const patternValidationRegex =
  /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;

const isFirefox =
  typeof navigator === "object" && navigator.userAgent.includes("Firefox/");

export const allStarsRegex = isFirefox
  ? /^(https?|wss?):[/][/][^/]+([/].*)?$/
  : /^https?:[/][/][^/]+([/].*)?$/;
export const allUrlsRegex = /^(https?|file|ftp):[/]+/;

function getRawPatternRegex(matchPattern) {
  if (!patternValidationRegex.test(matchPattern)) {
    throw new Error(
      matchPattern +
        " is an invalid pattern, it must match " +
        String(patternValidationRegex)
    );
  }

  let [, protocol, host, pathname] = matchPattern.split(
    /(^[^:]+:[/][/])([^/]+)?/
  );

  protocol = protocol
    .replace("*", isFirefox ? "(https?|wss?)" : "https?") // Protocol wildcard
    .replace(/[/]/g, "[/]"); // Escape slashes

  host = (host ?? "") // Undefined for file:///
    .replace(/^[*][.]/, "([^/]+.)*") // Initial wildcard
    .replace(/^[*]$/, "[^/]+") // Only wildcard
    .replace(/[.]/g, "[.]") // Escape dots
    .replace(/[*]$/g, "[^.]+"); // Last wildcard

  pathname = pathname
    .replace(/[/]/g, "[/]") // Escape slashes
    .replace(/[.]/g, "[.]") // Escape dots
    .replace(/[*]/g, ".*"); // Any wildcard

  return "^" + protocol + host + "(" + pathname + ")?$";
}

export function patternToRegex(...matchPatterns) {
  // No pattern, match nothing https://stackoverflow.com/q/14115522/288906
  if (matchPatterns.length === 0) {
    return /$./;
  }

  if (matchPatterns.includes("<all_urls>")) {
    return allUrlsRegex;
  }

  if (matchPatterns.includes("*://*/*")) {
    return allStarsRegex;
  }

  return new RegExp(matchPatterns.map((x) => getRawPatternRegex(x)).join("|"));
}

// The parens are required by .split() to preserve the symbols
const globSymbols = /([?*]+)/;
function splitReplace(part, index) {
  if (part === "") {
    // Shortcut for speed
    return "";
  }

  if (index % 2 === 0) {
    // Raw text, escape it
    return escapeStringRegexp(part);
  }

  // Else: Symbol
  if (part.includes("*")) {
    // Can be more than one and it swallows surrounding question marks
    return ".*";
  }

  return [...part].map(() => (isFirefox ? "." : ".?")).join("");
}

function getRawGlobRegex(glob) {
  const regexString = glob
    .split(globSymbols)
    // eslint-disable-next-line unicorn/no-array-callback-reference -- tis ok 🤫
    .map(splitReplace)
    .join("");

  // Drop "start with anything" and "end with anything" sequences because they're the default for regex
  return ("^" + regexString + "$")
    .replace(/^[.][*]/, "")
    .replace(/[.][*]$/, "")
    .replace(/^[$]$/, ".+"); // Catch `*` and `*`
}

export function globToRegex(...globs) {
  // No glob, match anything; `include_globs: []` is the default
  if (globs.length === 0) {
    return /.*/;
  }

  return new RegExp(globs.map((x) => getRawGlobRegex(x)).join("|"));
}

// https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
export default function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
