import { isTitle, tabs } from "../popup/tabs.js";

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
          return `\n  ${index++}. [${script.name[lang]}](/scripts/${
            script.id
          }.js): ${script.description[lang]}`;
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
