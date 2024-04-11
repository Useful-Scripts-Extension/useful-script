window.onload = () => {
  // get url from params
  const src = new URLSearchParams(window.location.search).get("src");
  const img = document.querySelector("img");
  const input = document.querySelector("input");

  if (src) {
    let largestSrc =
      UsefulScriptGlobalPageContext.Utils.getLargestImageSrc(src);
    img.src = largestSrc;
    input.value = largestSrc;
  }

  input.addEventListener("input", () => {
    img.src = input.value;
    window.history.replaceState(null, null, "?src=" + input.value);
  });

  window.addEventListener("focusout", () => {
    isDragging = false;
  });

  var isDragging = false;
  let start = { x: 0, y: 0 };
  let mouse = { x: 0, y: 0 };
  let transform = {
    x: 0,
    y: 0,
    scale: 1,
  };
  function update() {
    img.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
  }

  img.draggable = false;
  img.onload = function () {
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    let minW = 200;
    let minH = 200;
    let maxW = screen.width - 100;
    let maxH = screen.height - 200;

    img.style.maxWidth = maxW + "px";
    img.style.maxHeight = maxH + "px";
    img.style.minWidth = minW + "px";
    img.style.minHeight = minH + "px";

    if (w > maxW) {
      h = h * (maxW / w);
      w = maxW;
    }
    if (h > maxH) {
      w = w * (maxH / h);
      h = maxH;
    }
    if (w < minW) {
      h = h * (minW / w);
      w = minW;
    }
    if (h < minH) {
      w = w * (minH / h);
      h = minH;
    }
    // set window size
    window.resizeTo(w, h + 100);
    // set window position center
    window.moveTo(screen.width / 2 - w / 2, screen.height / 2 - h / 2);
  };

  img.addEventListener("mousedown", function (e) {
    isDragging = true;
    start.x = e.clientX - transform.x;
    start.y = e.clientY - transform.y;
  });

  img.addEventListener("mouseup", function () {
    isDragging = false;
  });

  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (isDragging) {
      var newPosX = e.clientX - start.x;
      var newPosY = e.clientY - start.y;
      transform.x = newPosX;
      transform.y = newPosY;
      update();
    }
  });

  // Make image zoomable
  document.addEventListener("wheel", function (e) {
    var delta = e.deltaY || e.detail || e.wheelDelta;
    let scale = transform.scale;
    if (delta > 0) scale -= scale * 0.2;
    else scale += scale * 0.2;

    // move center
    transform.x -=
      (mouse.x - transform.x - img.width / 2) * (scale - transform.scale);
    transform.y -=
      (mouse.y - transform.y - img.height / 2) * (scale - transform.scale);
    transform.scale = scale;

    update();
  });
};
