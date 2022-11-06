export default {
  name: {
    en: "Get all images in insta newfeed",
    vi: "Tải về tất cả ảnh insta newfeed",
  },
  description: {
    en: "Get all images in newfeed",
    vi: "Tải về tất cả ảnh đang có trên newfeed",
  },
  blackList: [],
  whiteList: ["*://*.instagram.com"],

  func: async function () {
    function renderInNewWindow({ link, url } = {}) {
      if (!link?.length) {
        alert("Not found image");
        return;
      }
      let win = window.open(
        "",
        "All images from " + url,
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=500,top=50,left=50"
      );
      let rows = link
        ?.map((_, i) => {
          return `<tr>
          <td>${i}</td>
          <td style="max-width: 400px;text-overflow: ellipsis;"><a href="${_}" target="_blank">${_}</a></td>
          <td><img src="${_}" style="max-width: 350px" /></td>
        </tr>`;
        })
        .join("");

      let html = `<table>
      <tr>
        <th>#</th>
        <th>Link</th>
        <th>Image</th>
      </tr>
      ${rows}
      </table>`;
      win.document.body.innerHTML = html;
    }

    const getAllImgTag = () =>
      Array.from(document.querySelectorAll("img[sizes*=px]")) || [];
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    const img_srcs = [];
    const done = [];
    const img_queue = getAllImgTag();
    while (img_queue.length > 0) {
      const first = img_queue.shift();
      first.scrollIntoView();
      const src = first.src;
      img_srcs.push(src);
      console.log(src);
      done.push(first);
      const new_img = getAllImgTag().filter(
        (_) => done.indexOf(_) == -1 && img_queue.indexOf(_) == -1
      );
      img_queue.push(...new_img);
      await sleep(300);
    }
    console.log(img_srcs);
    renderInNewWindow({ link: img_srcs, url: location.href });
  },
};
