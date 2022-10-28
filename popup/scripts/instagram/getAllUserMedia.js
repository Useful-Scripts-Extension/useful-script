export async function getAllUserMedia() {
  let user_id = prompt("Enter user id:", "");
  if (!user_id) return;
  function getBiggestMediaFromNode(node) {
    if (node.is_video) {
      return getUniversalCdnUrl(node.video_url);
    } else {
      let r = node.display_resources;
      return r[r.length - 1]?.src;
    }
  }
  function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
  function getUniversalCdnUrl(cdnLink) {
    const cdn = new URL(cdnLink);
    cdn.host = "scontent.cdninstagram.com";
    return cdn.href;
  }
  let all_urls = [];
  let after = "";
  while (true) {
    console.log("FETCHING...");
    let data = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=396983faee97f4b49ccbe105b4daf7a0&variables={"id":"${user_id}","first":50,"after":"${after}"}`
    );
    let json = await data.json();
    let edges = json?.data?.user?.edge_owner_to_timeline_media?.edges || [];
    console.log(`Found ${edges?.length} medias. Processing...`);
    let urls = [];
    edges.forEach((e) => {
      let childs = e.node?.edge_sidecar_to_children?.edges;
      if (childs) {
        urls.push(...childs.map((c) => getBiggestMediaFromNode(c.node)));
      } else {
        urls.push(getBiggestMediaFromNode(e.node));
      }
    });
    all_urls.push(...urls);
    console.log(`Saved ${urls.length} medias. (TOTAL: ${all_urls.length})`);
    let pageInfo = json?.data?.user?.edge_owner_to_timeline_media?.page_info;
    if (pageInfo?.has_next_page) {
      after = pageInfo?.end_cursor;
    } else {
      console.log("[STOP] THIS IS THE LAST PAGE.");
      break;
    }
  }
  console.log(all_urls);
  download(all_urls.join("\n"), user_id, ".txt");
}
