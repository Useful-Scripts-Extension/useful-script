/*!
 * @name fetch-proxy.js
 * @description fetch request hook, the usage remains consistent with xhr-proxy of https://github.com/wendux/Ajax-hook to support the monitoring and modification of fetch requests
 * @version 0.0.1
 * @author xxxily
 * @date 2022/05/20 16:18
 * @github https://github.com/xxxily
 */

import { proxy, unProxy } from "../ajax-hook/xhr-proxy";
import { fetchProxy, unFetchProxy } from "./fetch-proxy";

function networkProxy(proxyConf = {}, win) {
  proxy(proxyConf, win);
  fetchProxy(proxyConf, win);
}

function unNetworkProxy(win) {
  unProxy(win);
  unFetchProxy(win);
}

export { fetchProxy, unFetchProxy, networkProxy, unNetworkProxy };
