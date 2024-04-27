import { isTitle } from "../popup/helpers/utils.js";
import { tabs } from "../popup/tabs.js";

function generateMd(lang = "vi") {
  let index = 1;
  let md = tabs
    .map((tab) => {
      let title = tab.name[lang];

      let scripts = tab.scripts
        ?.map((script) => {
          if (isTitle(script)) {
            return "\n" + script.name[lang];
          }

          return `<details>
  <summary>${index++}. ${script.name[lang]}</summary>

  [${lang === "vi" ? "Xem mã nguồn" : "View source"}](/scripts/${script.id}.js)

  <code>${script.description[lang]}</code>

  ${script.description.img ? `![](${script.description.img})` : ""}

</details>`;
        })
        .join("\n");

      return `### ${title}\n${scripts}`;
    })
    .join("\n\n");

  console.log(md);
}

generateMd("vi");
generateMd("en");

export default null;
