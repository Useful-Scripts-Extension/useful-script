const inputSearch = document.querySelector("#search-inp");
const tableDiv = document.querySelector("table");
const searchCount = document.querySelector("#searchCount");
const ownerLink = document.querySelector("#owner");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function main() {
  try {
    let data = JSON.parse(localStorage.ufs_fb_searchPageForOther) || [];
    let owner =
      JSON.parse(localStorage.ufs_fb_searchPageForOther_owner || "{}") || {};
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
        </tr>
        ${data
          .map((c, i) => {
            return `<tr>
            <td>${i + 1}</td>
            <td><img src="${c.image}" style="max-height: 80px"></img></td>
            <td>
              <a style="font-size: 1.1em" href="${c.url}" target="_blank">${
              c.name
            }</a>
              <br/>
              <span>${c.subTitle?.split?.("\n")?.[1] || ""}</span>
            </td>
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
