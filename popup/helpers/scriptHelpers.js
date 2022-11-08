import { allScripts } from "../../scripts/index.js";
import { getCurrentURL } from "./utils.js";

export async function getAvailableScripts() {
  let url = await getCurrentURL();
  let avai = [];
  for (let script of Object.values(allScripts)) {
    if (await checkBlackWhiteList(script, url)) {
      avai.push(script);
    }
  }

  return avai;
}

export const GlobalBlackList = ["edge://*", "chrome://*"];
export async function checkBlackWhiteList(script, url = null) {
  if (!url) {
    url = await getCurrentURL();
  }

  let w = script.whiteList,
    b = script.blackList,
    hasWhiteList = w?.length > 0,
    hasBlackList = b?.length > 0,
    inWhiteList = w?.findIndex((_) => isUrlMatchPattern(url, _)) >= 0,
    inBlackList = b?.findIndex((_) => isUrlMatchPattern(url, _)) >= 0,
    inGlobalBlackList =
      GlobalBlackList.findIndex((_) => isUrlMatchPattern(url, _)) >= 0;

  let willRun =
    !inGlobalBlackList &&
    ((!hasWhiteList && !hasBlackList) ||
      (hasWhiteList && inWhiteList) ||
      (hasBlackList && !inBlackList));

  return willRun;
}

export function isUrlMatchPattern(url, pattern) {
  let curIndex = 0,
    visiblePartsInPattern = pattern.split("*").filter((_) => _ !== "");

  for (let p of visiblePartsInPattern) {
    let index = url.indexOf(p, curIndex);
    if (index < 0) return false;
    curIndex = index + p.length;
  }

  return true;
}
