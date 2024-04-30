export default {
  icon: `<i class="fa-solid fa-droplet-slash fa-lg"></i>`,
  name: {
    en: "Remove all colors in web",
    vi: "Xoá màu website",
  },
  description: {
    en: "Remove all colours in the web.<br/>Click again to undo.",
    vi: "Xoá mọi màu có trong website.<br/>Bấm lại để hoàn tác.",
  },

  changeLogs: {
    "2024-05-01": "fix cors + undo",
  },

  onClick: function () {
    const ufs_remove_colours_id = "ufs-remove-colours";
    let exist = document.getElementById(ufs_remove_colours_id);
    if (exist) {
      exist.remove();
      return;
    }
    let style = document.createElement("style");
    style.id = "ufs-remove-colours";
    style.textContent = `
      * {
        background: white ! important;
        color: black !important
      }
      :link, :link * {
        color: #0000EE !important
      }
      :visited, :visited * {
        color: #551A8B !important
      }`;
    document.head.appendChild(style);
  },
};
