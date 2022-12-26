// https://greasyfork.org/en/scripts/431691-bypass-all-shortlinks/code
function userScriptConfigToObject(config) {
  let a = config.split("\n");
  let b = {
    includes: [],
    exclude: [],
    match: [],
  };
  a.forEach((_) => {
    let value = _.split(" ").at(-1);
    if (_.includes("@include")) {
      b.includes.push(value);
    } else if (_.includes("@exclude")) {
      b.exclude.push(value);
    } else if (_.includes("@match")) {
      b.match.push(value);
    }
  });
}
