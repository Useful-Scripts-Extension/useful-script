import {
  getCurrentTab,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: "",
  name: {
    en: "View Facebook Story information",
    vi: "Xem thông tin của Facebook Story",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: true,

  func: async function () {
    // Source: https://pastebin.com/CNvUxpfc

    let tab = await getCurrentTab();
    let url = prompt("Nhập link story: ", tab.url);
    if (url == null) return;

    const { closeLoading } = showLoading("Đang lấy thông tin story...");
    let result = await runScriptInCurrentTab(
      (_url) => {
        let dtsg = require("DTSGInitialData").token || window.fb_dtsg;
        let bucketID = _url.split("stories/")[1].split("/")[0];

        return new Promise((resolve, reject) => {
          let data =
            "__a=1&fb_dtsg=" +
            dtsg +
            "&variables=%7B%22bucketID%22%3A%22" +
            bucketID +
            "%22%2C%22initialLoad%22%3Afalse%2C%22scale%22%3A1%7D&doc_id=2586853698032602";

          console.log("Đang tải thông tin...");
          let xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
              try {
                data = JSON.parse(this.responseText).data.bucket;
                console.info(data);

                resolve({
                  "Story ID": data.id,
                  "Author ID": data.owner.id,
                  "Author name": data.owner.name,
                  "Author profile picture": data.owner.profile_picture.uri,
                  "Author profile URL": data.owner.url,
                  Objects: data.unified_stories.edges.map((_, i) => {
                    console.log(_);
                    return {
                      "Picture blured":
                        data.unified_stories.edges[i].node.attachments[0].media
                          .blurredImage.uri,

                      "Picture preview url":
                        data.unified_stories.edges[i].node.attachments[0].media
                          .previewImage.uri,

                      "Total reaction feedback":
                        data.unified_stories.edges[i].node.story_card_info
                          .feedback_summary.total_reaction_count,

                      "Background CSS":
                        data.unified_stories.edges[i].node
                          .story_default_background.color,

                      "Background CSS3":
                        data.unified_stories.edges[i].node
                          .story_default_background.gradient.css,

                      ...(data.unified_stories.edges[i].node.attachments[0]
                        .media.__typename == "Photo"
                        ? {
                            Caption:
                              data.unified_stories.edges[i].node.attachments[0]
                                .media.accessibility_caption,

                            Image:
                              data.unified_stories.edges[i].node.attachments[0]
                                .media.image.uri,
                          }
                        : data.unified_stories.edges[i].node.attachments[0]
                            .media.__typename == "Video"
                        ? {
                            "Permalink video url":
                              data.unified_stories.edges[i].node.attachments[0]
                                .media.permalink_url,

                            "Playable_url url":
                              data.unified_stories.edges[i].node.attachments[0]
                                .media.playable_url,

                            "playable_url_dash url":
                              data.unified_stories.edges[0].node.attachments[0]
                                .media.playable_url_dash,

                            "playableUrlHdString url":
                              data.unified_stories.edges[i].node.attachments[0]
                                .media.playableUrlHdString,

                            "playable_url_quality_hd url":
                              data.unified_stories.edges[i].node.attachments[0]
                                .media.playable_url_quality_hd,
                          }
                        : null),
                    };
                  }),
                });
              } catch (e) {
                alert("ERROR: " + e);
                resolve({});
              }
            }
          });

          xhr.open("POST", "https://www.facebook.com/api/graphql/");
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xhr.send(data);
        });
      },
      [url]
    );
    closeLoading();

    console.log(result);
  },
};
