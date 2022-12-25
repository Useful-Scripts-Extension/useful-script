export default {
  name: {
    en: "Run Stat.js",
    vi: "Chạy stats.js",
  },
  description: {
    en: "Run stat.js in current website",
    vi: "Tính toán FPS website",
  },

  onClick: function () {
    let src = "//mrdoob.github.io/stats.js/build/stats.min.js";
    var script = document.createElement("script");
    script.onload = function () {
      var stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };
    script.onerror = (event) => {
      alert(
        'Looks like the Content Security Policy directive is blocking the use of script\n\nYou can copy and paste the content of:\n\n"' +
          src +
          '"\n\ninto your console instead\n\n(link is in console already)'
      );
      console.log(src);
    };
    script.src = src;
    document.head.appendChild(script);
  },
};
