export default {
  icon: '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>',
  name: {
    en: "Auto - view largest image",
    vi: "Tự động - xem ảnh lớn nhất",
  },
  description: {
    en: "Auto redirect to largest image, support on some websites",
    vi: "Tự động chuyển trang sang ảnh lớn nhất, hỗ trợ một vài trang web",
    img: "/scripts/auto_redirectLargestImageSrc.png",
  },

  onDocumentEnd: async () => {
    // auto redirect to largest img src
    let url = await UfsGlobal.Utils.getLargestImageSrc(
      location.href,
      location.href
    );
    console.log(url, location.href, url == location.href);
    if (url && url != location.href) {
      if (
        confirm(
          "Found bigger image. Redirect to that now?\n\nTìm thấy ảnh lớn hơn. Chuyển trang ngay?\n\n" +
            url
        )
      ) {
        window.open(url, "_self");
      }
    }
  },
};
