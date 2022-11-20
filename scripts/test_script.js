export default {
  icon: "",
  name: {
    en: "Test Script",
    vi: "Test Script",
  },
  description: {
    en: "This is just a test script for developer",
    vi: "Dành cho tác giả, dùng để thử nghiệm script mới",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: false,

  func: function () {},
};

function backup() {
  function getLinkFCode() {
    function getDataDownload(linkcode, retry = 1) {
      let info = {
        linkcode: [linkcode],
        withFcode5: 0,
        fcode: "",
      };
      let Authorization = "Bearer " + $("input#acstk").attr("data-value");
      if (retry < 5) {
        $.ajax({
          url: "/api/v3/downloads/download-side-by-side",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(info),
          dataType: "json",
          headers: { Authorization: Authorization },
          success: function (xhr, status, error) {
            // ctrl.StatusDownload = true;
            // ctrl.showModelDowload(true);
            //   ctrl.downloadMulti = xhr;
            //   ctrl.StatusDownload = true;
            //   ctrl.selectedFileDownload[id]["donwloaded"] = true;
            // donwloaded
            //   ctrl.startDownload1by1_1(ctrl.downloadMulti, id);

            console.log(xhr, status, error);
          },
          error: function (error, textStatus) {
            if (textStatus === "timeout") {
              console.log("Retrying ...", retry);
              getDataDownload(linkcode, ++retry);
              return false;
            } else if (error.status == 401) {
              return alert("You need a VIP account to do this.");
            }
            alert(error.responseJSON.errors);
          },
          timeout: 1000,
        });
      } else {
        $.ajax({
          type: "POST",
          url: "/api/v3/downloads/download-side-by-side",
          contentType: "application/json",
          data: JSON.stringify(info),
          dataType: "json",
          beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
          },
          success: function (xhr, status, error) {
            // ctrl.StatusDownload = true;
            // ctrl.showModelDowload(true);
            // ctrl.downloadMulti = xhr;
            // ctrl.StatusDownload = true;
            // ctrl.selectedFileDownload[id]['donwloaded'] = true;
            // donwloaded
            // ctrl.startDownload1by1_1(ctrl.downloadMulti,id);
            console.log(xhr, status, error);
          },
          error: function (error) {
            if (error.status == 401) {
              return alert("You need a VIP account to do this.");
            }
            alert(error.responseJSON.errors);
          },
        });
      }
    }

    getDataDownload($("#linkcode").attr("value"));
  }
}
