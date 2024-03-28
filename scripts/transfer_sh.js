export default {
  icon: "https://transfer.sh/favicon.ico",
  name: {
    en: "Transfer.sh - Share file faster",
    vi: "Transfer.sh - Chia sẻ file nhanh",
  },
  description: {
    en: "Upload file and get URL to share",
    vi: "Tải file lên và nhận về link để chia sẻ",
  },

  onClickExtension: function () {
    // https://transfer.sh

    // x-url-delete: https://transfer.sh/xtRy1u/Screenshot%20%281%29.png/Fpg96TDmuH5x

    // https://stackoverflow.com/a/52757538/11898496
    function selectFile(contentType, multiple) {
      return new Promise((resolve) => {
        let input = document.createElement("input");
        input.type = "file";
        input.multiple = multiple;
        if (contentType) input.accept = contentType;

        input.onchange = (_) => {
          let files = Array.from(input.files);
          if (multiple) resolve(files);
          else resolve(files[0]);
        };

        input.click();
      });
    }

    // https://stackoverflow.com/a/69400632/11898496
    function uploadFileWithProgress(url, file, onProgress) {
      const xhr = new XMLHttpRequest();
      return {
        cancel: xhr.abort,
        startUpload: () =>
          new Promise((resolve) => {
            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                let { loaded, total } = event;
                let percent = loaded / total;
                onProgress?.({ percent, loaded, total });
              }
            });
            xhr.onreadystatechange = () => {
              if (xhr.readyState === xhr.HEADERS_RECEIVED) {
                const urlDelete = xhr.getResponseHeader("x-url-delete");
                resolve(urlDelete);
              }
            };
            xhr.open("PUT", url, true);
            xhr.send(file);
          }),
      };
    }

    // <input type="file" value="Chọn file" />
    // <p>HOẶC</p>
    // <a href="https://transfer.sh/" target="_blank">Mở transfer.sh trong tab mới</a>

    (async () => {
      let html = /*html*/ `<div class="transfer-sh-container">

            <div class="inner-container">
                <button id="close-btn">X</button>
                <h1><a href="https://transfer.sh/" target="_blank">Transfer.sh</a></h1>

                <div class="loader"></div>
                <p class="status">Đang tải lên...</p>
                <p class="file-info">File name</p>
                <progress id="upload-progress" value="0" max="100"> </progress>

                <div class="result"></div>

            </div>

            <style>
                .transfer-sh-container {
                    display: none;
                    position: fixed;
                    top:0;left:0;right:0;bottom:0;
                    background: #333e;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999999;
                }
                .transfer-sh-container .inner-container {
                    position: relative;
                    background: #eee;
                    padding: 15px 20px;
                    text-align:center;
                }
                .transfer-sh-container #close-btn {
                    position: absolute;
                    top:-5px;right:-5px;
                    padding: 5px 10px;
                    border: none;
                    background: #a22;
                    color: white;
                }
                .transfer-sh-container #close-btn:hover {
                    cursor: pointer;
                    background: #f22;
                }
                .transfer-sh-container h1 {
                    margin-bottom: 20px;
                }
                .loader {
                    display: none;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #3498db;
                    animation: spin 1s linear infinite;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    margin: 0 auto 5px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>`;

      let div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);

      const containerDiv = document.querySelector(".transfer-sh-container");
      const status = containerDiv.querySelector(".status");
      const fileInfo = containerDiv.querySelector(".file-info");
      const progressDiv = containerDiv.querySelector("progress");
      const loader = containerDiv.querySelector(".loader");
      const resultDiv = containerDiv.querySelector(".result");
      const closeBtn = containerDiv.querySelector("#close-btn");

      closeBtn.addEventListener("click", function () {
        div.remove();
      });

      //   containerDiv.style.display = "flex";
      //   return;

      let file = await selectFile();
      console.log(file);

      if (file) {
        let url = "https://transfer.sh/" + file.name;
        let { startUpload, cancel } = uploadFileWithProgress(
          url,
          file,
          ({ percent, loaded, total }) => {
            progressDiv.value = percent * 100;

            let uploadDone = percent == 1;
            status.innerText = uploadDone
              ? `Đang tạo link...`
              : `Đang tải lên...`;

            let kb = uploadDone
              ? ~~(file.size / 1e3) + "Kb"
              : `${~~(loaded / 1e3)}/${~~(total / 1e3)}Kb`;
            fileInfo.innerText = `${file.name}\n(${kb})`;
          }
        );

        fileInfo.innerText = `${file.name}\n(${~~(file.size / 1e3)}Kb)`;
        containerDiv.style.display = "flex";
        loader.style.display = "block";
        closeBtn.addEventListener("click", cancel);

        let urlDelete = await startUpload();
        status.innerText = `Tải lên hoàn tất`;
        loader.style.display = "none";

        if (urlDelete) {
          let url = urlDelete.slice(0, urlDelete.lastIndexOf("/"));
          let deletionToken = urlDelete.slice(urlDelete.lastIndexOf("/") + 1);
          let downloadZipUrl = url + ".zip";
          let downloadTarGzUrl = url + ".tar.gz";

          resultDiv.innerHTML = /*html*/ `<div style="text-align:left">
            <span>URL:</span> <input value="${url}" /><br/>
            <span>Delete token:</span> <input value="${deletionToken}" /><br/>
            <span>Download .zip</span> <input value="${downloadZipUrl}" /><br/>
            <span>Download .tar.gz</span> <input value="${downloadTarGzUrl}" />
          </div>`;
        } else {
          alert(
            "Lỗi\n\nBạn có thể mở trang web sau để upload file:",
            "https://transfer.sh/"
          );
        }
      }
    })();
  },
};

function backup() {
  function uploadFile(url, file) {
    fetch(url, {
      method: "PUT",
      body: file,
    })
      .then((res) => {
        console.log(res);
        console.log(res.headers.get("x-url-delete"));

        alert("sucecss");
      })
      .catch((e) => {
        alert("ERROR " + e);
      });
  }
}
