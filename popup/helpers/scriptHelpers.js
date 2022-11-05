import { allScripts } from "../../scripts/index.js";
import { getCurrentURL } from "./utils.js";

export async function getAvailableScripts() {
  let hostname = (await getCurrentURL()).hostname;
  let avai = [];
  for (let script of Object.values(allScripts)) {
    if (await checkBlackWhiteList(script, hostname)) {
      avai.push(script);
    }
  }

  return avai;
}

export async function checkBlackWhiteList(script, hostname = null) {
  if (!hostname) {
    hostname = (await getCurrentURL()).hostname;
  }

  let hasWhiteList = script.whiteList?.length > 0;
  let hasBlackList = script.blackList?.length > 0;
  let inWhiteList = script.whiteList?.findIndex((_) => _ === hostname) >= 0;
  let inBlackList = script.blackList?.findIndex((_) => _ === hostname) >= 0;

  let willRun =
    (!hasWhiteList && !hasBlackList) ||
    (hasWhiteList && inWhiteList) ||
    (hasBlackList && !inBlackList);

  return willRun;
}
