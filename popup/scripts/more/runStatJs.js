export default {
  name: {
    en: "Run Stat.js",
    vi: "Chạy stats.js",
  },
  description: {
    en: "Run stat.js in current website",
    vi: "Tính toán FPS website",
  },
  func() {
    var script = document.createElement("script");
    script.onload = function () {
      var stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };
    script.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
    document.head.appendChild(script);
  },
};

