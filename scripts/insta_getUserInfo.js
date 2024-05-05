import { showLoading } from "./helpers/utils.js";

export default {
  icon: "https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",
  name: {
    en: "Get insta user info (uid, avatar, ...)",
    vi: "Lấy insta thông tin user (uid, avatar, ...)",
  },
  description: {
    en: "Get instagram uid, avatar, name, ...",
    vi: "Lấy instagram uid, avatar, tên, ...",
  },

  popupScript: {
    onClick: async function () {
      function renderUser(user, index) {
        //prettier-ignore
        let { pk, username, full_name, is_private, is_verified, pk_id, profile_pic_url, friendship_status, social_context } = user;
        //prettier-ignore
        const {following, incoming_request, outgoing_request, is_bestie, is_restricted, is_feed_favorite} = friendship_status;

        return /*html*/ `<tr>
        <td>${index}</td>
        <td>
          <a href="${profile_pic_url}" target="_blank">
            <img src="${profile_pic_url}" crossorigin="anonymous">
          </a>
        </td>
        <td>${username}<br/><span>${full_name}</span></td>
        <td>${pk_id}<br/>${pk !== pk_id ? pk : ""}</td>
        <td>
          <span>${
            following
              ? "Đang follow"
              : incoming_request
              ? "Đang muốn kết bạn"
              : outgoing_request
              ? "Chờ chấp nhận kết bạn"
              : is_bestie
              ? "Bạn thân"
              : is_restricted
              ? "Đang giảm tương tác"
              : is_feed_favorite
              ? "Yêu thích"
              : ""
          }<span>
        </td>
        <td><span>${social_context || ""}<span></td>
      </tr>
      `;
      }

      let txt = prompt("Nhập username của người muốn xem thông tin:");
      if (txt) {
        const { setLoadingText, closeLoading } = showLoading(
          "Đang lấy thông tin của " + txt
        );
        try {
          // https://stackoverflow.com/a/52808289/11898496
          let res = await fetch(
            "https://www.instagram.com/web/search/topsearch/?query=" + txt
          );
          let json = await res.json();
          if (json.status != "ok") throw Error("Server trả về lỗi");
          console.log(json);

          const { users, places, hashtags } = json;
          if (!users?.length)
            return alert("Không tìm thấy user với tên " + txt);

          let win = window.open(
            "",
            "",
            "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=600,top=50,left=50"
          );
          win.document.title = "Instagram search for " + txt;
          win.document.body.innerHTML = /*html*/ `
          <table>
            <tr>
              <th>#</th>
              <th>avatar</th>
              <th>name</th>
              <th>uid</th>
              <th>status</th>
              <th>social</th>
            </tr>
            ${users.map((data, index) => renderUser(data.user, index)).join("")}
          </table>

          <style>
            body {
              margin: 0;
            }
            span {
              font-size: 0.9em;
              color: #555;
            }
            a {
              display: block;
            }
            img {
              max-width: 150px;
            }
            table {
              font-family: Arial, Helvetica, sans-serif;
              border-collapse: collapse;
              width: 100%;
            }
            td, th {
              border: 1px solid #ddd;
              padding: 8px;
            }
            tr:nth-child(even){background-color: #f2f2f2;}
            tr:hover {background-color: #ddd;}
            th {
              padding-top: 12px;
              padding-bottom: 12px;
              text-align: left;
              background-color: #04AA6D;
              color: white;
            }
          </style>
        `;
        } catch (e) {
          alert("Lỗi " + e);
        } finally {
          closeLoading();
        }
      }
    },
  },
};

function backup() {
  // https://stackoverflow.com/a/38209893/11898496
  const { fbid, id, full_name, usename, profile_pic_url, profile_pic_url_hd } =
    window._sharedData.config.viewer;

  function getUidFromCookie() {
    try {
      const encoded = document.cookie
        .split("; ")
        ?.find((_) => _.startsWith("fbsr"))
        ?.split(".")[1];

      if (!encoded)
        return {
          err: "Không tìm thấy thông tin access token trong cookie!\nBạn đã đăng nhập instagram chưa??",
        };

      const decoded = JSON.parse(atob(encoded));
      console.log(decoded);

      if (decoded?.user_id) return { data: decoded.user_id };
      else return { err: "Không tìm thấy uid từ cookie" };
    } catch (e) {
      return { err: "Lỗi: " + e.toString() };
    }
  }

  async function getUidFromFetch() {
    try {
      let res = fetch(location.href + "?__a=1");
      let text = res.text();
      let json = JSON.parse(text.replace("for (;;);", ""));

      const {
        fbid,
        id,
        username,
        full_name,
        profile_pic_url_hd,
        profile_pic_url,
        edge_owner_to_timeline_media,
      } = json?.graphql?.user || {};
      console.log(json?.graphql?.user);
      return { data: id };
    } catch (e) {
      return { err: "Lỗi " + e };
    }
  }
}
