export default {
  icon: "https://lh3.googleusercontent.com/e8gqesNOLhN-0xivFcaAlwGaoftfxEJcZXcXJ1F2bhoqrozs3mCYgLhPC0qJ9izdGYRnHwfXegimH9fjj3IBwlby9ZA=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Download watching Instagram Story",
    vi: "Tải Story Instagram đang xem",
  },
  description: {
    en: "Download instagram story that you are watching",
    vi: "Tải instagram story bạn đang xem",
  },
  
  onClickExtension: function () {
    // Source code extracted from: https://chrome.google.com/webstore/detail/story-saver/mafcolokinicfdmlidhaebadidhdehpk

    let videos = document.querySelectorAll("video");
    let storyUrl = null;
    for (let i = videos.length - 1; i >= 0; i--) {
      if (videos[i].offsetHeight === 0) continue;
      let reactKey = "";
      keys = Object.keys(videos[i]);
      for (let j = 0; j < keys.length; j++) {
        if (keys[j].indexOf("__reactFiber") != -1) {
          reactKey = keys[j].split("__reactFiber")[1];
          break;
        }
      }
      try {
        //prettier-ignore
        storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[0].data.hdSrc;
      } catch (e) {}
      if (storyUrl == null) {
        try {
          //prettier-ignore
          storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.hdSrc;
        } catch (e) {}
      }
      if (storyUrl == null) {
        try {
          //prettier-ignore
          storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[0].data.sdSrc;
        } catch (e) {}
      }
      if (storyUrl == null) {
        try {
          //prettier-ignore
          storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.sdSrc;
        } catch (e) {}
      }
      if (storyUrl == null) {
        try {
          //prettier-ignore
          storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.hdSrc;
        } catch (e) {}
      }
      if (storyUrl == null) {
        try {
          //prettier-ignore
          storyUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.sdSrc;
        } catch (e) {}
      }
      if (storyUrl == null) {
        try {
          //prettier-ignore
          storyUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.hd_src;
        } catch (e) {}
      }
      if (storyUrl == null) {
        try {
          //prettier-ignore
          storyUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.sd_src;
        } catch (e) {}
      }
      if (storyUrl != null) break;
    }

    if (!storyUrl) {
      let video = null;
      for (let i = 0; i < videos.length; i++) {
        if (videos[i].offsetHeight !== 0) video = videos[i];
      }

      storyUrl = video?.children[0]?.src;
    }

    if (!storyUrl) {
      let imgs = document.querySelectorAll("img");
      for (let img of imgs) {
        if (
          img.nextSibling &&
          getComputedStyle(img.nextSibling).overflow === "hidden"
        ) {
          imgUrl = img.srcset.split(",")[0].split(" ")[0];
          break;
        }
      }
    }

    if (storyUrl) window.open(storyUrl);
    else alert("Không tìm thấy instagram story nào trong trang web.");
  },
};

function backup() {
  // https://greasyfork.org/en/scripts/404535-ig-helper/code
  async function getStories(userId) {
    let url = `https://www.instagram.com/graphql/query/?query_hash=15463e8449a83d3d60b06be7e90627c7&variables=%7B%22reel_ids%22:%5B%22${userId}%22%5D,%22precomposed_overlay%22:false%7D`;
    let res = await fetch(url);
    let json = await res.json();
    return json;
  }

  async function getUserId(username) {
    let url = `https://www.instagram.com/web/search/topsearch/?query=${username}`;
    let res = await feetch(url);
    let json = await res.json();
    return json.users[0];
  }

  // postPath example: /p/CixHwr6AxZ9/
  async function getBlobMedia(postPath) {
    let postShortCode = postPath.substring(3, postPath.length - 1);
    let url = `https://www.instagram.com/graphql/query/?query_hash=2c4c2e343a8f64c625ba02b2aa12c7f8&variables=%7B%22shortcode%22:%22${postShortCode}%22}`;
    let res = await fetch(url);
    let json = await res.json();
    return json.data;
  }
}
