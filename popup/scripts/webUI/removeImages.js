export default {
  name: {
    en: "Remove images",
    vi: "Xoá mọi hình ảnh",
  },
  description: {
    en: "Remove all images from website",
    vi: "Chỉ để lại văn bản, giúp tập trung hơn",
  },
  func() {
    function toArray(c) {
      var a, k;
      a = new Array();
      for (k = 0; k < c.length; ++k) a[k] = c[k];
      return a;
    }
    var images, img, altText;
    images = toArray(document.images);
    for (var i = 0; i < images.length; ++i) {
      img = images[i];
      altText = document.createTextNode(img.alt);
      img.parentNode.replaceChild(altText, img);
    }
  },
};

