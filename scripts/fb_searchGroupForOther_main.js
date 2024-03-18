const inputSearch = document.querySelector("#search-inp");
const tableDiv = document.querySelector("table");
const searchCount = document.querySelector("#searchCount");
const ownerLink = document.querySelector("#owner");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function main() {
  try {
    let data = JSON.parse(localStorage.ufs_fb_searchGroupForOther) || [];
    let owner =
      JSON.parse(localStorage.ufs_fb_searchGroupForOther_owner || "{}") || {};
    console.log(data, owner);

    let link = "https://fb.com/" + owner.uid;
    ownerLink.innerHTML = `
      <a href="${link}" target="_blank" style="display: inline-block;">
        <img style="max-height: 80px;border-radius: 50%" src="${owner.avatar}" />
        ${owner.name}
      </a>`;
    searchCount.innerHTML = data.length;

    tableDiv.innerHTML = `
        <tr>
          <th>STT</th>
          <th>Ảnh</th>
          <th>Tên</th>
          <th>Mô tả</th>
          <th>Thành viên</th>
        </tr>
        ${data
          .map((c, i) => {
            let link = `https://fb.com/${c.id}`;

            return `<tr>
            <td>${i + 1}</td>
            <td><img src="${
              c.image
            }" style="max-height: 80px;max-width:130px"></img></td>
            <td>
              <a style="font-size: 1.1em" href="${link}" target="_blank">${
              c.title
            }</a>
            </td>
            <td style="max-width:150px">${
              c.subTitle?.split?.("\n")?.[1] || ""
            }</td>
            <td style="text-align: right">${numberWithCommas(
              c.membersCount
            )}</td>
          </tr>`;
          })
          .join("")}
      `;

    inputSearch.oninput = (e) => {
      search(inputSearch.value);
    };
  } catch (e) {
    alert("ERROR: " + e);
  }
}

function search(text) {
  let count = 0;
  [...tableDiv.querySelectorAll("tr")].forEach((tr, index) => {
    if (index == 0) return; // ignore table header

    let html = tr.innerHTML;
    if (!html.toLowerCase().includes(text.toLowerCase())) {
      tr.classList.add("hidden");
    } else {
      tr.classList.remove("hidden");
      count++;
    }
  });
  searchCount.innerHTML = count;
}

main();
