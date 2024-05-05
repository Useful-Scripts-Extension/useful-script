export default {
  icon: `<i class="fa-solid fa-arrow-down-z-a fa-lg"></i>`,
  name: {
    en: "Add sort to table",
    vi: "Thêm sắp xếp cho bảng",
  },
  description: {
    en: "Add sort functions to table",
    vi: "Thêm nút chức năng sắp xếp cho từng cột trong table",
  },

  pageScript: {
    onClick: function () {
      function toArray(c) {
        var a, k;
        a = new Array();
        for (k = 0; k < c.length; ++k) a[k] = c[k];
        return a;
      }

      function insAtTop(par, child) {
        if (par.childNodes.length) par.insertBefore(child, par.childNodes[0]);
        else par.appendChild(child);
      }

      function countCols(tab) {
        var nCols, i;
        nCols = 0;
        for (i = 0; i < tab.rows.length; ++i)
          if (tab.rows[i].cells.length > nCols)
            nCols = tab.rows[i].cells.length;
        return nCols;
      }

      function makeHeaderLink(tableNo, colNo, ord) {
        let button = document.createElement("button");
        button.onclick = () => sortTable(tableNo, colNo, ord);
        button.innerText = ord > 0 ? "a" : "d";
        return button;
      }

      function makeHeader(tableNo, nCols) {
        var header, headerCell, i;
        header = document.createElement("tr");
        for (i = 0; i < nCols; ++i) {
          headerCell = document.createElement("td");
          headerCell.appendChild(makeHeaderLink(tableNo, i, 1));
          headerCell.appendChild(document.createTextNode("/"));
          headerCell.appendChild(makeHeaderLink(tableNo, i, -1));
          header.appendChild(headerCell);
        }
        return header;
      }
      g_tables = toArray(document.getElementsByTagName("table"));
      if (!g_tables.length) alert("This page doesn't contain any tables.");
      (function () {
        var j, thead;
        for (j = 0; j < g_tables.length; ++j) {
          thead = g_tables[j].createTHead();
          insAtTop(thead, makeHeader(j, countCols(g_tables[j])));
        }
      })();

      function compareRows(a, b) {
        if (a.sortKey == b.sortKey) return 0;
        return a.sortKey < b.sortKey ? g_order : -g_order;
      }

      function sortTable(tableNo, colNo, ord) {
        var table, rows, nR, bs, i, j, temp;
        g_order = ord;
        g_colNo = colNo;
        table = g_tables[tableNo];
        rows = new Array();
        nR = 0;
        bs = table.tBodies;
        for (i = 0; i < bs.length; ++i)
          for (j = 0; j < bs[i].rows.length; ++j) {
            rows[nR] = bs[i].rows[j];
            temp = rows[nR].cells[g_colNo];
            if (temp) rows[nR].sortKey = temp.innerHTML;
            else rows[nR].sortKey = "";
            ++nR;
          }
        rows.sort(compareRows);
        for (i = 0; i < rows.length; ++i) insAtTop(table.tBodies[0], rows[i]);
      }
    },
  },
};
