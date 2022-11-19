export default {
  icon: "https://stc-id.nixcdn.com/v11/images/favicon_64x64.png",
  name: {
    en: "Nhaccuatui music/lyric downloader",
    vi: "Nhaccuatui tải nhạc/lời",
  },
  description: {
    en: "Download the song that be playing in Nhaccuatui",
    vi: "Tải bài nhạc / lời bài hát đang nghe trên Nhaccuatui",
  },
  blackList: [],
  whiteList: ["https://www.nhaccuatui.com/*"],

  func: function () {
    const renderSongInfo = (songInfos, tableId = "") => {
      if (!songInfos?.length) return `<p>Không có gì hết.</p>`;

      let tableBody = songInfos
        .map((songInfo, index) => {
          /*{
          "title": "\n        Tất Cả Đứng Im\n    ",
          "key": "vFWHcoOiGW3c",
          "info": "\n        https://www.nhaccuatui.com/bai-hat/tat-ca-dung-im-ngo-kien-huy-ft-hieuthuhai.vFWHcoOiGW3c.html\n    ",
          "location": "\n        https://stream.nixcdn.com/Sony_Audio111/TatCaDungIm-NgoKienHuyfeatHIEUTHUHAI-8276281.mp3?st=WWlo2aXRDOesGQvgx2s0Zw&e=1668771464\n    ",
          "highquality": "",
          "lyric": "https://lrc-nct.nixcdn.com/null",
          "time": "\n        0:00\n    ",
          "avatar": "https://avatar-ex-swe.nixcdn.com/song/2022/11/14/4/3/5/a/1668415289463.jpg",
          "bgimage": "https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/12/15/e/f/5/9/1608025280378_600.jpg",
          "creator": "\n        Ngô Kiến Huy, HIEUTHUHAI\n    ",
          "newtab": "https://www.nhaccuatui.com/nghe-si-ngo-kien-huy.html",
          "kbit": "320",
          "hasHQ": "true",
          "coverimage": "https://avatar-ex-swe.nixcdn.com/playlist/2022/11/15/c/6/3/d/1668507686992_500.jpg",
          "curPlayIndex": 0,
          "currentTime": 1.098502,
          "duration": 176.300408,
          "played": true,
          "seekInBuffered": 0,
          "blCheck80": false,
          "blCheck60s": false,
          "timePlayed": -1,
          "tempPushGASecond": {},
          "temppushGAPercent": {},
          "timelyricInterval": 12,
          "tempBuffer": 0,
          "timePlayedCheck": true,
          "curPlayInde": 1
      } */
          const {
            title,
            key,
            info,
            location,
            kbit,
            avatar,
            lyric,
            creator,
            newtab,
          } = songInfo;

          let action = `${
            location
              ? `<a href="${location}" target="_blank">Tải nhạc (${kbit}kbit)</a>`
              : "_"
          }
          ${lyric ? `<a href="${lyric}" target="_blank">Tải lyric</a>` : "_"}`;

          return `<tr>
            <td><p>${index + 1}</p></td>
            <td><a href="${avatar}" target="_blank"><img src="${avatar}" style="width:60px" /></a></td>
            <td><a href="${info}" target="_blank">${title}</a></td>
            <td><a href="${newtab}" target="_blank">${creator}</a></td>
            <td>${key}</td>
            <td>${action}</td>
          </tr>`;
        })
        .join("");

      return `<table id="${tableId}">
        <tr>
          <th>#</th>
          <th>Hình</th>
          <th>Tên</th>
          <th>Ca sĩ</th>
          <th>ID bài hát</th>
          <th>Hành động</th>
        </tr>

        ${tableBody}
      </table>`;
    };

    let { listMp3, item } = window.player?.nctPlayerMp3?.streamingMp3 || {};
    console.log(listMp3);

    if (!listMp3?.length) {
      alert("Không tìm thấy bài hát nào");
    } else {
      let tableId = "useful-scripts-table-allsong";
      let div = document.createElement("div");
      div.innerHTML = `
      <div id="useful-scripts-overlay">
        <button onclick="this.parentElement.remove()" class="close-btn">Đóng</button>

        <div class="content-container">
          <h1>Bài hát đang phát</h1>
          ${renderSongInfo([item])}

          <h1>Tất cả bài hát</h1>
          <input type="text" id="myInput" onkeyup="window.filterTable()" placeholder="Tìm bài hát...">
          ${renderSongInfo(listMp3, tableId)}
        </div>
      </div>

      <style>
        #useful-scripts-overlay {
          position:fixed;
          top:0;
          left:0;
          right:0;
          bottom:0;
          background:#000d;
          z-index:9999999
        }

        #useful-scripts-overlay a {
          display: block;
        }

        #useful-scripts-overlay button.close-btn {
          position:fixed;
          top:0;
          right:0;
          padding:5px 10px;
          background: red;
          color: white;
        }

        #useful-scripts-overlay .content-container {
          margin:auto;
          background:white;
          margin:10px;
          padding:10px;
          overflow:auto;
          max-height:90%
        }

        #useful-scripts-overlay h1 {
          font-size:26px;
          font-weight:bold
        }

        #useful-scripts-overlay table {
          border-collapse: collapse;
          width: 100%;
        }

        #useful-scripts-overlay td, #useful-scripts-overlay th {
          border: 1px solid #ddd;
          padding: 8px;
        }

        #useful-scripts-overlay table tr:nth-child(even){background-color: #f2f2f2;}

        #useful-scripts-overlay table tr:hover {background-color: #ddd;}

        #useful-scripts-overlay table th {
          padding-top: 12px;
          padding-bottom: 12px;
          text-align: left;
          background-color: #04AA6D;
          color: white;
        }
      </style>`;
      document.body.appendChild(div);

      // https://www.w3schools.com/howto/howto_js_filter_table.asp
      window.filterTable = function () {
        // Declare variables
        var input, filter, table, tr, tds, i, txtValue, check;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
          tds = Array.from(tr[i].getElementsByTagName("td"));
          if (tds?.length) {
            check = false;

            for (let _td of [
              tds[0], // stt
              tds[2], // tên bài hát
              tds[3], // tên ca six
            ]) {
              txtValue = _td.textContent || _td.innerText || _td.innerHTML;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                check = true;
              }
            }

            if (check) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      };
    }
  },
};
