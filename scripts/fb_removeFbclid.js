export default {
  icon: "<i class='fa-solid fa-link-slash fa-lg'></i>",
  name: {
    en: "Prevent tracking fbclid",
    vi: "Xoá theo dõi fbclid",
  },
  description: {
    en: "Remove fbclid from url, prevent tracking",
    vi: "Xoá fbclid trong url, chặn facebook theo dõi người dùng",
  },

  changeLogs: {
    ["2024-05-13"]: "init",
  },

  pageScript: {
    onBeforeNavigate: (url) => {
      window.stop();
      console.log(url);
    },

    onDocumentStart: () => {
      let url = new URL(window.top.location.href);
      if (url.searchParams.has("fbclid")) {
        url.searchParams.delete("fbclid");
        window.top.stop();
        window.top.location.replace(url);
      }

      // https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2FHoangTran0410%2Fuseful-script%3Ffbclid%3DIwZXh0bgNhZW0CMTAAAR2wEEq4AWIpTqwiFcyIaab4R5Jx8q3ToFSLqgDjo2uuinzm08UzZythx-M_aem_Aa2ynTC9d3WvI4IUX1hQK91ZERaUtTQrn2HQVN4TWq8Bi0N8D-wKmlK8Jt7RtlrC-KvaLZ1Y0XEA6GTeyTaW3h02&h=AT1KZ3zlV1CCqAOvqGSAvGvxsLUvYdGTNB211XK-eyDagh4KfnwiLh-wPes_E4LwW60ZkAtmO059UWmmVGc1D4YSllpY3ov7ShaFv0z-i-PPMoaUcvFfpH2ZRSLVz208tbR1YRe9_7PssKaL6GXg&__tn__=-UK-R&c[0]=AT3crWyPmsQ1a54BHZdsPRwUZIW76DEWQtlyxj65Po4sTy3qlvMsq0gvcELbzLSQv6-9jXWDhITsWbHkyasQ481d6791KgKt4VclZ51aPlTlpNl55qZJGb3GdluwFQrvWa4D8IV4qE-P3DhACbawXIEqWe__KYKSfrq0WNnzKYR_H98TGTXAMSANcRjPuV7dASwcH9jmcK97nvNEs4RNVHaslfKIbtoZNUXIfVBTBJCA1kHjdAL1ft4PrCNoA-v8drVIGC2U
      if (
        url.hostname === "l.facebook.com" &&
        url.pathname === "/l.php" &&
        url.searchParams.has("u")
      ) {
        let realLink = url.searchParams.get("u");
        realLink = decodeURIComponent(realLink);
        realLink = new URL(realLink);
        realLink.searchParams.delete("fbclid");
        realLink = realLink.toString();
        window.top.stop();
        window.top.location.replace(realLink);
      }
    },
  },
};
